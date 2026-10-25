package me.app.nongki.embeded;

import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class FacilityDetailPrimaryKey implements Serializable {

  private String facilityId;
  private String spaceId;

  public String getSpaceId() {
    return spaceId;
  }

  public String getFacilityId() {
    return facilityId;
  }

  public void setSpaceId(String spaceId) {
    this.spaceId = spaceId;
  }

  public void setFacilityId(String facilityId) {
    this.facilityId = facilityId;
  }

  public FacilityDetailPrimaryKey() {
  }

  public FacilityDetailPrimaryKey(String facilityId, String spaceId) {
    this.facilityId = facilityId;
    this.spaceId = spaceId;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (!(obj instanceof FacilityDetailPrimaryKey that)) return false;
    return facilityId.equals(that.facilityId) && spaceId.equals(that.spaceId);
  }

  @Override
  public int hashCode() {
    int result = facilityId.hashCode();
    result = 31 * result + spaceId.hashCode();
    return result;
  }
}
