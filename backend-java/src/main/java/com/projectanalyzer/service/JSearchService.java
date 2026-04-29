package com.projectanalyzer.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectanalyzer.config.AppProperties;
import com.projectanalyzer.exception.JobFetchException;

import io.github.resilience4j.retry.annotation.Retry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * JSearch (RapidAPI) service — fetches real job listings.
 *
 * <p>Mirrors the Python {@code JSearchService}.
 * All HTTP errors are translated to {@link JobFetchException}.
 * Retries use Resilience4j (configured in {@code application.properties}).
 *
 * <p>Docs: <a href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch">JSearch API</a>
 */
@Service
public class JSearchService {

    private static final Logger log = LoggerFactory.getLogger(JSearchService.class);

    private static final Map<String, String> DATE_MAP = Map.of(
            "anytime", "all",
            "24h", "today",
            "7d", "week",
            "30d", "month"
    );

    private final WebClient webClient;
    private final AppProperties appProperties;
    private final ObjectMapper objectMapper;

    public JSearchService(WebClient webClient, AppProperties appProperties) {
        this.webClient = webClient;
        this.appProperties = appProperties;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Search for jobs and return a normalised list of maps.
     *
     * <p>Each map has keys: id, job_title, company, url, location, posted_date, description.
     *
     * @param query      search term (job title + optional location combined)
     * @param location   city / state / "Remote" (may be empty)
     * @param datePosted one of: anytime, 24h, 7d, 30d
     * @return list of raw job maps (up to {@code jsearch-max-results})
     * @throws JobFetchException on any HTTP or network failure
     */
    @Retry(name = "jsearch", fallbackMethod = "searchFallback")
    public List<Map<String, String>> search(
            String query, String location, String datePosted) {

        if (appProperties.getJsearchApiKey() == null
                || appProperties.getJsearchApiKey().isBlank()) {
            throw new JobFetchException(
                    "JSearch API key is not configured. Set JSEARCH_API_KEY in your .env file.");
        }

        String combinedQuery = (query + " " + (location == null ? "" : location)).strip();
        String dateMapped = DATE_MAP.getOrDefault(datePosted, "all");

        log.info("jsearch.search query={} date_posted={}", combinedQuery, dateMapped);

        try {
            long timeoutMillis = (long) (appProperties.getHttpTimeoutSeconds() * 1000);
            String rawResponse = webClient.get()
                    .uri(appProperties.getJsearchBaseUrl() + "/search", uriBuilder ->
                            uriBuilder
                                    .queryParam("query", combinedQuery)
                                    .queryParam("num_pages", "1")
                                    .queryParam("page", "1")
                                    .queryParam("date_posted", dateMapped)
                                    .build())
                    .header("X-RapidAPI-Key", appProperties.getJsearchApiKey())
                    .header("X-RapidAPI-Host", "jsearch.p.rapidapi.com")
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofMillis(timeoutMillis))
                    .block();

            JsonNode root = objectMapper.readTree(rawResponse);
            JsonNode data = root.path("data");

            List<Map<String, String>> results = new ArrayList<>();
            for (JsonNode jobNode : data) {
                results.add(normalise(objectMapper.convertValue(
                        jobNode, new TypeReference<Map<String, Object>>() {})));
                if (results.size() >= appProperties.getJsearchMaxResults()) {
                    break;
                }
            }
            return results;

        } catch (WebClientResponseException ex) {
            log.error("jsearch.http_error status={} body={}",
                    ex.getStatusCode().value(),
                    ex.getResponseBodyAsString().substring(
                            0, Math.min(500, ex.getResponseBodyAsString().length())));
            throw new JobFetchException(
                    "Job search API returned " + ex.getStatusCode().value() + ".", ex);
        } catch (Exception ex) {
            log.error("jsearch.error error={}", ex.getMessage());
            throw new JobFetchException("Network error contacting job search API.", ex);
        }
    }

    /** Resilience4j fallback — rethrows as {@link JobFetchException}. */
    @SuppressWarnings("unused")
    public List<Map<String, String>> searchFallback(
            String query, String location, String datePosted, Exception ex) {
        log.error("jsearch.fallback after all retries error={}", ex.getMessage());
        throw new JobFetchException("Job search failed after retries: " + ex.getMessage(), ex);
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    /** Map JSearch fields to our internal schema. */
    private Map<String, String> normalise(Map<String, Object> raw) {
        String jobId = getString(raw, "job_id");
        if (jobId == null || jobId.isBlank()) {
            jobId = md5Hex(raw.toString()).substring(0, 12);
        }

        String city = getString(raw, "job_city");
        String country = getString(raw, "job_country");
        List<String> locationParts = new ArrayList<>();
        if (city != null && !city.isBlank()) locationParts.add(city);
        if (country != null && !country.isBlank()) locationParts.add(country);
        String location = locationParts.isEmpty()
                ? "Remote"
                : String.join(", ", locationParts);

        String url = getString(raw, "job_apply_link");
        if (url == null || url.isBlank()) url = getString(raw, "job_google_link");
        if (url == null) url = "";

        String postedDate = getString(raw, "job_posted_at_datetime_utc");
        if (postedDate != null && postedDate.length() > 10) {
            postedDate = postedDate.substring(0, 10);
        }

        String description = getString(raw, "job_description");
        if (description == null) description = "";
        if (description.length() > 4000) description = description.substring(0, 4000);

        Map<String, String> result = new HashMap<>();
        result.put("id", jobId);
        result.put("job_title", getStringOrEmpty(raw, "job_title"));
        result.put("company", getStringOrDefault(raw, "employer_name", "Unknown Company"));
        result.put("url", url);
        result.put("location", location);
        result.put("posted_date", postedDate != null ? postedDate : "");
        result.put("description", description);
        return result;
    }

    private static String getString(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return (val instanceof String s && !s.isBlank()) ? s : null;
    }

    private static String getStringOrEmpty(Map<String, Object> map, String key) {
        String val = getString(map, key);
        return val != null ? val : "";
    }

    private static String getStringOrDefault(Map<String, Object> map, String key, String def) {
        String val = getString(map, key);
        return val != null ? val : def;
    }

    private static String md5Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception ex) {
            return Integer.toHexString(input.hashCode());
        }
    }
}
