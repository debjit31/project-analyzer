package com.projectanalyzer.service.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectanalyzer.model.JobAnalysis;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Shared JSON parser for LLM responses.
 *
 * <p>Handles edge-cases such as markdown code fences and minor formatting
 * issues. Mirrors the Python {@code _parse_analysis} function.
 */
public final class AIResponseParser {

    private static final Logger log = LoggerFactory.getLogger(AIResponseParser.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final Pattern JSON_BLOCK = Pattern.compile("\\{.*}", Pattern.DOTALL);
    private static final Pattern CODE_FENCE = Pattern.compile("```(?:json)?|```");

    private AIResponseParser() {}

    /**
     * Parse a raw LLM text response into a {@link JobAnalysis}.
     *
     * <p>Strategy:
     * <ol>
     *   <li>Strip markdown code fences.</li>
     *   <li>Try direct JSON parse.</li>
     *   <li>Fallback: regex-extract first {@code {...}} block and parse that.</li>
     *   <li>On total failure: return a gracefully degraded analysis.</li>
     * </ol>
     */
    public static JobAnalysis parse(String raw) {
        if (raw == null || raw.isBlank()) {
            return JobAnalysis.degraded();
        }

        // Strip markdown fences
        String text = CODE_FENCE.matcher(raw).replaceAll("").strip();

        // First attempt: direct parse
        try {
            return toJobAnalysis(MAPPER.readValue(text, new TypeReference<Map<String, Object>>() {}));
        } catch (Exception ignored) {
            // fall through
        }

        // Second attempt: extract first JSON object from text
        Matcher m = JSON_BLOCK.matcher(text);
        if (m.find()) {
            try {
                return toJobAnalysis(
                        MAPPER.readValue(m.group(), new TypeReference<Map<String, Object>>() {}));
            } catch (Exception ignored) {
                // fall through
            }
        }

        log.warn("ai.parse_failed raw={}", raw.substring(0, Math.min(500, raw.length())));
        return JobAnalysis.degraded();
    }

    @SuppressWarnings("unchecked")
    private static JobAnalysis toJobAnalysis(Map<String, Object> data) {
        Object techStackRaw = data.get("tech_stack");
        List<String> techStack = (techStackRaw instanceof List<?> list)
                ? list.stream().map(Object::toString).toList()
                : List.of();

        String coreProblem = data.getOrDefault("core_problem", "").toString();
        String projectIdea = data.getOrDefault("project_idea", "").toString();

        return new JobAnalysis(techStack, coreProblem, projectIdea);
    }
}
