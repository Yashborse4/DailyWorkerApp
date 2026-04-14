package com.workerdemo.exception;

import com.workerdemo.dto.ErrorResponse;
import com.workerdemo.exception.TooManyRequestsException;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(CallNotPermittedException.class)
    public ResponseEntity<ErrorResponse> handleCallNotPermittedException(CallNotPermittedException ex, HttpServletRequest request) {
        log.error("Circuit breaker is OPEN: {}", ex.getMessage());
        
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR; // Or a more specific one if defined
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.SERVICE_UNAVAILABLE.value())
                .errorCode("ERR_RES_001")
                .error("Service Unavailable")
                .message("The service is temporarily unavailable due to high load or failure. Please try again later.")
                .path(request.getRequestURI())
                .traceId(MDC.get("traceId"))
                .build();
        return new ResponseEntity<>(error, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(TooManyRequestsException.class)
    public ResponseEntity<ErrorResponse> handleTooManyRequestsException(TooManyRequestsException ex, HttpServletRequest request) {
        log.warn("Rate limit exceeded: {}", ex.getMessage());
        
        ErrorCode errorCode = ErrorCode.TOO_MANY_REQUESTS;
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .errorCode(errorCode.getCode())
                .error(errorCode.getStatus().getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .traceId(MDC.get("traceId"))
                .build();
        return new ResponseEntity<>(error, errorCode.getStatus());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex, HttpServletRequest request) {
        log.warn("Business error: Code={}, Message={}", ex.getErrorCode().getCode(), ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(ex.getErrorCode().getStatus().value())
                .errorCode(ex.getErrorCode().getCode())
                .error(ex.getErrorCode().getStatus().getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .traceId(MDC.get("traceId"))
                .build();
        return new ResponseEntity<>(error, ex.getErrorCode().getStatus());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
        log.warn("Bad credentials attempt: {}", ex.getMessage());
        
        ErrorCode errorCode = ErrorCode.BAD_CREDENTIALS;
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .errorCode(errorCode.getCode())
                .error(errorCode.getStatus().getReasonPhrase())
                .message(errorCode.getMessage())
                .path(request.getRequestURI())
                .traceId(MDC.get("traceId"))
                .build();
        return new ResponseEntity<>(error, errorCode.getStatus());
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ErrorResponse> handleLockedException(LockedException ex, HttpServletRequest request) {
        log.warn("Attempt to login to locked account: {}", ex.getMessage());
        
        ErrorCode errorCode = ErrorCode.USER_LOCKED;
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .errorCode(errorCode.getCode())
                .error(errorCode.getStatus().getReasonPhrase())
                .message(errorCode.getMessage())
                .path(request.getRequestURI())
                .traceId(MDC.get("traceId"))
                .build();
        return new ResponseEntity<>(error, errorCode.getStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        log.warn("Validation error: {}", message);

        ErrorCode errorCode = ErrorCode.VALIDATION_FAILED;
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .errorCode(errorCode.getCode())
                .error(errorCode.getStatus().getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .traceId(MDC.get("traceId"))
                .build();
        return new ResponseEntity<>(error, errorCode.getStatus());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(DataIntegrityViolationException ex, HttpServletRequest request) {
        log.error("Database constraint violation: {}", ex.getMessage());
        
        String message = "Database error: This record might already exist (e.g., duplicate username or email).";
        if (ex.getMessage().contains("users_username_key")) {
            message = "Username is already taken.";
        } else if (ex.getMessage().contains("users_email_key")) {
            message = "Email is already registered.";
        }

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value())
                .errorCode("ERR_DB_001")
                .error("Conflict")
                .message(message)
                .path(request.getRequestURI())
                .traceId(MDC.get("traceId"))
                .build();
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler({org.springframework.data.redis.RedisConnectionFailureException.class, org.springframework.dao.QueryTimeoutException.class})
    public ResponseEntity<ErrorResponse> handleRedisConnectionFailure(Exception ex, HttpServletRequest request) {
        log.error("Redis infrastructure is offline: {}. System is operation in Degraded Mode (Fail-Open).", ex.getMessage());
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.OK.value()) // Return 200/OK if we can handle it, or 503 if we must fail
                .errorCode("ERR_DEGRADED_001")
                .error("Degraded Mode")
                .message("A background service (Redis) is temporarily unavailable. Primary operations are still functional.")
                .path(request.getRequestURI())
                .traceId(MDC.get("traceId"))
                .build();
        
        // If this was a critical operation that REQUIRED Redis, we'd return 503.
        // But for many things, we want to inform the client it's degraded but keep going if possible.
        // However, usually, if we are in this handler, it's because a controller/service FAILED.
        return new ResponseEntity<>(error, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex, HttpServletRequest request) {
        log.error("Unhandled runtime exception: ", ex);
        
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .errorCode("ERR_GEN_002")
                .error("Internal Server Error")
                .message("An unexpected error occurred: " + ex.getMessage())
                .path(request.getRequestURI())
                .traceId(MDC.get("traceId"))
                .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception: ", ex);
        
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .errorCode(errorCode.getCode())
                .error(errorCode.getStatus().getReasonPhrase())
                .message(errorCode.getMessage())
                .path(request.getRequestURI())
                .traceId(MDC.get("traceId"))
                .build();
        return new ResponseEntity<>(error, errorCode.getStatus());
    }
}
