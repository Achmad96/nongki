package me.app.nongki.controller;

import me.app.nongki.dto.UserDTO;
import me.app.nongki.entity.User;
import me.app.nongki.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static me.app.nongki.util.ResponseUtil.response;

@RestController
@RequestMapping("/api/users")
@ResponseBody
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(@AuthenticationPrincipal User user) {
    if (user == null && SecurityContextHolder.getContext().getAuthentication() != null) {
      Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
      if (principal instanceof User u) {
        user = u;
      }
    }
    if (user == null) {
      return ResponseEntity.status(401).body(response(false, "User not authenticated", null));
    }
    UserDTO dto = new UserDTO(user.getId(), user.getEmail(), user.getName(), user.getPhoneNumber());
    return ResponseEntity.ok(response(true, "Successfully retrieved user profile", dto));
  }

  @GetMapping
  public ResponseEntity<List<UserDTO>> all() {
    return ResponseEntity.ok(userService.getUsers());
  }

  @GetMapping(value = "/{id}")
  public ResponseEntity<UserDTO> one(@PathVariable String id) {
    return ResponseEntity.ok(userService.getUserById(id));
  }

  @PutMapping(value = "/{id}")
  public ResponseEntity<User> update(@PathVariable String id, @RequestBody User user) {
    return ResponseEntity.ok(userService.updateUser(id, user));
  }
}
