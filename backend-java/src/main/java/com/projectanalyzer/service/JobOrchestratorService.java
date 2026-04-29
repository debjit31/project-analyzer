package com.projectanalyzer.service;

import com.projectanalyzer.config.AppProperties;
import com.projectanalyzer.model.JobAnalysis;
import com.projectanalyzer.model.JobListing;
import com.projectanalyzer.model.SearchRequest;
import com.projectanalyzer.service.ai.AIProvider;
import com.projectanalyzer.service.ai.AIProviderFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;

/**
 * Core orchestration pipeline: fetch → analyse → cache → return.
 *
 * <p>Mirrors the Python {@code JobOrchestrator} class.
 *
 * <p>Design notes:
 * <ul>
 *   <li>Results are cached by Caffeine (TTL-based) via {@code @Cacheable}.</li>
 *   <li>A {@link Semaphore} caps concurrent AI calls to avoid rate-limit blowups.</li>
 *   <li>AI analysis runs concurrently via {@link CompletableFuture}.</li>
 *   <li>Individual AI failures degrade gracefully (job included with empty analysis).</li>
 * </ul>
 */
@Service
public class JobOrchestratorService {

    private static final Logger log = LoggerFactory.getLogger(JobOrchestratorService.class);

    private final JSearchService jSearchService;
    private final AIProvider aiProvider;
    private final Semaphore semaphore;
    private final ExecutorService executor;

    public JobOrchestratorService(
            JSearchService jSearchService,
            AIProviderFactory aiProviderFactory,
            AppProperties appProperties) {
        this.jSearchService = jSearchService;
        this.aiProvider = aiProviderFactory.create();
        this.semaphore = new Semaphore(appProperties.getAiConcurrencyLimit());
        // Virtual threads if Java 21+; falls back to platform threads on Java 17
        this.executor = Executors.newCachedThreadPool();
    }

    /**
     * Main pipeline entry point.
     *
     * <p>The method is cached by the Caffeine cache named {@code "jobs"}.
     * The cache key is a SHA-256 hash of the search parameters.
     *
     * @param request validated search parameters
     * @return list of enriched job listings (may be empty)
     */
    @Cacheable(value = "jobs", key = "#root.target.cacheKey(#request)")
    public List<JobListing> generateProjects(SearchRequest request) {
        log.info("orchestrator.start title={} location={} date_posted={}",
                request.jobTitle(), request.location(), request.datePosted());

        List<Map<String, String>> rawJobs = jSearchService.search(
                request.jobTitle(), request.location(), request.datePosted());

        if (rawJobs.isEmpty()) {
            log.info("orchestrator.no_jobs");
            return List.of();
        }

        List<JobListing> enriched = analyseAll(rawJobs);
        log.info("orchestrator.done count={}", enriched.size());
        return enriched;
    }

    /**
     * Run AI analysis on all jobs concurrently, bounded by the semaphore.
     *
     * <p>Mirrors Python's {@code asyncio.gather(*tasks, return_exceptions=True)}.
     */
    private List<JobListing> analyseAll(List<Map<String, String>> rawJobs) {
        List<CompletableFuture<JobListing>> futures = rawJobs.stream()
                .map(raw -> CompletableFuture.supplyAsync(() -> analyseOne(raw), executor))
                .toList();

        List<JobListing> results = new ArrayList<>();
        for (CompletableFuture<JobListing> future : futures) {
            try {
                results.add(future.get());
            } catch (Exception ex) {
                log.warn("orchestrator.analysis_future_failed error={}", ex.getMessage());
            }
        }
        return results;
    }

    /** Analyse a single job, acquiring the semaphore to throttle concurrent calls. */
    private JobListing analyseOne(Map<String, String> raw) {
        String jobId = raw.getOrDefault("id", "");
        JobAnalysis analysis;

        try {
            semaphore.acquire();
            try {
                analysis = aiProvider.analyse(
                        raw.getOrDefault("description", ""),
                        raw.getOrDefault("job_title", ""),
                        raw.getOrDefault("company", ""));
            } finally {
                semaphore.release();
            }
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            log.warn("orchestrator.semaphore_interrupted job_id={}", jobId);
            analysis = JobAnalysis.empty();
        } catch (Exception ex) {
            log.warn("orchestrator.analysis_failed job_id={} error={}", jobId, ex.getMessage());
            analysis = JobAnalysis.empty();
        }

        return JobListing.of(
                raw.getOrDefault("id", ""),
                raw.getOrDefault("job_title", ""),
                raw.getOrDefault("company", ""),
                raw.getOrDefault("url", ""),
                raw.getOrDefault("location", ""),
                raw.getOrDefault("posted_date", ""),
                raw.getOrDefault("description", ""),
                analysis);
    }

    /**
     * Deterministic cache key — SHA-256 of the serialised search parameters.
     *
     * <p>Used by the {@code @Cacheable} key SpEL expression so Spring Cache
     * can find the same cache entry for identical requests.
     */
    public String cacheKey(SearchRequest request) {
        String keyData = String.format("title=%s|location=%s|date=%s",
                request.jobTitle(), request.location(), request.datePosted());
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(keyData.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception ex) {
            return keyData;
        }
    }
}
