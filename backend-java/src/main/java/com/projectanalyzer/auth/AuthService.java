package com.projectanalyzer.auth;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Business logic for local email/password registration and login.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /**
     * Register a new local user and return a JWT.
     *
     * @throws IllegalArgumentException if email is already taken
     */
    public String register(String name, String email, String rawPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User(
                name, email,
                passwordEncoder.encode(rawPassword),
                AuthProvider.LOCAL, null, null);
        userRepository.save(user);
        return jwtService.generateToken(user);
    }

    /**
     * Authenticate an existing local user and return a JWT.
     *
     * @throws BadCredentialsException if email or password is invalid
     */
    public String login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (user.getProvider() != AuthProvider.LOCAL || user.getPassword() == null) {
            throw new BadCredentialsException(
                    "Account uses " + user.getProvider() + " login. Please sign in with that provider.");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return jwtService.generateToken(user);
    }

    /** Find or create a user from OAuth2 data, and return a JWT. */
    public String loginOrRegisterOAuth2(String name, String email, String avatarUrl,
                                        AuthProvider provider, String providerId) {
        User user = userRepository.findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> userRepository.findByEmail(email)
                        .orElse(null));

        if (user == null) {
            user = new User(name, email, null, provider, providerId, avatarUrl);
            userRepository.save(user);
        } else {
            // Update profile fields that may have changed
            user.setName(name);
            user.setAvatarUrl(avatarUrl);
            if (user.getProviderId() == null) {
                user.setProviderId(providerId);
                user.setProvider(provider);
            }
            userRepository.save(user);
        }

        return jwtService.generateToken(user);
    }
}
