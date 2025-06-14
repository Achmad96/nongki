package me.app.nongki.service;

import me.app.nongki.dto.UserDTO;
import me.app.nongki.exception.AuthRejectedException;
import me.app.nongki.exception.ResourceNotFoundException;
import me.app.nongki.model.User;
import me.app.nongki.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public void register(String name, String password) {
        if (userRepository.findbyName(name) != null) {
            throw new RuntimeException("User already exists with name: " + name);
        }
        final String hashedPassword = passwordEncoder.encode(password);
        final User user = new User(name, hashedPassword);
        userRepository.save(user);
        log.info("Registered user with name: {} and id: {}", name, user.getId());
    }

    public void login(String name, String password) {
        final User user = userRepository.findbyName(name);
        if (user == null) {
            throw new AuthRejectedException("Username or password is incorrect.");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AuthRejectedException("Invalid password for user: " + name);
        }
        log.info("User {} logged in successfully", name);
    }

    public User updateUser(String id, User user) {
        final User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        if (user.getName() != null) {
            existingUser.setName(user.getName());
        }
        return userRepository.save(existingUser);
    }

    public List<UserDTO> getUsers() {
        return userRepository.getAll();
    }

    public UserDTO getUserById(String id) {
        return userRepository.getUserById(id);
    }
}
