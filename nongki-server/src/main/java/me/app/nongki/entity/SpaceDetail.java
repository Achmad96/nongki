package me.app.nongki.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "detail_space")
public class SpaceDetail {

  @Id
  @Column(name = "kode", length = 2)
  private String code;

  @ManyToOne
  @JoinColumn(name = "id_space", referencedColumnName = "id")
  private Space space;

  @JsonIgnore
  @OneToMany(mappedBy = "spaceDetail", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<OrderDetail> orderDetails = new HashSet<OrderDetail>();

  public SpaceDetail() {}

  public SpaceDetail(Space space, String code) {
    this.space = space;
    this.code = code;
  }

  public String getCode() {
    return code;
  }

  public Space getSpace() {
    return space;
  }

  public void setSpace(Space space) {
    this.space = space;
  }

  public Set<OrderDetail> getOrderDetails() {
    return orderDetails;
  }

  public void addOrderDetail(OrderDetail orderDetail) {
    this.orderDetails.add(orderDetail);
    orderDetail.setSpaceDetail(this);
  }

  public void removeOrderDetail(OrderDetail orderDetail) {
    this.orderDetails.remove(orderDetail);
    orderDetail.setSpaceDetail(null);
  }
}
