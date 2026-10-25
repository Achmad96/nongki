package me.app.nongki.repository;

import me.app.nongki.dto.UserDTO;
import me.app.nongki.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {

  /**
   * Finds a user by their email address.
   *
   * @param name the email address of the user to find
   * @return the User object if found, otherwise null
   */
  default User findbyEmail(String name) {
    return findAll().stream()
      .filter(user -> user.getEmail().equals(name))
      .findFirst()
      .orElse(null);
  }

  @Query("SELECT new me.app.nongki.dto.UserDTO(u.id, u.email, u.name, u.phoneNumber) FROM User u")
  List<UserDTO> getAll();

  @Query("SELECT new me.app.nongki.dto.UserDTO(u.id, u.email, u.name, u.phoneNumber) FROM User u WHERE u.id = ?1")
  UserDTO getUserById(String id);
}