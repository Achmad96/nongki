package me.app.nongki.repository;

import me.app.nongki.embeded.OrderDetailPrimaryKey;
import me.app.nongki.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, OrderDetailPrimaryKey> {

  @Query("SELECT COUNT(od) FROM OrderDetail od WHERE od.spaceDetail.code = :code AND od.date = :date AND od.startTime < :endTime AND od.endTime > :startTime")
  long countConflictingOrders(
      @Param("code") String code,
      @Param("date") String date,
      @Param("startTime") int startTime,
      @Param("endTime") int endTime
  );

  @Query("SELECT DISTINCT od.spaceDetail.code FROM OrderDetail od WHERE od.date = :date AND od.startTime < :endTime AND od.endTime > :startTime")
  List<String> findBookedCodes(
      @Param("date") String date,
      @Param("startTime") int startTime,
      @Param("endTime") int endTime
  );
}
