package com.projectanalyzer.service.ai;

import com.projectanalyzer.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Factory that instantiates the correct {@link AIProvider} based on
 * the {@code app.ai-provider} configuration value.
 *
 * <p>Falls back to {@link NoOpAIProvider} when the selected provider's
 * API key is not configured. Mirrors Python {@code create_ai_provider()}.
 */
@Component
public class AIProviderFactory {

    private static final Logger log = LoggerFactory.getLogger(AIProviderFactory.class);

    private final AppProperties appProperties;
    private final WebClient webClient;

    public AIProviderFactory(AppProperties appProperties, WebClient webClient) {
        this.appProperties = appProperties;
        this.webClient = webClient;
    }

    /**
     * Build and return the configured {@link AIProvider}.
     *
     * <p>Called once during application startup to obtain the singleton
     * provider that is injected into {@link com.projectanalyzer.service.JobOrchestratorService}.
     */
    public AIProvider create() {
        String provider = appProperties.getAiProvider().toLowerCase();
        log.info("ai.provider provider={}", provider);

        if ("openai".equals(provider)) {
            if (appProperties.getOpenaiApiKey() == null || appProperties.getOpenaiApiKey().isBlank()) {
                log.warn("ai.provider.no_key provider=openai fallback=noop");
                return new NoOpAIProvider();
            }
            return new OpenAIProvider(webClient, appProperties);
        }

        // Default: Gemini
        if (appProperties.getGeminiApiKey() == null || appProperties.getGeminiApiKey().isBlank()) {
            log.warn("ai.provider.no_key provider=gemini fallback=noop");
            return new NoOpAIProvider();
        }
        return new GeminiAIProvider(webClient, appProperties);
    }
}
