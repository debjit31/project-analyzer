package com.projectanalyzer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectanalyzer.model.JobAnalysis;
import com.projectanalyzer.model.JobListing;
import com.projectanalyzer.model.SearchRequest;
import com.projectanalyzer.service.JobOrchestratorService;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Slice tests for {@link JobsController}.
 *
 * <p>Uses {@code @WebMvcTest} to test only the web layer;
 * the orchestrator is mocked.
 */
@WebMvcTest(JobsController.class)
class JobsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JobOrchestratorService orchestrator;

    // ── Health ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/v1/health → 200 {status: ok}")
    void healthCheck() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));
    }

    // ── Generate Projects ──────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/v1/generate-projects → 200 with enriched listings")
    void generateProjects_returnsListings() throws Exception {
        JobAnalysis analysis = new JobAnalysis(
                List.of("React", "TypeScript"),
                "Build a real-time dashboard",
                "Create a live data viz tool with React and TypeScript"
        );
        JobListing listing = JobListing.of(
                "abc123", "Senior React Developer", "Acme Corp",
                "https://example.com", "San Francisco, CA",
                "2026-04-24", "...description...", analysis);

        when(orchestrator.generateProjects(any(SearchRequest.class)))
                .thenReturn(List.of(listing));

        SearchRequest request = new SearchRequest("Senior React Developer", "San Francisco", "7d");

        mockMvc.perform(post("/api/v1/generate-projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.data[0].id").value("abc123"))
                .andExpect(jsonPath("$.data[0].job_title").value("Senior React Developer"))
                .andExpect(jsonPath("$.data[0].analysis.tech_stack[0]").value("React"));
    }

    @Test
    @DisplayName("POST /api/v1/generate-projects → 400 when job_title is blank")
    void generateProjects_blankTitle_returns400() throws Exception {
        String badRequest = "{\"job_title\":\"\",\"location\":\"\",\"date_posted\":\"anytime\"}";

        mockMvc.perform(post("/api/v1/generate-projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(badRequest))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /api/v1/generate-projects → 200 with empty list when no jobs found")
    void generateProjects_noJobs_returnsEmpty() throws Exception {
        when(orchestrator.generateProjects(any(SearchRequest.class)))
                .thenReturn(List.of());

        SearchRequest request = new SearchRequest("Unicorn Developer", "", "anytime");

        mockMvc.perform(post("/api/v1/generate-projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.total").value(0))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    // ── Jobs Search (alias) ────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/v1/jobs/search → 200 (alias for generate-projects)")
    void searchJobs_aliasWorks() throws Exception {
        when(orchestrator.generateProjects(any(SearchRequest.class)))
                .thenReturn(List.of());

        SearchRequest request = new SearchRequest("Backend Engineer", "Remote", "7d");

        mockMvc.perform(post("/api/v1/jobs/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    // ── Job Feed ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/v1/jobs/feed → 200 with default params")
    void getJobFeed_defaultParams() throws Exception {
        when(orchestrator.generateProjects(any(SearchRequest.class)))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/v1/jobs/feed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("GET /api/v1/jobs/feed → 200 with custom q and location")
    void getJobFeed_withParams() throws Exception {
        when(orchestrator.generateProjects(any(SearchRequest.class)))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/v1/jobs/feed")
                        .param("q", "Data Engineer")
                        .param("location", "New York")
                        .param("date_posted", "7d"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    // ── Dashboard Stats ───────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/v1/dashboard/stats → 200 with expected fields")
    void getDashboardStats() throws Exception {
        mockMvc.perform(get("/api/v1/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.total_jobs_indexed").value(12847))
                .andExpect(jsonPath("$.data.top_roles").isArray());
    }
}
