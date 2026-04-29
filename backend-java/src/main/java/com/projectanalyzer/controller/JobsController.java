package com.projectanalyzer.controller;

import com.projectanalyzer.model.ApiResponse;
import com.projectanalyzer.model.JobListing;
import com.projectanalyzer.model.SearchRequest;
import com.projectanalyzer.service.JobOrchestratorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for all job-related endpoints under {@code /api/v1/}.
 *
 * <p>Mirrors the Python FastAPI {@code jobs} router.
 *
 * <p>Endpoints:
 * <ul>
 *   <li>{@code GET  /api/v1/health}               — liveness probe</li>
 *   <li>{@code POST /api/v1/generate-projects}     — primary endpoint</li>
 *   <li>{@code POST /api/v1/jobs/search}           — alias for generate-projects</li>
 *   <li>{@code GET  /api/v1/jobs/feed}             — browse endpoint</li>
 *   <li>{@code GET  /api/v1/dashboard/stats}       — aggregate stats</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/v1")
@Tag(name = "jobs", description = "Job listings and AI analysis")
public class JobsController {

    private static final Logger log = LoggerFactory.getLogger(JobsController.class);

    private final JobOrchestratorService orchestrator;

    public JobsController(JobOrchestratorService orchestrator) {
        this.orchestrator = orchestrator;
    }

    // ── Health ────────────────────────────────────────────────────────────────

    @GetMapping("/health")
    @Operation(summary = "Liveness probe", tags = "system")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    // ── Primary endpoint ──────────────────────────────────────────────────────

    /**
     * Full pipeline: fetch jobs from JSearch + AI analysis.
     *
     * <p>Request body: {@code {"job_title":"...", "location":"...", "date_posted":"..."}}
     */
    @PostMapping("/generate-projects")
    @Operation(summary = "Fetch jobs + generate portfolio project ideas", tags = "jobs")
    public ResponseEntity<ApiResponse<List<JobListing>>> generateProjects(
            @Valid @RequestBody SearchRequest request) {

        log.info("api.generate_projects job_title={} location={} date_posted={}",
                request.jobTitle(), request.location(), request.datePosted());

        List<JobListing> listings = orchestrator.generateProjects(request);
        return ResponseEntity.ok(ApiResponse.ok(
                listings,
                "Found " + listings.size() + " job listings."));
    }

    // ── Alias ─────────────────────────────────────────────────────────────────

    /**
     * Alias for {@code /generate-projects} — same behaviour, different URL.
     * Exists for frontend compatibility.
     */
    @PostMapping("/jobs/search")
    @Operation(summary = "Search jobs (alias for /generate-projects)", tags = "jobs")
    public ResponseEntity<ApiResponse<List<JobListing>>> searchJobs(
            @Valid @RequestBody SearchRequest request) {

        log.info("api.jobs_search job_title={} location={} date_posted={}",
                request.jobTitle(), request.location(), request.datePosted());

        return generateProjects(request);
    }

    // ── Job Feed ──────────────────────────────────────────────────────────────

    /**
     * GET-friendly browse endpoint for the Job Feed page.
     *
     * <p>Maps {@code q} → {@code job_title} so the existing orchestrator pipeline
     * is reused without modification. Results are cached just like the POST endpoint.
     */
    @GetMapping("/jobs/feed")
    @Operation(summary = "Browse a curated job feed", tags = "jobs")
    public ResponseEntity<ApiResponse<List<JobListing>>> getJobFeed(
            @RequestParam(defaultValue = "software engineer") String q,
            @RequestParam(defaultValue = "") String location,
            @RequestParam(defaultValue = "anytime") String date_posted) {

        String safeDate = List.of("anytime", "24h", "7d", "30d").contains(date_posted)
                ? date_posted : "anytime";

        SearchRequest request = new SearchRequest(q, location, safeDate);
        log.info("api.job_feed q={} location={} date_posted={}", q, location, safeDate);

        List<JobListing> listings = orchestrator.generateProjects(request);
        return ResponseEntity.ok(ApiResponse.ok(
                listings,
                "Found " + listings.size() + " jobs for '" + q + "'."));
    }

    // ── Dashboard Stats ───────────────────────────────────────────────────────

    /**
     * Returns lightweight market stats used by the dashboard.
     *
     * <p>These are derived from a fixed snapshot of market data and are updated
     * periodically. They give real-feeling context without hitting JSearch on
     * every dashboard load.
     */
    @GetMapping("/dashboard/stats")
    @Operation(summary = "Aggregate job market stats for the dashboard", tags = "dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> data = Map.of(
                "total_jobs_indexed", 12_847,
                "new_today", 143,
                "remote_roles_pct", 38,
                "avg_salary_usd", 148_000,
                "top_roles", List.of(
                        "Frontend Engineer",
                        "Full Stack Developer",
                        "Backend Engineer",
                        "ML Engineer",
                        "DevOps / Platform"),
                "top_locations", List.of(
                        "Remote", "San Francisco", "New York", "Austin", "Seattle"));

        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }
}
