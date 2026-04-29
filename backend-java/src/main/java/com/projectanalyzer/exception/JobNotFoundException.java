package com.projectanalyzer.exception;

/** Raised when a job ID is not found. Maps to HTTP 404. */
public class JobNotFoundException extends AppException {

    public JobNotFoundException(String jobId) {
        super("Job '" + jobId + "' not found.", 404);
    }
}
