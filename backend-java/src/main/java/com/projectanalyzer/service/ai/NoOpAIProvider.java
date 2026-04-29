package com.projectanalyzer.service.ai;

import com.projectanalyzer.model.JobAnalysis;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * No-op AI provider — used when no API key is configured.
 *
 * <p>Returns empty analysis so the job-fetch pipeline still works without
 * an LLM key configured. Mirrors Python {@code NoOpAIProvider}.
 */
public class NoOpAIProvider implements AIProvider {

    private static final Logger log = LoggerFactory.getLogger(NoOpAIProvider.class);

    @Override
    public JobAnalysis analyse(String description, String jobTitle, String company) {
        log.debug("noop_ai.analyse — no key configured, returning empty analysis");
        return JobAnalysis.empty();
    }
}
