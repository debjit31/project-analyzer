package com.projectanalyzer.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * Handles successful OAuth2 login (Google / GitHub).
 *
 * <p>Issues a JWT and redirects the browser back to the frontend with the token
 * in the query string so the React app can store it.
 *
 * <p>Redirect target: {@code http://localhost:5173/auth/callback?token=...}
 */
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final String FRONTEND_CALLBACK = "http://localhost:5173/auth/callback";

    private final AuthService authService;

    public OAuth2AuthenticationSuccessHandler(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        // ── Determine provider ────────────────────────────────────────────────
        String registrationId = resolveRegistrationId(request);
        AuthProvider provider = "github".equalsIgnoreCase(registrationId)
                ? AuthProvider.GITHUB : AuthProvider.GOOGLE;

        // ── Extract attributes (differ between Google and GitHub) ─────────────
        String name = oauthUser.getAttribute("name");
        String email = oauthUser.getAttribute("email");
        String avatarUrl;
        String providerId;

        if (provider == AuthProvider.GITHUB) {
            // GitHub may not expose email if user set it private; fall back to login
            if (email == null) {
                String login = oauthUser.getAttribute("login");
                email = (login != null ? login : "github-user") + "@users.noreply.github.com";
            }
            avatarUrl = oauthUser.getAttribute("avatar_url");
            Object nodeId = oauthUser.getAttribute("node_id");
            providerId = nodeId != null ? nodeId.toString()
                    : String.valueOf(oauthUser.getAttribute("id"));
        } else {
            // Google
            avatarUrl = oauthUser.getAttribute("picture");
            providerId = oauthUser.getAttribute("sub");
        }

        if (name == null) name = email;

        String token = authService.loginOrRegisterOAuth2(name, email, avatarUrl, provider, providerId);

        String redirectUrl = UriComponentsBuilder.fromUriString(FRONTEND_CALLBACK)
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    // ── Private ───────────────────────────────────────────────────────────────

    /**
     * Spring stores the registration ID in the request path
     * {@code /login/oauth2/code/{registrationId}}.
     */
    private String resolveRegistrationId(HttpServletRequest request) {
        String uri = request.getRequestURI();
        if (uri != null && uri.contains("/code/")) {
            return uri.substring(uri.lastIndexOf('/') + 1);
        }
        return "google";
    }
}
