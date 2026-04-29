package com.projectanalyzer.service.ai;

import com.projectanalyzer.model.JobAnalysis;

/**
 * Strategy interface for LLM providers.
 *
 * <p>Mirrors the Python {@code BaseAIProvider} ABC.
 * Implementations: {@link GeminiAIProvider}, {@link OpenAIProvider}, {@link NoOpAIProvider}.
 */
public interface AIProvider {

    /**
     * Analyse a job description and return structured insights.
     *
     * @param description the full job description text (capped at 4000 chars)
     * @param jobTitle    the job title
     * @param company     the company name
     * @return a {@link JobAnalysis} with tech_stack, core_problem, project_idea
     */
    JobAnalysis analyse(String description, String jobTitle, String company);
}
