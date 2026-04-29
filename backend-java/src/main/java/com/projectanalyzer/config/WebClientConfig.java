package com.projectanalyzer.config;

import java.time.Duration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.netty.http.client.HttpClient;

/**
 * WebClient factory — provides a pre-configured reactive HTTP client.
 *
 * <p>Replaces Python's {@code httpx.AsyncClient}. The response and
 * connection timeouts are set from {@link AppProperties#getHttpTimeoutSeconds()}.
 */
@Configuration
public class WebClientConfig {

    private final AppProperties appProperties;

    public WebClientConfig(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @Bean
    public WebClient webClient() {
        Duration timeout = Duration.ofMillis(
                (long) (appProperties.getHttpTimeoutSeconds() * 1000));

        HttpClient httpClient = HttpClient.create()
                .responseTimeout(timeout);

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .codecs(c -> c.defaultCodecs().maxInMemorySize(2 * 1024 * 1024)) // 2 MB
                .build();
    }
}
