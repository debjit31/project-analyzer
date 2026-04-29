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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Google Gemini AI provider.
 *
 * <p>Calls the Gemini REST API directly (no SDK dependency required).
 * Mirrors the Python {@code GeminiProvider}.
 */
public class GeminiAIProvider implements AIProvider {

    private static final Logger log = LoggerFactory.getLogger(GeminiAIProvider.class);

    private static final String GEMINI_API_BASE =
            "https://generativelanguage.googleapis.com/v1beta/models/";

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

    public GeminiAIProvider(WebClient webClient, AppProperties appProperties) {
        if (appProperties.getGeminiApiKey() == null || appProperties.getGeminiApiKey().isBlank()) {
            throw new ConfigurationException(
                    "GEMINI_API_KEY is not set. Add it to your .env file.");
        }
        this.webClient = webClient;
        this.apiKey = appProperties.getGeminiApiKey();
        this.model = appProperties.getGeminiModel();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    @Retry(name = "ai-provider", fallbackMethod = "analyseFallback")
    public JobAnalysis analyse(String description, String jobTitle, String company) {
        String prompt = String.format(
                "Job Title: %s%nCompany: %s%n%nJob Description:%n%s",
                jobTitle, company, description);

        Map<String, Object> requestBody = Map.of(
                "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", SYSTEM_PROMPT))),
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of(
                        "temperature", 0.4,
                        "responseMimeType", "application/json"));

        try {
            String url = GEMINI_API_BASE + model + ":generateContent?key=" + apiKey;
            String rawResponse = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(rawResponse);
            String text = root
                    .path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            log.debug("gemini.response raw={}", text.substring(0, Math.min(300, text.length())));
            return AIResponseParser.parse(text);
        } catch (Exception ex) {
            log.error("gemini.error error={}", ex.getMessage());
            throw new AIAnalysisException("Gemini analysis failed", ex);
        }
    }

    /** Resilience4j fallback — returns a degraded analysis rather than propagating the error. */
    @SuppressWarnings("unused")
    public JobAnalysis analyseFallback(
            String description, String jobTitle, String company, Exception ex) {
        log.warn("gemini.fallback after all retries: {}", ex.getMessage());
        return JobAnalysis.degraded();
    }
}
