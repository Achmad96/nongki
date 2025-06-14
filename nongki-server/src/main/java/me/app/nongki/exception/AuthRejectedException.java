package me.app.nongki.exception;

public class AuthRejectedException extends RuntimeException {
    public AuthRejectedException(String message) {
        super(message);
    }
}
