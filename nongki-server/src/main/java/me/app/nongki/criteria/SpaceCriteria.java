package me.app.nongki.criteria;

public class SpaceCriteria{
  private String categoryId;
  private String type;
  private String date;
  private Integer startTime;
  private Integer endTime;

  public SpaceCriteria(String categoryId, String type, String date, Integer startTime, Integer endTime) {
    this.categoryId = categoryId;
    this.type = type;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public String getType() {
    return type;
  }

  public String getDate() {
    return date;
  }

  public Integer getStartTime() {
    return startTime;
  }

  public Integer getEndTime() {
    return endTime;
  }

  public String getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(String categoryId) {
    this.categoryId = categoryId;
  }

  public void setType(String type) {
    this.type = type;
  }

  public void setDate(String date) {
    this.date = date;
  }

  public void setStartTime(Integer startTime) {
    this.startTime = startTime;
  }

  public void setEndTime(Integer endTime) {
    this.endTime = endTime;
  }
}