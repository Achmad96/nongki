package me.app.nongki.controller;

import jakarta.validation.Valid;
import me.app.nongki.dto.AuthDTO;
import me.app.nongki.entity.User;
import me.app.nongki.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import static me.app.nongki.util.ResponseUtil.response;

@RestController
@RequestMapping("/api/auth/")
@ResponseBody
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @ResponseStatus(HttpStatus.CREATED)
  @PostMapping(value = "/register")
  public ResponseEntity<?> register(@Valid @RequestBody User user) {
    authService.register(user.getEmail(), user.getName(), user.getPassword(), user.getPhoneNumber());
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(response(true, "User registered successfully", null));
  }

  @PostMapping(value = "/login")
  public ResponseEntity<?> login(@Valid @RequestBody User user) {
    final HashMap<String, String> tokenResponse = authService.authenticate(user.getEmail(), user.getPassword());
    return ResponseEntity.status(HttpStatus.OK).body(
        new AuthDTO(tokenResponse.get("token"), tokenResponse.get("expireIn"))
    );
  }
}
