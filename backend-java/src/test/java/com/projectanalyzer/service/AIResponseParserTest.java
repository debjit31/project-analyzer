package com.projectanalyzer.service;

import com.projectanalyzer.model.JobAnalysis;
import com.projectanalyzer.service.ai.AIResponseParser;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link AIResponseParser}.
 */
class AIResponseParserTest {

    @Test
    @DisplayName("Parses clean JSON response correctly")
    void parsesCleanJson() {
        String raw = """
                {
                  "tech_stack": ["React", "TypeScript", "GraphQL"],
                  "core_problem": "Build a real-time dashboard.",
                  "project_idea": "Create a live data viz tool with React and GraphQL."
                }
                """;

        JobAnalysis result = AIResponseParser.parse(raw);

        assertThat(result.techStack()).containsExactly("React", "TypeScript", "GraphQL");
        assertThat(result.coreProblem()).isEqualTo("Build a real-time dashboard.");
        assertThat(result.projectIdea()).contains("React");
    }

    @Test
    @DisplayName("Strips markdown code fences before parsing")
    void stripsMarkdownCodeFences() {
        String raw = """
                ```json
                {
                  "tech_stack": ["Java", "Spring Boot"],
                  "core_problem": "Migrate microservices.",
                  "project_idea": "Build a Spring Boot REST API."
                }
                ```
                """;

        JobAnalysis result = AIResponseParser.parse(raw);

        assertThat(result.techStack()).containsExactly("Java", "Spring Boot");
    }

    @Test
    @DisplayName("Falls back to regex extraction when JSON is embedded in prose")
    void extractsEmbeddedJson() {
        String raw = """
                Here is the analysis:
                {
                  "tech_stack": ["Kubernetes"],
                  "core_problem": "Manage container orchestration.",
                  "project_idea": "Deploy a Kubernetes cluster."
                }
                Some trailing text.
                """;

        JobAnalysis result = AIResponseParser.parse(raw);

        assertThat(result.techStack()).containsExactly("Kubernetes");
    }

    @Test
    @DisplayName("Returns degraded analysis for completely unparseable input")
    void returnsDegradedOnFailure() {
        String raw = "This is not JSON at all!";

        JobAnalysis result = AIResponseParser.parse(raw);

        assertThat(result.techStack()).isEmpty();
        assertThat(result.coreProblem()).isEqualTo("Analysis unavailable.");
        assertThat(result.projectIdea()).contains("Could not generate");
    }

    @Test
    @DisplayName("Returns degraded analysis for null input")
    void returnsDegradedForNull() {
        JobAnalysis result = AIResponseParser.parse(null);

        assertThat(result.techStack()).isEmpty();
        assertThat(result.coreProblem()).isEqualTo("Analysis unavailable.");
    }

    @Test
    @DisplayName("Returns degraded analysis for blank input")
    void returnsDegradedForBlank() {
        JobAnalysis result = AIResponseParser.parse("   ");

        assertThat(result.techStack()).isEmpty();
    }

    @Test
    @DisplayName("Handles missing fields gracefully (empty defaults)")
    void handlesMissingFields() {
        String raw = """
                {
                  "tech_stack": ["Python"]
                }
                """;

        JobAnalysis result = AIResponseParser.parse(raw);

        assertThat(result.techStack()).containsExactly("Python");
        assertThat(result.coreProblem()).isEmpty();
        assertThat(result.projectIdea()).isEmpty();
    }
}
