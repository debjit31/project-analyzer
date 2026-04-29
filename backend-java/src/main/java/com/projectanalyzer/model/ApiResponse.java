package com.projectanalyzer.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Standard JSON envelope returned by every endpoint.
 *
 * <p>Mirrors the Python generic {@code ApiResponse[DataT]}.
 *
 * @param <T> the type of the {@code data} field
 */
public record ApiResponse<T>(
        boolean success,
        T data,
        int total,
        String message
) {

    /** Convenience factory for a successful list response. */
    public static <T> ApiResponse<List<T>> ok(List<T> data, String message) {
        return new ApiResponse<>(true, data, data.size(), message);
    }

    /** Convenience factory for a successful single-object response. */
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, 1, "OK");
    }
}
