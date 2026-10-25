package me.app.nongki.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "pembayaran")
public class Payment {

  @Id
  @UuidGenerator
  private String id;

  @Column(name = "metode", length = 50)
  private String method; // "QRIS", "GOPAY", "CASH", "TRANSFER"

  @Column(name = "total_pembayaran")
  private int total;

  @ManyToOne
  @JoinColumn(name = "id_pemesanan")
  private Order order;

  public Payment() {}

  public Payment(Order order, String method, int total) {
    this.order = order;
    this.method = method;
    this.total = total;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public void setMethod(String method) {
    this.method = method;
  }

  public String getMethod() {
    return method;
  }

  public void setTotal(int total) {
    this.total = total;
  }

  public int getTotal() {
    return total;
  }

  public void setOrder(Order order) {
    this.order = order;
  }

  public Order getOrder() {
    return order;
  }
}
