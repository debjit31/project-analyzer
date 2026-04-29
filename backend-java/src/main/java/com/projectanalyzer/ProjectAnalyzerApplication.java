package com.projectanalyzer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;

import com.projectanalyzer.config.AppProperties;

/**
 * Project Analyzer — Spring Boot entry point.
 *
 * <p>The application is a strategic career advisor API that:
 * <ol>
 *   <li>Fetches real job listings from the JSearch (RapidAPI) service.</li>
 *   <li>Runs each job description through an LLM concurrently (Gemini or OpenAI).</li>
 *   <li>Returns enriched results with tech_stack, core_problem, and project_idea.</li>
 *   <li>Caches results (TTL-based) so repeat searches are instant.</li>
 * </ol>
 */
@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
@EnableCaching
@EnableAsync
public class ProjectAnalyzerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectAnalyzerApplication.class, args);
    }
}
