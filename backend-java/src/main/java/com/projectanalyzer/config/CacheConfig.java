package com.projectanalyzer.config;

import java.util.concurrent.TimeUnit;

import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Caffeine;

/**
 * Caffeine-backed TTL cache configuration.
 *
 * <p>Replaces Python's {@code cachetools.TTLCache} wrapped in {@code InMemoryCache}.
 * The cache name {@code "jobs"} is used by {@link com.projectanalyzer.service.JobOrchestratorService}.
 */
@Configuration
public class CacheConfig {

    private final AppProperties appProperties;

    public CacheConfig(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager("jobs");
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(appProperties.getCacheMaxSize())
                .expireAfterWrite(appProperties.getCacheTtlSeconds(), TimeUnit.SECONDS)
                .recordStats());
        return manager;
    }
}
