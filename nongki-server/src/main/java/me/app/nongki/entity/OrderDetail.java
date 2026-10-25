package me.app.nongki.entity;

import jakarta.persistence.*;
import me.app.nongki.embeded.OrderDetailPrimaryKey;

@Entity
@Table(name="detail_pemesanan")
public class OrderDetail {
  
  @EmbeddedId
  private OrderDetailPrimaryKey primaryKey;

  @ManyToOne
  @MapsId("orderId")
  @JoinColumn(name = "id_pemesanan", referencedColumnName = "id")
  private Order order;

  @ManyToOne
  @JoinColumn(name = "kode_space", referencedColumnName = "kode")
  private SpaceDetail spaceDetail;

  @Column(name="tanggal_pesan", length = 15)
  private String date;

  @Column(name="waktu_mulai")
  private Integer startTime;

  @Column(name = "waktu_akhir")
  private Integer endTime;

  public OrderDetail() {}

  public OrderDetail(OrderDetailPrimaryKey primaryKey, String date, Integer startTime, Integer endTime) {
    this.primaryKey = primaryKey;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public void setOrder(Order order) {
    this.order = order;
  }

  public Order getOrder() {
    return order;
  }

  public void setSpaceDetail(SpaceDetail spaceDetail) {
    this.spaceDetail = spaceDetail;
  }

  public SpaceDetail getSpaceDetail() {
    return spaceDetail;
  }

  public OrderDetailPrimaryKey getPrimaryKey() {
    return primaryKey;
  }

  public void setDate(String date) {
    this.date = date;
  }

  public String getDate() {
    return date;
  }

  public void setStartTime(Integer startTime) {
    this.startTime = startTime;
  }

  public Integer getStartTime() {
    return startTime;
  }

  public void setEndTime(Integer endTime) {
    this.endTime = endTime;
  }

  public Integer getEndTime() {
    return endTime;
  }
}
