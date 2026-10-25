package me.app.nongki.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.UuidGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "user")
public class User implements UserDetails {

  @Id
  @UuidGenerator
  private String id;

  @Column(name = "nama")
  @NotBlank(message = "Name is required")
  @Size(min = 5, message = "Name must be at least 5 characters")
  private String name;

  @NotBlank(message = "Email is required")
  @Size(min = 5, max = 50, message = "Email must be between 5 and 50 characters")
  private String email;

  @NotBlank(message = "Password is required")
  @Size(min = 8, message = "Password must be at least 8 characters")
  private String password;

  @Column(name = "nomor_telepon")
  @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
  private String phoneNumber;

  public User(String email, String name, String password,  String phoneNumber) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.phoneNumber = phoneNumber;
  }

  public User() {}

  public String getId() {
    return id;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Override
  public String getUsername() {
    return email;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }
}
