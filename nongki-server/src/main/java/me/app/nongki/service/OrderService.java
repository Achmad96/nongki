package me.app.nongki.service;


import jakarta.transaction.Transactional;
import me.app.nongki.embeded.OrderDetailPrimaryKey;
import me.app.nongki.entity.*;
import me.app.nongki.repository.OrderDetailRepository;
import me.app.nongki.repository.OrderRepository;
import me.app.nongki.repository.SpaceRepository;
import me.app.nongki.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class OrderService {

  private static final Logger log = LoggerFactory.getLogger(OrderService.class);
  private final UserRepository userRepository;
  private final OrderRepository orderRepository;
  private final OrderDetailRepository orderDetailRepository;
  private final SpaceRepository spaceRepository;

  public OrderService(OrderRepository orderRepository, UserRepository userRepository, OrderDetailRepository orderDetailRepository, SpaceRepository spaceRepository) {
    this.orderRepository = orderRepository;
    this.userRepository = userRepository;
    this.orderDetailRepository = orderDetailRepository;
    this.spaceRepository = spaceRepository;
  }

  @Transactional
  public void createOrder(String userId, String code, String date, int startTime, int endTime) {
    if (startTime >= endTime) {
      log.warn("Start Time: {} can't be greater or equal to End Time: {}", startTime, endTime);
      throw new IllegalArgumentException("Start Time cannot be greater or equals to End Time");
    }

    if (userId == null || userId.isEmpty()) {
      log.warn("User ID cannot be null or empty");
      throw new IllegalArgumentException("User ID cannot be null or empty");
    }

    final User user = userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

    final Order order = new Order(user, null);
    orderRepository.save(order);


    if (code == null || code.isEmpty()) {
      log.warn("Space code cannot be null or empty");
      throw new IllegalArgumentException("Space ID cannot be null or empty");
    }

    if (date == null || date.isEmpty()) {
      log.warn("Date cannot be null or empty");
      throw new IllegalArgumentException("Date cannot be null or empty");
    }

    if (date.compareTo(LocalDate.now().toString()) < 0) {
      log.warn("Date cannot be in the past: {}", date);
      throw new IllegalArgumentException("Date cannot be in the past");
    }

    final SpaceDetail spaceDetail = spaceRepository.findDetailByCode(code)
      .orElseThrow(() -> new IllegalArgumentException("Space not found with code: " + code));
    final OrderDetailPrimaryKey orderDetailPrimaryKey = new OrderDetailPrimaryKey(order.getId(), code);
    final OrderDetail orderDetail = new OrderDetail(orderDetailPrimaryKey, date, startTime, endTime);

    spaceDetail.addOrderDetail(orderDetail);
    order.addOrderDetail(orderDetail);
    orderDetailRepository.save(orderDetail);

    log.info("Order created successfully for user: {}, space: {}, date: {}, start time: {}, end time: {}",
             userId, code, date, startTime, endTime);
  }
}
