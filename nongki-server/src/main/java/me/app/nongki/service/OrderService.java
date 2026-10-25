package me.app.nongki.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import me.app.nongki.dto.CreateOrderRequest;
import me.app.nongki.dto.OrderResponseDTO;
import me.app.nongki.embeded.OrderDetailPrimaryKey;
import me.app.nongki.entity.*;
import me.app.nongki.exception.BookingConflictException;
import me.app.nongki.exception.ResourceNotFoundException;
import me.app.nongki.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

  private static final Logger log = LoggerFactory.getLogger(OrderService.class);

  private final UserRepository userRepository;
  private final OrderRepository orderRepository;
  private final OrderDetailRepository orderDetailRepository;
  private final SpaceRepository spaceRepository;
  private final SpaceDetailRepository spaceDetailRepository;
  private final PaymentRepository paymentRepository;
  private final IdempotencyRecordRepository idempotencyRecordRepository;
  private final ObjectMapper objectMapper;

  public OrderService(
      UserRepository userRepository,
      OrderRepository orderRepository,
      OrderDetailRepository orderDetailRepository,
      SpaceRepository spaceRepository,
      SpaceDetailRepository spaceDetailRepository,
      PaymentRepository paymentRepository,
      IdempotencyRecordRepository idempotencyRecordRepository,
      ObjectMapper objectMapper
  ) {
    this.userRepository = userRepository;
    this.orderRepository = orderRepository;
    this.orderDetailRepository = orderDetailRepository;
    this.spaceRepository = spaceRepository;
    this.spaceDetailRepository = spaceDetailRepository;
    this.paymentRepository = paymentRepository;
    this.idempotencyRecordRepository = idempotencyRecordRepository;
    this.objectMapper = objectMapper;
  }

  @Transactional(isolation = Isolation.READ_COMMITTED)
  public OrderResponseDTO createOrder(CreateOrderRequest request, String idempotencyKeyHeader, User authenticatedUser) {
    String idempotencyKey = idempotencyKeyHeader;
    if (idempotencyKey == null || idempotencyKey.isBlank()) {
      idempotencyKey = request.getIdempotencyKey();
    }

    // 1. Idempotency Key check
    if (idempotencyKey != null && !idempotencyKey.isBlank()) {
      Optional<IdempotencyRecord> existingRecord = idempotencyRecordRepository.findById(idempotencyKey);
      if (existingRecord.isPresent()) {
        IdempotencyRecord record = existingRecord.get();
        if ("COMPLETED".equals(record.getStatus())) {
          log.info("Idempotent request detected for key: {}. Returning cached order response.", idempotencyKey);
          try {
            return objectMapper.readValue(record.getResponseBody(), OrderResponseDTO.class);
          } catch (Exception e) {
            log.error("Failed to parse cached idempotency response: {}", e.getMessage());
          }
        } else if ("IN_PROGRESS".equals(record.getStatus())) {
          log.warn("Concurrent request in progress for idempotency key: {}", idempotencyKey);
          throw new BookingConflictException("A request with this idempotency key is already in progress. Please retry shortly.");
        }
      } else {
        IdempotencyRecord newRecord = new IdempotencyRecord(idempotencyKey, request.getUserId(), "IN_PROGRESS");
        idempotencyRecordRepository.saveAndFlush(newRecord);
      }
    }

    // 2. Resolve User
    User user = null;
    if (request.getUserId() != null && !request.getUserId().isBlank()) {
      user = userRepository.findById(request.getUserId()).orElse(null);
    }
    if (user == null && authenticatedUser != null) {
      user = authenticatedUser;
    }
    if (user == null) {
      user = userRepository.findAll().stream().findFirst()
          .orElseThrow(() -> new IllegalArgumentException("No user found in the system"));
    }

    // 3. Validate Date & Time Range
    if (request.getStartTime() == null || request.getEndTime() == null || request.getStartTime() >= request.getEndTime()) {
      throw new IllegalArgumentException("Start Time must be earlier than End Time");
    }
    if (request.getDate() == null || request.getDate().isBlank()) {
      throw new IllegalArgumentException("Date cannot be null or empty");
    }
    if (request.getDate().compareTo(LocalDate.now().toString()) < 0) {
      throw new IllegalArgumentException("Date cannot be in the past");
    }

    // 4. Resolve Desk Codes
    List<String> rawCodes = new ArrayList<>();
    if (request.getCodes() != null && !request.getCodes().isEmpty()) {
      rawCodes.addAll(request.getCodes());
    } else if (request.getCode() != null && !request.getCode().isBlank()) {
      for (String c : request.getCode().split(",")) {
        String trimmed = c.trim();
        if (!trimmed.isEmpty()) {
          rawCodes.add(trimmed);
        }
      }
    }
    if (rawCodes.isEmpty()) {
      throw new IllegalArgumentException("At least one desk code must be specified");
    }

    // Sort codes alphabetically to ensure deterministic lock acquisition order (prevents deadlocks)
    List<String> sortedCodes = rawCodes.stream().distinct().sorted().toList();

    // 5. TRANSACTION LOCK: Acquire pessimistic write lock on SpaceDetail rows
    List<SpaceDetail> lockedSpaceDetails = spaceDetailRepository.findAllByCodeInWithLock(sortedCodes);
    if (lockedSpaceDetails.size() != sortedCodes.size()) {
      Set<String> foundCodes = lockedSpaceDetails.stream().map(SpaceDetail::getCode).collect(Collectors.toSet());
      List<String> missing = sortedCodes.stream().filter(c -> !foundCodes.contains(c)).toList();
      throw new IllegalArgumentException("Space/Desk code(s) not found: " + missing);
    }

    // 6. Conflict Check: verify none of the locked desks have an overlapping booking
    for (String code : sortedCodes) {
      long conflicts = orderDetailRepository.countConflictingOrders(
          code,
          request.getDate(),
          request.getStartTime(),
          request.getEndTime()
      );
      if (conflicts > 0) {
        log.warn("Booking conflict for desk {} on {} from {} to {}", code, request.getDate(), request.getStartTime(), request.getEndTime());
        throw new BookingConflictException("Desk " + code + " is already booked for the selected date and time range.");
      }
    }

    // 7. Create Order
    Order order = new Order(user, null);

    // 8. Create OrderDetails
    String spaceType = "Desk";
    String categoryName = "Standard";
    for (SpaceDetail spaceDetail : lockedSpaceDetails) {
      if (spaceDetail.getSpace() != null) {
        spaceType = spaceDetail.getSpace().getType();
        if (spaceDetail.getSpace().getCategory() != null) {
          categoryName = spaceDetail.getSpace().getCategory().getName();
        }
      }
      OrderDetailPrimaryKey pk = new OrderDetailPrimaryKey(null, spaceDetail.getCode());
      OrderDetail orderDetail = new OrderDetail(pk, request.getDate(), request.getStartTime(), request.getEndTime());
      orderDetail.setOrder(order);
      orderDetail.setSpaceDetail(spaceDetail);
      order.addOrderDetail(orderDetail);
    }

    // 9. Calculate Total Price and Payment
    int hours = request.getEndTime() - request.getStartTime();
    int computedTotal = 0;
    for (SpaceDetail sd : lockedSpaceDetails) {
      int pricePerHour = sd.getSpace() != null ? sd.getSpace().getPrice() : 15000;
      computedTotal += (pricePerHour * hours);
    }

    int finalTotalPrice = (request.getTotalPrice() != null && request.getTotalPrice() > 0)
        ? request.getTotalPrice()
        : computedTotal;

    String method = (request.getPaymentMethod() != null && !request.getPaymentMethod().isBlank())
        ? request.getPaymentMethod()
        : "QRIS";

    Payment payment = new Payment(order, method, finalTotalPrice);
    order.addPayment(payment);

    orderRepository.save(order);

    // 10. Construct Response DTO
    OrderResponseDTO response = new OrderResponseDTO();
    response.setOrderId(order.getId());
    response.setUserId(user.getId());
    response.setUserName(user.getName());
    response.setUserEmail(user.getEmail());
    response.setBookedDesks(sortedCodes);
    response.setSpaceType(spaceType);
    response.setCategory(categoryName);
    response.setDate(request.getDate());
    response.setStartTime(request.getStartTime());
    response.setEndTime(request.getEndTime());
    response.setTotalPrice(finalTotalPrice);
    response.setPaymentMethod(method);
    response.setPaymentId(payment.getId());
    response.setStatus("CONFIRMED");
    response.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

    // 11. Store Completed Idempotency Record
    if (idempotencyKey != null && !idempotencyKey.isBlank()) {
      try {
        String json = objectMapper.writeValueAsString(response);
        IdempotencyRecord record = idempotencyRecordRepository.findById(idempotencyKey)
            .orElse(new IdempotencyRecord(idempotencyKey, user.getId(), "COMPLETED"));
        record.setStatus("COMPLETED");
        record.setResponseCode(201);
        record.setResponseBody(json);
        idempotencyRecordRepository.save(record);
      } catch (Exception e) {
        log.error("Failed to cache idempotency response: {}", e.getMessage());
      }
    }

    log.info("Order {} successfully created for user {} ({}). Desks: {}", order.getId(), user.getName(), user.getEmail(), sortedCodes);
    return response;
  }

  @Transactional(readOnly = true)
  public List<String> getBookedDesks(String date, int startTime, int endTime) {
    if (startTime >= endTime) {
      throw new IllegalArgumentException("Start Time must be earlier than End Time");
    }
    return orderDetailRepository.findBookedCodes(date, startTime, endTime);
  }

  @Transactional(readOnly = true)
  public List<OrderResponseDTO> getUserOrders(String userEmailOrId) {
    List<Order> orders;
    if (userEmailOrId != null && !userEmailOrId.isBlank()) {
      orders = orderRepository.findByUserEmail(userEmailOrId);
      if (orders.isEmpty()) {
        orders = orderRepository.findByUserId(userEmailOrId);
      }
    } else {
      orders = orderRepository.findAllWithDetails();
    }

    List<OrderResponseDTO> result = new ArrayList<>();
    for (Order order : orders) {
      OrderResponseDTO dto = new OrderResponseDTO();
      dto.setOrderId(order.getId());
      if (order.getUser() != null) {
        dto.setUserId(order.getUser().getId());
        dto.setUserName(order.getUser().getName());
        dto.setUserEmail(order.getUser().getEmail());
      }
      List<String> desks = new ArrayList<>();
      String date = "";
      Integer startTime = null;
      Integer endTime = null;
      String spaceType = "Space";
      String category = "Standard";

      for (OrderDetail od : order.getOrderDetails()) {
        if (od.getPrimaryKey() != null) {
          desks.add(od.getPrimaryKey().getCode());
        }
        date = od.getDate();
        startTime = od.getStartTime();
        endTime = od.getEndTime();
        if (od.getSpaceDetail() != null && od.getSpaceDetail().getSpace() != null) {
          spaceType = od.getSpaceDetail().getSpace().getType();
          if (od.getSpaceDetail().getSpace().getCategory() != null) {
            category = od.getSpaceDetail().getSpace().getCategory().getName();
          }
        }
      }
      dto.setBookedDesks(desks);
      dto.setDate(date);
      dto.setStartTime(startTime);
      dto.setEndTime(endTime);
      dto.setSpaceType(spaceType);
      dto.setCategory(category);
      dto.setStatus("CONFIRMED");

      Payment payment = order.getPayments().stream().findFirst().orElse(null);
      if (payment == null) {
        payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
      }
      if (payment != null) {
        dto.setTotalPrice(payment.getTotal());
        dto.setPaymentMethod(payment.getMethod());
        dto.setPaymentId(payment.getId());
      }

      result.add(dto);
    }
    return result;
  }

  @Transactional(readOnly = true)
  public OrderResponseDTO getOrderById(String orderId) {
    Order order = orderRepository.findByIdWithDetails(orderId)
        .orElseGet(() -> orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId)));

    OrderResponseDTO dto = new OrderResponseDTO();
    dto.setOrderId(order.getId());
    if (order.getUser() != null) {
      dto.setUserId(order.getUser().getId());
      dto.setUserName(order.getUser().getName());
      dto.setUserEmail(order.getUser().getEmail());
    }
    List<String> desks = new ArrayList<>();
    for (OrderDetail od : order.getOrderDetails()) {
      if (od.getPrimaryKey() != null) {
        desks.add(od.getPrimaryKey().getCode());
      }
      dto.setDate(od.getDate());
      dto.setStartTime(od.getStartTime());
      dto.setEndTime(od.getEndTime());
      if (od.getSpaceDetail() != null && od.getSpaceDetail().getSpace() != null) {
        dto.setSpaceType(od.getSpaceDetail().getSpace().getType());
        if (od.getSpaceDetail().getSpace().getCategory() != null) {
          dto.setCategory(od.getSpaceDetail().getSpace().getCategory().getName());
        }
      }
    }
    dto.setBookedDesks(desks);
    dto.setStatus("CONFIRMED");

    Payment payment = order.getPayments().stream().findFirst().orElse(null);
    if (payment == null) {
      payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
    }
    if (payment != null) {
      dto.setTotalPrice(payment.getTotal());
      dto.setPaymentMethod(payment.getMethod());
      dto.setPaymentId(payment.getId());
    }

    return dto;
  }
}
