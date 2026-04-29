package com.projectanalyzer.exception;

/** Raised when a required configuration value is missing. Maps to HTTP 500. */
public class ConfigurationException extends AppException {

    public ConfigurationException(String message) {
        super(message, 500);
    }
}
