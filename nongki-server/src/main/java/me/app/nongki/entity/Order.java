package me.app.nongki.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "pemesanan")
public class Order {

  @Id
  @UuidGenerator
  private String id;

  @ManyToOne
  @JoinColumn(name = "id_user")
  private User user;

  @ManyToOne
  @JoinColumn(name = "id_karyawan")
  private Employee employee;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<OrderDetail> orderDetail = new HashSet<OrderDetail>();

  public String getId() {
    return id;
  }

  public Order(){}

  public Order(User user, Employee employee) {
    this.user = user;
    this.employee = employee;
  }

  public void setEmployee(Employee employee) {
    this.employee = employee;
  }

  public User getUser() {
    return user;
  }

  public Employee getEmployee() {
    return employee;
  }

  public Set<OrderDetail> getOrderDetails() {
    return orderDetail;
  }

  public void addOrderDetail(OrderDetail orderDetail) {
    this.orderDetail.add(orderDetail);
    orderDetail.setOrder(this);
  }

  public void removeOrderDetail(OrderDetail orderDetail) {
    this.orderDetail.remove(orderDetail);
    orderDetail.setOrder(null);
  }
}
