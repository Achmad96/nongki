package me.app.nongki.entity;

import jakarta.persistence.*;
import me.app.nongki.embeded.FacilityDetailPrimaryKey;

@Entity
@Table(name = "detail_fasilitas")
public class FacilityDetail {

  @EmbeddedId
  private FacilityDetailPrimaryKey facilityDetailPrimaryKey;

  @ManyToOne
  @JoinColumn(name="id_fasilitas")
  @MapsId("facilityId")
  private Facility facility;

  @ManyToOne
  @JoinColumn(name = "id_space")
  @MapsId("spaceId")
  private Space space;

  public Space getSpace() {
    return space;
  }

  public void setSpace(Space space) {
    this.space = space;
  }


  public FacilityDetail() {}

  public FacilityDetail(FacilityDetailPrimaryKey facilityDetailPrimaryKey) {
    this.facilityDetailPrimaryKey = facilityDetailPrimaryKey;
  }

  public FacilityDetailPrimaryKey getFacilityDetailPrimaryKey() {
    return facilityDetailPrimaryKey;
  }
}
