package me.app.nongki.repository;

import me.app.nongki.dto.UserDTO;
import me.app.nongki.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {

  /**
   * Finds a user by their email address using an indexed database query.
   *
   * @param email the email address of the user to find
   * @return the User object if found, otherwise null
   */
  @Query("SELECT u FROM User u WHERE u.email = :email")
  User findByEmail(@Param("email") String email);

  default User findbyEmail(String email) {
    return findByEmail(email);
  }

  @Query("SELECT new me.app.nongki.dto.UserDTO(u.id, u.email, u.name, u.phoneNumber) FROM User u")
  List<UserDTO> getAll();

  @Query("SELECT new me.app.nongki.dto.UserDTO(u.id, u.email, u.name, u.phoneNumber) FROM User u WHERE u.id = ?1")
  UserDTO getUserById(String id);
}
