package com.workerdemo.security;

import com.workerdemo.ratelimit.ConcurrencyLimitFilter;
import com.workerdemo.security.jwt.JwtAuthenticationEntryPoint;
import com.workerdemo.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ConcurrencyLimitFilter concurrencyLimitFilter;
    private final com.workerdemo.security.jwt.CustomLogoutHandler logoutHandler;
    private final IpBlacklistFilter ipBlacklistFilter;

    @org.springframework.beans.factory.annotation.Value("${application.cors.allowed-origins}")
    private java.util.List<String> allowedOrigins;

    @org.springframework.beans.factory.annotation.Value("${application.cors.allowed-methods}")
    private java.util.List<String> allowedMethods;

    @org.springframework.beans.factory.annotation.Value("${application.cors.allowed-headers}")
    private java.util.List<String> allowedHeaders;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName("_csrf");

        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .csrfTokenRequestHandler(requestHandler)
                .ignoringRequestMatchers("/api/v1/auth/**") // Disable CSRF for auth endpoints if needed
            )
            .cors(cors -> cors.configurationSource(request -> {
                var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                corsConfiguration.setAllowedOriginPatterns(allowedOrigins);
                corsConfiguration.setAllowedMethods(allowedMethods);
                corsConfiguration.setAllowedHeaders(allowedHeaders);
                corsConfiguration.setAllowCredentials(true);
                return corsConfiguration;
            }))
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // TODO: [Production-Readiness] Secure /actuator/** endpoints (e.g., restrict to ADMIN or internal IP)
                .requestMatchers("/api/v1/auth/**", "/actuator/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/ws/**").authenticated()
                .anyRequest().authenticated()
            )
            .logout(logout -> logout
                .logoutUrl("/api/v1/auth/logout")
                .addLogoutHandler(logoutHandler)
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_OK);
                    response.getWriter().write("Logged out successfully");
                })
            );

        http.addFilterBefore(ipBlacklistFilter, JwtAuthenticationFilter.class);
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterAfter(concurrencyLimitFilter, JwtAuthenticationFilter.class);

        return http.build();
    }
}
