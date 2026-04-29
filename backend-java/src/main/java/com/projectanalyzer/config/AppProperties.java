package com.projectanalyzer.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

/**
 * Centralised configuration — single source of truth for all settings.
 *
 * <p>Reads from {@code application.properties} / environment variables.
 * Mirrors the Python {@code Settings} class (pydantic-settings).
 */
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {

    // ── Application ───────────────────────────────────────────────────────────
    private String name = "Project Analyzer API";
    private String version = "1.0.0";
    private String env = "development";
    private String logLevel = "INFO";

    // ── CORS ──────────────────────────────────────────────────────────────────
    /** Comma-separated list of allowed origins. */
    private String allowedOrigins = "http://localhost:5173,http://localhost:4173";

    public List<String> getCorsOrigins() {
        return Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    // ── JSearch (RapidAPI) ────────────────────────────────────────────────────
    /** Validated at runtime in JSearchService (empty = JobFetchException on first call). */
    private String jsearchApiKey = "";

    private String jsearchBaseUrl = "https://jsearch.p.rapidapi.com";

    /** Max jobs fetched per search (1–50). */
    private int jsearchMaxResults = 10;

    // ── AI Provider ───────────────────────────────────────────────────────────
    /** "gemini" or "openai" */
    private String aiProvider = "gemini";

    private String geminiApiKey = "";
    private String geminiModel = "gemini-1.5-flash";

    private String openaiApiKey = "";
    private String openaiModel = "gpt-4o-mini";

    // ── Concurrency & Timeouts ────────────────────────────────────────────────
    /** Max concurrent AI analysis calls (1–20). */
    private int aiConcurrencyLimit = 5;

    /** HTTP request timeout in seconds (min 5). */
    private double httpTimeoutSeconds = 30.0;

    // ── Cache ─────────────────────────────────────────────────────────────────
    /** Cache TTL in seconds (min 60). */
    private int cacheTtlSeconds = 600;

    /** Maximum cached search entries (min 16). */
    private int cacheMaxSize = 128;
}
