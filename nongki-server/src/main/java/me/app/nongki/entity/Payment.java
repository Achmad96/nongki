package me.app.nongki.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "pembayaran")
public class Payment {

  @Id
  @UuidGenerator
  private String id;

  @Column(name = "metode")
  private int method; // 1: Card, 2: QRIS

  @Column(name ="total_pembayaran")
  private int total;

  @ManyToOne
  @JoinColumn(name = "id_pemesanan")
  private Order order;

  public String getId() {
    return id;
  }

  public void setMethod(int method) {
    this.method = method;
  }

  public int getMethod() {
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
