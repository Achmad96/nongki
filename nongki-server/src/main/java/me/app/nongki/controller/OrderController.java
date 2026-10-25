package me.app.nongki.controller;

import me.app.nongki.dto.CreateOrderRequest;
import me.app.nongki.dto.OrderResponseDTO;
import me.app.nongki.entity.User;
import me.app.nongki.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static me.app.nongki.util.ResponseUtil.response;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

  private final OrderService orderService;

  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  @PostMapping(consumes = "application/json", produces = "application/json")
  public ResponseEntity<?> create(
      @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKeyHeader,
      @RequestBody CreateOrderRequest request,
      @AuthenticationPrincipal User user
  ) {
    if (user == null && SecurityContextHolder.getContext().getAuthentication() != null) {
      Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
      if (principal instanceof User u) {
        user = u;
      }
    }

    OrderResponseDTO orderResponse = orderService.createOrder(request, idempotencyKeyHeader, user);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(response(true, "Order created successfully", orderResponse));
  }

  @GetMapping
  public ResponseEntity<?> getUserOrders(
      @RequestParam(name = "user", required = false) String userParam,
      @AuthenticationPrincipal User user
  ) {
    String identifier = userParam;
    if ((identifier == null || identifier.isBlank()) && user != null) {
      identifier = user.getEmail();
    }
    List<OrderResponseDTO> orders = orderService.getUserOrders(identifier);
    return ResponseEntity.ok(response(true, "Successfully retrieved orders", orders));
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getOrderById(@PathVariable String id) {
    OrderResponseDTO order = orderService.getOrderById(id);
    return ResponseEntity.ok(response(true, "Successfully retrieved order", order));
  }

  @GetMapping("/booked-desks")
  public ResponseEntity<?> getBookedDesks(
      @RequestParam(name = "date") String date,
      @RequestParam(name = "start") int startTime,
      @RequestParam(name = "end") int endTime
  ) {
    List<String> bookedCodes = orderService.getBookedDesks(date, startTime, endTime);
    return ResponseEntity.ok(response(true, "Successfully retrieved booked desks", bookedCodes));
  }
}
