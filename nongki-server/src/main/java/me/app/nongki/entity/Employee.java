package me.app.nongki.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "karyawan")
public class Employee {

  @Id
  @UuidGenerator
  private String id;

  @Column(name = "nama", length = 50)
  @Size(min = 5, max = 50)
  private String name;

  @Column(name = "email", length = 50, unique = true)
  private String email;

  @Column(name = "password", length = 100)
  @Size(min = 8, max = 100)
  private String password;

  @Column(name = "nomor_telepon", length = 15)
  @Size(min=11, max=15)
  private String phoneNumber;

  @Column(name = "alamat", length = 50)
  @Size(min = 10, max = 50)
  private String address;

  @Column(name="jenis_kelamin", length = 15)
  private String gender;

  public String getId() {
    return id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getPassword() {
    return password;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getAddress() {
    return address;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public String getGender() {
    return gender;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }
}
