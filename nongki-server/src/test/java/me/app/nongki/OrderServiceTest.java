package me.app.nongki;

import me.app.nongki.dto.CreateOrderRequest;
import me.app.nongki.dto.OrderResponseDTO;
import me.app.nongki.entity.User;
import me.app.nongki.exception.BookingConflictException;
import me.app.nongki.repository.IdempotencyRecordRepository;
import me.app.nongki.repository.OrderDetailRepository;
import me.app.nongki.repository.OrderRepository;
import me.app.nongki.repository.UserRepository;
import me.app.nongki.service.OrderService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.ConcurrencyFailureException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OrderServiceTest {

  @Autowired
  private OrderService orderService;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private OrderRepository orderRepository;

  @Autowired
  private OrderDetailRepository orderDetailRepository;

  @Autowired
  private IdempotencyRecordRepository idempotencyRecordRepository;

  private User testUser;
  private String testDate;

  @BeforeEach
  void setUp() {
    orderRepository.deleteAll();
    idempotencyRecordRepository.deleteAll();

    testDate = LocalDate.now().plusDays(5).toString();
    testUser = userRepository.findbyEmail("admin@nongki.id");
    if (testUser == null) {
      testUser = userRepository.findAll().stream().findFirst().orElse(null);
    }
    assertNotNull(testUser, "A user should exist in the database for testing");
  }

  @AfterEach
  void tearDown() {
    orderRepository.deleteAll();
    idempotencyRecordRepository.deleteAll();
  }

  @Test
  void testCreateOrderSuccessfully() {
    String idempotencyKey = UUID.randomUUID().toString();
    CreateOrderRequest request = new CreateOrderRequest();
    request.setUserId(testUser.getId());
    request.setCodes(List.of("A1"));
    request.setDate(testDate);
    request.setStartTime(8);
    request.setEndTime(10);
    request.setPaymentMethod("QRIS");
    request.setIdempotencyKey(idempotencyKey);

    OrderResponseDTO response = orderService.createOrder(request, idempotencyKey, testUser);

    assertNotNull(response);
    assertNotNull(response.getOrderId());
    assertEquals(testUser.getId(), response.getUserId());
    assertEquals(List.of("A1"), response.getBookedDesks());
    assertEquals(testDate, response.getDate());
    assertEquals(8, response.getStartTime());
    assertEquals(10, response.getEndTime());
    assertEquals("QRIS", response.getPaymentMethod());
    assertEquals("CONFIRMED", response.getStatus());
  }

  @Test
  void testIdempotencyKeyReturnsCachedOrder() {
    String idempotencyKey = UUID.randomUUID().toString();
    CreateOrderRequest request = new CreateOrderRequest();
    request.setUserId(testUser.getId());
    request.setCodes(List.of("A2"));
    request.setDate(testDate);
    request.setStartTime(12);
    request.setEndTime(14);
    request.setPaymentMethod("QRIS");
    request.setIdempotencyKey(idempotencyKey);

    // First call
    OrderResponseDTO response1 = orderService.createOrder(request, idempotencyKey, testUser);
    assertNotNull(response1);

    // Second call with same idempotency key
    OrderResponseDTO response2 = orderService.createOrder(request, idempotencyKey, testUser);
    assertNotNull(response2);
    assertEquals(response1.getOrderId(), response2.getOrderId(), "Idempotent call should return the exact same order ID");
    assertEquals(response1.getTotalPrice(), response2.getTotalPrice());
  }

  @Test
  void testBookingConflictThrowsException() {
    String date = LocalDate.now().plusDays(6).toString();
    CreateOrderRequest request1 = new CreateOrderRequest();
    request1.setUserId(testUser.getId());
    request1.setCodes(List.of("A3"));
    request1.setDate(date);
    request1.setStartTime(9);
    request1.setEndTime(12);
    request1.setPaymentMethod("QRIS");

    OrderResponseDTO response1 = orderService.createOrder(request1, null, testUser);
    assertNotNull(response1);

    // Overlapping booking: 10 to 13 on the same desk and date
    CreateOrderRequest conflictingRequest = new CreateOrderRequest();
    conflictingRequest.setUserId(testUser.getId());
    conflictingRequest.setCodes(List.of("A3"));
    conflictingRequest.setDate(date);
    conflictingRequest.setStartTime(10);
    conflictingRequest.setEndTime(13);
    conflictingRequest.setPaymentMethod("QRIS");

    assertThrows(BookingConflictException.class, () -> {
      orderService.createOrder(conflictingRequest, null, testUser);
    });
  }

  @Test
  void testBookedDesksAvailability() {
    String date = LocalDate.now().plusDays(7).toString();
    CreateOrderRequest request = new CreateOrderRequest();
    request.setUserId(testUser.getId());
    request.setCodes(List.of("A4"));
    request.setDate(date);
    request.setStartTime(10);
    request.setEndTime(12);
    request.setPaymentMethod("QRIS");

    orderService.createOrder(request, null, testUser);

    List<String> booked = orderService.getBookedDesks(date, 11, 13);
    assertTrue(booked.contains("A4"), "A4 should be reported as booked for overlapping slot");

    List<String> nonBooked = orderService.getBookedDesks(date, 13, 15);
    assertFalse(nonBooked.contains("A4"), "A4 should not be booked for non-overlapping slot");
  }

  @Test
  void testConcurrentBookingRaceCondition() throws Exception {
    String date = LocalDate.now().plusDays(8).toString();
    int threadCount = 2;
    ExecutorService executor = Executors.newFixedThreadPool(threadCount);
    CountDownLatch startLatch = new CountDownLatch(1);
    CountDownLatch doneLatch = new CountDownLatch(threadCount);

    AtomicInteger successCount = new AtomicInteger(0);
    AtomicInteger blockedCount = new AtomicInteger(0);

    for (int i = 0; i < threadCount; i++) {
      executor.submit(() -> {
        try {
          startLatch.await();
          CreateOrderRequest request = new CreateOrderRequest();
          request.setUserId(testUser.getId());
          request.setCodes(List.of("B1"));
          request.setDate(date);
          request.setStartTime(9);
          request.setEndTime(11);
          request.setPaymentMethod("QRIS");
          request.setIdempotencyKey(UUID.randomUUID().toString());

          orderService.createOrder(request, null, testUser);
          successCount.incrementAndGet();
        } catch (BookingConflictException | ConcurrencyFailureException e) {
          blockedCount.incrementAndGet();
        } catch (Exception e) {
          System.err.println("Unexpected concurrency exception: " + e.getClass().getName() + " : " + e.getMessage());
          if (e.getCause() instanceof BookingConflictException || e.getCause() instanceof ConcurrencyFailureException) {
            blockedCount.incrementAndGet();
          }
        } finally {
          doneLatch.countDown();
        }
      });
    }

    startLatch.countDown();
    assertTrue(doneLatch.await(10, TimeUnit.SECONDS), "Concurrent tasks should finish within 10 seconds");
    executor.shutdown();

    assertEquals(1, successCount.get(), "Exactly one concurrent booking should succeed");
    assertEquals(1, blockedCount.get(), "The other concurrent booking should be blocked by lock or conflict");
  }

  @Test
  void testGetUserOrdersAndGetOrderById() {
    String date = LocalDate.now().plusDays(9).toString();
    CreateOrderRequest request = new CreateOrderRequest();
    request.setUserId(testUser.getId());
    request.setCodes(List.of("B2"));
    request.setDate(date);
    request.setStartTime(13);
    request.setEndTime(15);
    request.setPaymentMethod("QRIS");

    OrderResponseDTO created = orderService.createOrder(request, null, testUser);
    assertNotNull(created);
    assertNotNull(created.getOrderId());

    // Test getUserOrders
    List<OrderResponseDTO> userOrders = orderService.getUserOrders(testUser.getEmail());
    assertFalse(userOrders.isEmpty(), "User should have at least one order");
    OrderResponseDTO found = userOrders.stream()
        .filter(o -> o.getOrderId().equals(created.getOrderId()))
        .findFirst()
        .orElse(null);
    assertNotNull(found, "Created order should be found in user orders list");
    assertEquals("QRIS", found.getPaymentMethod());
    assertTrue(found.getBookedDesks().contains("B2"));

    // Test getOrderById
    OrderResponseDTO single = orderService.getOrderById(created.getOrderId());
    assertNotNull(single);
    assertEquals(created.getOrderId(), single.getOrderId());
    assertEquals("QRIS", single.getPaymentMethod());
    assertEquals(List.of("B2"), single.getBookedDesks());
  }
}

