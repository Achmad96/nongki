package me.app.nongki.config;

import me.app.nongki.entity.User;
import me.app.nongki.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    if (userRepository.findbyEmail("admin@nongki.id") == null) {
      User admin = new User(
          "admin@nongki.id",
          "Admin Nongki",
          passwordEncoder.encode("123"),
          "081234567890"
      );
      userRepository.save(admin);
      log.info("Initialized default admin user: admin@nongki.id");
    }
  }
}

