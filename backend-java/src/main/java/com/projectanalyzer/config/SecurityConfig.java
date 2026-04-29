package com.projectanalyzer.config;

import com.projectanalyzer.auth.JwtAuthenticationFilter;
import com.projectanalyzer.auth.OAuth2AuthenticationSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security configuration.
 *
 * <ul>
 *   <li>Stateless JWT-based session management</li>
 *   <li>Auth endpoints and OAuth2 are publicly accessible</li>
 *   <li>All other {@code /api/**} endpoints require a valid JWT</li>
 *   <li>Google and GitHub OAuth2 login configured</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF not needed for a stateless JWT API
            .csrf(AbstractHttpConfigurer::disable)

            // Session management — stateless; Spring Security must not create sessions
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // CORS is handled by the existing CorsFilter bean
            .cors(cors -> {})

            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Auth endpoints and OAuth2 flow are public
                .requestMatchers(
                    "/api/v1/auth/**",
                    "/login/oauth2/**",
                    "/oauth2/**",
                    // Keep these public for backwards compatibility / health checks
                    "/api/v1/health",
                    "/actuator/**",
                    "/api-docs/**",
                    "/docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()
                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            // OAuth2 login
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler)
            )

            // Plug in the JWT filter before the username/password filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
