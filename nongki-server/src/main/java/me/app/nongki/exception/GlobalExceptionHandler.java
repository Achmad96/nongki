package me.app.nongki.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

import static me.app.nongki.util.ResponseUtil.response;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException exception) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response(false, exception.getMessage(), null));
  }

  @ExceptionHandler(BookingConflictException.class)
  public ResponseEntity<?> handleBookingConflictException(BookingConflictException exception) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(response(false, exception.getMessage(), null));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<?> handleIllegalArgumentException(IllegalArgumentException exception) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response(false, exception.getMessage(), null));
  }

  @ExceptionHandler(AuthRejectedException.class)
  public ResponseEntity<?> handleAuthRejectedException(AuthRejectedException exception) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response(false, exception.getMessage(), null));
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<?> handleAuthenticationException(AuthenticationException exception) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response(false, "Invalid email or password.", null));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<?> handleValidationException(MethodArgumentNotValidException exception) {
    final Map<String, String> errors = new HashMap<>();
    exception.getBindingResult().getFieldErrors().forEach((error) -> {
      String fieldName = error.getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });
    return ResponseEntity.badRequest().body(response(false, "Error: Data is not valid.", errors));
  }

  @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
  public ResponseEntity<?> handleHttpMessageNotReadableException(org.springframework.http.converter.HttpMessageNotReadableException exception) {
    return ResponseEntity.badRequest().body(response(false, "Malformed request payload or invalid JSON format.", null));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> handleGlobalException(Exception exception) {
    return ResponseEntity.internalServerError().body(response(false, exception.getMessage(), null));
  }
}
