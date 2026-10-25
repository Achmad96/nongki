package me.app.nongki.embeded;

import jakarta.persistence.Embeddable;

@Embeddable
public class OrderDetailPrimaryKey {

  private String orderId;

  private String code;

  public OrderDetailPrimaryKey() {}

  public OrderDetailPrimaryKey(String orderId, String code) {
    this.orderId = orderId;
    this.code = code;
  }

  public String getSpaceId() {
    return code;
  }

  public String getOrderId() {
    return orderId;
  }

  public void setSpaceId(String code) {
    this.code = code;
  }

  public void setOrderId(String orderId) {
    this.orderId = orderId;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof OrderDetailPrimaryKey that)) return false;
    return orderId.equals(that.orderId) && code.equals(that.code);
  }

  @Override
  public int hashCode() {
    int result = orderId.hashCode();
    result = 31 * result + code.hashCode();
    return result;
  }
}
