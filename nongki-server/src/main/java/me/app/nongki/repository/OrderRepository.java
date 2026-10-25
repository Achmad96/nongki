package me.app.nongki.repository;

import me.app.nongki.entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {

  @EntityGraph(attributePaths = {
      "user",
      "orderDetail",
      "orderDetail.spaceDetail",
      "orderDetail.spaceDetail.space",
      "orderDetail.spaceDetail.space.category",
      "payments"
  })
  List<Order> findByUserId(String userId);

  @EntityGraph(attributePaths = {
      "user",
      "orderDetail",
      "orderDetail.spaceDetail",
      "orderDetail.spaceDetail.space",
      "orderDetail.spaceDetail.space.category",
      "payments"
  })
  List<Order> findByUserEmail(String email);

  @EntityGraph(attributePaths = {
      "user",
      "orderDetail",
      "orderDetail.spaceDetail",
      "orderDetail.spaceDetail.space",
      "orderDetail.spaceDetail.space.category",
      "payments"
  })
  @Query("SELECT o FROM Order o WHERE o.id = :id")
  Optional<Order> findByIdWithDetails(@Param("id") String id);

  @EntityGraph(attributePaths = {
      "user",
      "orderDetail",
      "orderDetail.spaceDetail",
      "orderDetail.spaceDetail.space",
      "orderDetail.spaceDetail.space.category",
      "payments"
  })
  @Query("SELECT o FROM Order o")
  List<Order> findAllWithDetails();
}
