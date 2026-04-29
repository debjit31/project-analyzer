package com.projectanalyzer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Inbound payload for POST /api/v1/generate-projects and /api/v1/jobs/search.
 *
 * <p>Mirrors the Python {@code SearchRequest} Pydantic model.
 */
public record SearchRequest(
        @JsonProperty("job_title")
        @NotBlank(message = "job_title must not be blank")
        @Size(min = 1, max = 120, message = "job_title must be between 1 and 120 characters")
        String jobTitle,

        @JsonProperty("location")
        @Size(max = 120, message = "location must be at most 120 characters")
        String location,

        @JsonProperty("date_posted")
        @Pattern(
                regexp = "anytime|24h|7d|30d",
                message = "date_posted must be one of: anytime, 24h, 7d, 30d"
        )
        String datePosted
) {

    /** Canonical constructor with defaults applied. */
    public SearchRequest {
        location = (location == null) ? "" : location.strip();
        jobTitle = (jobTitle == null) ? "" : jobTitle.strip();
        datePosted = (datePosted == null || datePosted.isBlank()) ? "anytime" : datePosted;
    }
}
