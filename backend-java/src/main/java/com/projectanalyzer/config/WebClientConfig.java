package com.projectanalyzer.config;

import java.time.Duration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * WebClient factory — provides a pre-configured reactive HTTP client.
 *
 * <p>Replaces Python's {@code httpx.AsyncClient}.
 */
@Configuration
public class WebClientConfig {

    private final AppProperties appProperties;

    public WebClientConfig(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Bean
    public WebClient webClient() {
        long timeoutMillis = (long) (appProperties.getHttpTimeoutSeconds() * 1000);
        return WebClient.builder()
                .codecs(c -> c.defaultCodecs().maxInMemorySize(2 * 1024 * 1024)) // 2 MB
                .build();
    }
}
