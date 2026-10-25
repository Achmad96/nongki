package me.app.nongki.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "kategori")
public class Category {

  @Id
  private String id;

  @Column(name="nama", length = 10)
  private String name;

  @Column(name = "deskripsi", length = 100)
  private String description;

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

}
