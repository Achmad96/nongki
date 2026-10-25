package me.app.nongki.service;

import me.app.nongki.dto.UserDTO;
import me.app.nongki.exception.ResourceNotFoundException;
import me.app.nongki.entity.User;
import me.app.nongki.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User updateUser(String id, User user) {
        final User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        if (user.getName() != null && !user.getName().isBlank()) {
            existingUser.setName(user.getName());
        }
        if (user.getPhoneNumber() != null && !user.getPhoneNumber().isBlank()) {
            existingUser.setPhoneNumber(user.getPhoneNumber());
        }
        log.info("Updating user with id: {} and name: {}", id, existingUser.getName());
        return userRepository.save(existingUser);
    }

    public List<UserDTO> getUsers() {
        return userRepository.getAll();
    }

    public UserDTO getUserById(String id) {
        return userRepository.getUserById(id);
    }
}
