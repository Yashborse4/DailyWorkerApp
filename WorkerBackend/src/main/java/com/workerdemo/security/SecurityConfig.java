package com.workerdemo.security;

import com.workerdemo.ratelimit.ConcurrencyLimitFilter;
import com.workerdemo.security.jwt.JwtAuthenticationEntryPoint;
import com.workerdemo.security.jwt.JwtAuthenticationFilter;
import com.workerdemo.security.IpBlacklistFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                corsConfiguration.setAllowedOriginPatterns(allowedOrigins);
                corsConfiguration.setAllowedMethods(allowedMethods);
                corsConfiguration.setAllowedHeaders(allowedHeaders);
                corsConfiguration.setExposedHeaders(java.util.List.of("Authorization", "Retry-After"));
                corsConfiguration.setAllowCredentials(true);
                return corsConfiguration;
            }))
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                .requestMatchers("/api/v1/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
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
