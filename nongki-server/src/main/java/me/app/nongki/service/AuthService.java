package me.app.nongki.service;

import me.app.nongki.exception.AuthRejectedException;
import me.app.nongki.entity.User;
import me.app.nongki.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class AuthService {

    private final static Logger log = LoggerFactory.getLogger(AuthService.class);
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, JWTService jwtService, PasswordEncoder passwordEncoder) {
      this.authenticationManager = authenticationManager;
      this.userRepository = userRepository;
      this.jwtService = jwtService;
      this.passwordEncoder = passwordEncoder;
    }

    public void register(String email, String name, String password, String nomorTelepon) {
        if (userRepository.findbyEmail(email) != null) {
            throw new RuntimeException("User already exists with email: " + email);
        }
        final String hashedPassword = passwordEncoder.encode(password);
        final User user = new User(email, name, hashedPassword, nomorTelepon);
        userRepository.save(user);
        log.info("Registered user with email: {} and id: {}", email, user.getId());
    }

    public HashMap<String, String> authenticate(String identifier, String password) {
        String email = identifier;
        if ("admin".equalsIgnoreCase(identifier)) {
          email = "admin@nongki.id";
        }

        authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(email, password)
        );

        final User user = userRepository.findbyEmail(email);
        if (user == null) {
            throw new AuthRejectedException("Username or password is incorrect.");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AuthRejectedException("Username or password is incorrect.");
        }
        log.info("User {} logged in successfully", email);
        final String token = jwtService.generateToken(user.getUsername());
        final HashMap<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("expireIn", String.valueOf(jwtService.extractExpiration(token).getTime()));
        return response;
    }

}
