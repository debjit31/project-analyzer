package com.projectanalyzer.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Handles JWT generation, validation and claims extraction.
 *
 * <p>Tokens are signed with HMAC-SHA256 using the secret configured in
 * {@code application.properties} (key: {@code app.jwt-secret}).
 * Expiry defaults to 7 days.
 */
@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    /** 7 days in milliseconds. */
    private static final long EXPIRY_MS = 7L * 24 * 60 * 60 * 1000;

    private final SecretKey signingKey;

    public JwtService(@Value("${app.jwt-secret}") String secret) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // ── Generate ──────────────────────────────────────────────────────────────

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());
        claims.put("email", user.getEmail());
        claims.put("avatarUrl", user.getAvatarUrl());
        claims.put("provider", user.getProvider().name());

        return Jwts.builder()
                .claims(claims)
                .subject(String.valueOf(user.getId()))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRY_MS))
                .signWith(signingKey)
                .compact();
    }

    // ── Validate ──────────────────────────────────────────────────────────────

    public boolean isValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("JWT validation failed: {}", ex.getMessage());
            return false;
        }
    }

    // ── Extract ───────────────────────────────────────────────────────────────

    public String extractSubject(String token) {
        return parseClaims(token).getSubject();
    }

    public Claims extractAllClaims(String token) {
        return parseClaims(token);
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
