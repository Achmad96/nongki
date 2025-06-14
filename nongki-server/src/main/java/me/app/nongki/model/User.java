package me.app.nongki.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

@Entity
@Table(name = "user")
public class User {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    @Size(min = 5, message = "Name must be at least 5 characters")
    private String name;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @Size(min = 10, max = 15, message = "Nomor telepon must be between 10 and 15 characters")
    private String nomor_telepon;

    public User(String name, String password) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.password = password;
    }

    public User(String name, String password, String nomor_telepon) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.password = password;
        this.nomor_telepon = nomor_telepon;
    }

    public User() {
        this.id = UUID.randomUUID().toString();
    }

    public String getId() {
        return id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public void setNomorTelepon(String nomor_telepon) {
        this.nomor_telepon = nomor_telepon;
    }

    public String getNomorTelepon() {
        return nomor_telepon;
    }
}
