package com.projectanalyzer.exception;

/** Raised when the LLM analysis call fails. Maps to HTTP 502. */
public class AIAnalysisException extends AppException {

    public AIAnalysisException(String message) {
        super(message, 502);
    }

    public AIAnalysisException(String message, Throwable cause) {
        super(message + ": " + cause.getMessage(), 502);
        initCause(cause);
    }
}
