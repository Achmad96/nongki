package me.app.nongki.controller;

import jakarta.validation.Valid;
import me.app.nongki.model.User;
import me.app.nongki.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static me.app.nongki.util.ResponseUtil.response;

@RestController
@RequestMapping("/api/auth/")
@ResponseBody
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(value = "/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
            userService.register(user.getName(),user.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(response(true,"User registered successfully", null));
    }

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@Valid @RequestBody User user) {
        userService.login(user.getName(), user.getPassword());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(
                response(true, "Login successfully", null)
        );
    }
}
