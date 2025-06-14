package me.app.nongki.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

import static me.app.nongki.util.ResponseUtil.response;

@ControllerAdvice
public class GlobalExceptionHandler {
    /**
     * Handles ResourceNotFoundException and returns a 404 Not Found response.
     *
     * @param exception the exception to handle
     * @return a ResponseEntity with a 404 status and the exception message
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException exception) {
        return ResponseEntity.status(404).body(response(false,  exception.getMessage(),  null));
    }

    /**
     * Handles AuthRejectedException and returns a 406 Not Acceptable.
     *
     * @param exception the exception to handle
     * @return a ResponseEntity with a 406 Not Acceptable status and the exception message
     */
    @ExceptionHandler(AuthRejectedException.class)
    public ResponseEntity<?> handleAuthRejectedException(AuthRejectedException exception) {
        return ResponseEntity.status(406).body(response(false, exception.getMessage(), null));
    }

    /**
     * Handles MethodArgumentNotValidException and returns a 400 Bad Request response
     * with validation errors.
     *
     * @param exception the exception to handle
     * @return a ResponseEntity with a 400 status and validation error messages
     */
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


    /**
     * Handles all other exceptions and returns a 500 Internal Server Error response.
     *
     * @param exception the exception to handle
     * @return a ResponseEntity with a 500 status and a generic error message
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception exception) {
        return ResponseEntity.internalServerError().body(response(false, exception.getMessage(), null));
    }
}
