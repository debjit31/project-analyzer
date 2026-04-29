package com.projectanalyzer.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * AI-generated analysis of a job listing.
 *
 * <p>Mirrors the Python {@code JobAnalysis} Pydantic model.
 */
public record JobAnalysis(
        @JsonProperty("tech_stack") List<String> techStack,
        @JsonProperty("core_problem") String coreProblem,
        @JsonProperty("project_idea") String projectIdea
) {

    /** Empty/default analysis used when AI is unavailable or analysis fails. */
    public static JobAnalysis empty() {
        return new JobAnalysis(List.of(), "", "");
    }

    /** Degraded analysis used when parsing the LLM response fails. */
    public static JobAnalysis degraded() {
        return new JobAnalysis(
                List.of(),
                "Analysis unavailable.",
                "Could not generate a project idea for this listing."
        );
    }
}
