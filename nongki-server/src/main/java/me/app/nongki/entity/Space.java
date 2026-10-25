package me.app.nongki.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.Set;

@Entity
public class Space {

  @Id
  @UuidGenerator
  private String id;

  @ManyToOne
  @JoinColumn(name = "id_kategori")
  private Category category;

  @Column(name="jenis",length = 20)
  private String type;

  @Column(name="harga")
  private int price;

  @JsonIgnore
  @OneToMany(cascade = CascadeType.ALL, mappedBy = "space")
  private Set<SpaceDetail> spaceDetails;

  public Space() {}

  public String getId() {
    return id;
  }

  public void setCategory(Category category) {
    this.category = category;
  }

  public Category getCategory() {
    return category;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getType() {
    return type;
  }

  public void setPrice(int price) {
    this.price = price;
  }

  public int getPrice() {
    return price;
  }

  public Set<SpaceDetail> getSpaceDetails() {
    return spaceDetails;
  }

  public void setSpaceDetails(Set<SpaceDetail> spaceDetails) {
    this.spaceDetails = spaceDetails;
  }
}
