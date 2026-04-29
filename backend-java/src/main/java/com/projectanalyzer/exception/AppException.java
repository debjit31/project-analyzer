package com.projectanalyzer.exception;

/**
 * Base application exception — mirrors Python {@code AppError}.
 *
 * <p>All domain exceptions extend this class so the global handler can
 * intercept them in one place.
 */
public class AppException extends RuntimeException {

    private final int statusCode;

    public AppException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
