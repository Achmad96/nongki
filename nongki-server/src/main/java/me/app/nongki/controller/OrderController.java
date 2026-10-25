package me.app.nongki.controller;

import me.app.nongki.dto.CreateOrderRequest;
import me.app.nongki.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static me.app.nongki.util.ResponseUtil.response;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

  private final OrderService orderService;

  public OrderController(OrderService orderService) {
    this.orderService = orderService;
  }

  @PostMapping(consumes = "application/json", produces = "application/json")
  public ResponseEntity<?> create(@RequestBody CreateOrderRequest request) {
    orderService.createOrder(
        request.getUserId(),
        request.getCode(),
        request.getDate(),
        request.getStartTime(),
        request.getEndTime());
    return ResponseEntity.status(HttpStatus.CREATED)
      .body(response(true, "Order created successfully", null));
  }
}
