package com.projectanalyzer.service.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectanalyzer.config.AppProperties;
import com.projectanalyzer.exception.AIAnalysisException;
import com.projectanalyzer.exception.ConfigurationException;
import com.projectanalyzer.model.JobAnalysis;

import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

/**
 * OpenAI ChatCompletion AI provider.
 *
 * <p>Mirrors the Python {@code OpenAIProvider}.
 */
public class OpenAIProvider implements AIProvider {

    private static final Logger log = LoggerFactory.getLogger(OpenAIProvider.class);

    private static final String OPENAI_API_BASE = "https://api.openai.com/v1/chat/completions";

    private static final String SYSTEM_PROMPT =
            """
            You are a senior software engineer and career strategist.
            Analyse the following job description and return ONLY a valid JSON object
            with EXACTLY these three keys (no markdown, no explanation):

            {
              "tech_stack": ["list", "of", "specific", "technologies"],
              "core_problem": "One or two sentences describing the core technical or business problem the company needs to solve.",
              "project_idea": "A concrete, specific weekend-sized portfolio project a candidate could build to demonstrate they can solve that problem, referencing the actual tech stack."
            }

            Rules:
            - tech_stack must list only concrete technologies/frameworks/languages (e.g. React, PostgreSQL, Kubernetes).
            - core_problem must be specific to this company, not generic HR language.
            - project_idea must be actionable and reference at least two items from tech_stack.
            - Return ONLY the JSON object. No markdown code fences. No preamble.""";

    private final WebClient webClient;
    private final String apiKey;
    private final String model;
    private final ObjectMapper objectMapper;

    public OpenAIProvider(WebClient webClient, AppProperties appProperties) {
        if (appProperties.getOpenaiApiKey() == null || appProperties.getOpenaiApiKey().isBlank()) {
            throw new ConfigurationException(
                    "OPENAI_API_KEY is not set. Add it to your .env file.");
        }
        this.webClient = webClient;
        this.apiKey = appProperties.getOpenaiApiKey();
        this.model = appProperties.getOpenaiModel();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    @Retry(name = "ai-provider", fallbackMethod = "analyseFallback")
    public JobAnalysis analyse(String description, String jobTitle, String company) {
        String userContent = String.format(
                "Job Title: %s%nCompany: %s%n%nJob Description:%n%s",
                jobTitle, company, description);

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "temperature", 0.4,
                "response_format", Map.of("type", "json_object"),
                "messages", List.of(
                        Map.of("role", "system", "content", SYSTEM_PROMPT),
                        Map.of("role", "user", "content", userContent)));

        try {
            String rawResponse = webClient.post()
                    .uri(OPENAI_API_BASE)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(rawResponse);
            String text = root
                    .path("choices").get(0)
                    .path("message").path("content").asText();

            log.debug("openai.response raw={}", text.substring(0, Math.min(300, text.length())));
            return AIResponseParser.parse(text);
        } catch (Exception ex) {
            log.error("openai.error error={}", ex.getMessage());
            throw new AIAnalysisException("OpenAI analysis failed", ex);
        }
    }

    /** Resilience4j fallback — returns a degraded analysis rather than propagating the error. */
    @SuppressWarnings("unused")
    public JobAnalysis analyseFallback(
            String description, String jobTitle, String company, Exception ex) {
        log.warn("openai.fallback after all retries: {}", ex.getMessage());
        return JobAnalysis.degraded();
    }
}
