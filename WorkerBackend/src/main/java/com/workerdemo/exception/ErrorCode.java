package com.workerdemo.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;

@Getter
public enum ErrorCode {
    BAD_CREDENTIALS("ERR_AUTH_001", "Invalid username or password", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED("ERR_AUTH_002", "Access denied", HttpStatus.FORBIDDEN),
    FORBIDDEN("ERR_AUTH_005", "Operation not allowed", HttpStatus.FORBIDDEN),
    VALIDATION_FAILED("ERR_GEN_001", "Validation failed", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND("ERR_AUTH_004", "User not found", HttpStatus.NOT_FOUND),
    TOO_MANY_REQUESTS("ERR_GEN_003", "Too many requests. Please try again later.", HttpStatus.TOO_MANY_REQUESTS),
    INTERNAL_SERVER_ERROR("ERR_GEN_002", "An internal error occurred", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_LOCKED("ERR_AUTH_003", "Account is locked due to multiple failed login attempts", HttpStatus.LOCKED);

    private final String code;
    private final String message;
    private final HttpStatus status;

    ErrorCode(String code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}
