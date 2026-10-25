package me.app.nongki.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "fasilitas")
public class Facility {

  @Id
  private String id;

  @Column(name = "jenis")
  private String type;

  public Facility() {}



  public String getId() {
    return id;
  }

  public String getType() {
    return type;
  }
}
