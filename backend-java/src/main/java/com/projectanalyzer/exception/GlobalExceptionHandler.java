package com.projectanalyzer.exception;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler — mirrors the FastAPI {@code @app.exception_handler} setup.
 *
 * <p>All domain exceptions are translated to a consistent JSON error envelope.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** Handle all domain-specific application errors. */
    @ExceptionHandler(AppException.class)
    public ResponseEntity<Map<String, Object>> handleAppException(AppException ex) {
        log.warn("app_error: status={} message={}", ex.getStatusCode(), ex.getMessage());
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("error", ex.getMessage());
        return ResponseEntity.status(ex.getStatusCode()).body(body);
    }

    /** Handle Jakarta Bean Validation failures (400). */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String details = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        log.warn("validation_error: {}", details);
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("error", "Validation failed: " + details);
        return ResponseEntity.badRequest().body(body);
    }

    /** Catch-all for any unhandled exception (500). */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        log.error("unhandled_exception", ex);
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("error", "Internal server error.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
