package me.app.nongki.dto;

public class CreateOrderRequest {

  private String code;
  private String userId;
  private String date;
  private Integer startTime;
  private Integer endTime;

  private Integer totalPrice;

  public void setTotalPrice(Integer totalPrice) {
    this.totalPrice = totalPrice;
  }

  public Integer getTotalPrice() {
    return totalPrice;
  }

  public void setDate(String date) {
    this.date = date;
  }

  public String getDate() {
    return date;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getCode() {
    return code;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getUserId() {
    return userId;
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
