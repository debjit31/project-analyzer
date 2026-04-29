package com.projectanalyzer.auth;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * JPA entity representing an application user.
 *
 * <p>Supports local email/password accounts as well as OAuth2 providers
 * (Google and GitHub). The {@code password} field is {@code null} for
 * OAuth2-only accounts.
 */
@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    /** BCrypt-hashed password; null for OAuth2 accounts. */
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider provider = AuthProvider.LOCAL;

    /** Provider-specific user ID (sub / node_id). */
    private String providerId;

    private String avatarUrl;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public User(String name, String email, String password,
                AuthProvider provider, String providerId, String avatarUrl) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.provider = provider;
        this.providerId = providerId;
        this.avatarUrl = avatarUrl;
    }
}
