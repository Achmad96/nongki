package me.app.nongki.repository;

import me.app.nongki.embeded.OrderDetailPrimaryKey;
import me.app.nongki.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, OrderDetailPrimaryKey>  {
}
