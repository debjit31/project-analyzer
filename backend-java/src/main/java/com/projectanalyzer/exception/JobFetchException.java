package com.projectanalyzer.exception;

/** Raised when the job data API call fails. Maps to HTTP 502. */
public class JobFetchException extends AppException {

    public JobFetchException() {
        super("Failed to fetch job listings.", 502);
    }

    public JobFetchException(String message) {
        super(message, 502);
    }

    public JobFetchException(String message, Throwable cause) {
        super(message, 502);
        initCause(cause);
    }
}
