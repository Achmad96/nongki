package me.app.nongki.embeded;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class OrderDetailPrimaryKey implements Serializable {

  @Column(name = "id_pemesanan", length = 36)
  private String orderId;

  @Column(name = "kode_space", length = 2)
  private String code;

  public OrderDetailPrimaryKey() {}

  public OrderDetailPrimaryKey(String orderId, String code) {
    this.orderId = orderId;
    this.code = code;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getSpaceId() {
    return code;
  }

  public void setSpaceId(String code) {
    this.code = code;
  }

  public String getOrderId() {
    return orderId;
  }

  public void setOrderId(String orderId) {
    this.orderId = orderId;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof OrderDetailPrimaryKey that)) return false;
    return Objects.equals(orderId, that.orderId) && Objects.equals(code, that.code);
  }

  @Override
  public int hashCode() {
    return Objects.hash(orderId, code);
  }
}
