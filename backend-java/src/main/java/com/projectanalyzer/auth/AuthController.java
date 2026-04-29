package com.projectanalyzer.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Authentication endpoints.
 *
 * <ul>
 *   <li>{@code POST /api/v1/auth/register} — email + password sign-up</li>
 *   <li>{@code POST /api/v1/auth/login}    — email + password sign-in</li>
 *   <li>{@code GET  /api/v1/auth/me}       — return current user from JWT</li>
 *   <li>{@code POST /api/v1/auth/logout}   — no-op (token cleared client-side)</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "auth", description = "Authentication endpoints")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ── DTOs ──────────────────────────────────────────────────────────────────

    public record RegisterRequest(
            @NotBlank String name,
            @Email @NotBlank String email,
            @Size(min = 8) @NotBlank String password) {}

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password) {}

    // ── Endpoints ─────────────────────────────────────────────────────────────

    @PostMapping("/register")
    @Operation(summary = "Register a new user with email and password")
    public ResponseEntity<Map<String, Object>> register(
            @Valid @RequestBody RegisterRequest req) {
        try {
            String token = authService.register(req.name(), req.email(), req.password());
            log.info("auth.register email={}", req.email());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("token", token, "message", "Registration successful"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<Map<String, Object>> login(
            @Valid @RequestBody LoginRequest req) {
        try {
            String token = authService.login(req.email(), req.password());
            log.info("auth.login email={}", req.email());
            return ResponseEntity.ok(Map.of("token", token, "message", "Login successful"));
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Return current user info from JWT")
    public ResponseEntity<Map<String, Object>> me(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "",
                "provider", user.getProvider().name(),
                "createdAt", user.getCreatedAt().toString()));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout — client should discard the JWT")
    public ResponseEntity<Map<String, String>> logout() {
        // JWT is stateless; actual logout happens client-side by deleting the token.
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
