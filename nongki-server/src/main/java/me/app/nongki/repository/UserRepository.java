package me.app.nongki.repository;

import me.app.nongki.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    default User findbyName(String name){
        return findAll().stream()
                .filter(user -> user.getName().equals(name))
                .findFirst()
                .orElse(null);
    }
}