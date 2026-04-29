package com.projectanalyzer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Enriched job listing — job metadata + AI-generated analysis.
 *
 * <p>Mirrors the Python {@code JobListing} Pydantic model.
 */
public record JobListing(
        String id,
        @JsonProperty("job_title") String jobTitle,
        String company,
        String url,
        String location,
        @JsonProperty("posted_date") String postedDate,
        String description,
        JobAnalysis analysis
) {

    /** Compact builder for constructing from a raw JSearch map. */
    public static JobListing of(
            String id,
            String jobTitle,
            String company,
            String url,
            String location,
            String postedDate,
            String description,
            JobAnalysis analysis
    ) {
        return new JobListing(id, jobTitle, company, url, location, postedDate, description, analysis);
    }
}
