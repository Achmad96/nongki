package me.app.nongki.repository;

import me.app.nongki.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
  Optional<Payment> findByOrderId(String orderId);
}

