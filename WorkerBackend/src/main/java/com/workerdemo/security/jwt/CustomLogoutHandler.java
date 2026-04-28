package com.workerdemo.security.jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Custom logout handler to blacklist the JWT token in Redis upon logout.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CustomLogoutHandler implements LogoutHandler {

    private final TokenBlacklistService blacklistService;
    private final JwtTokenProvider tokenProvider;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String jwt = getJwtFromRequest(request);

        if (StringUtils.hasText(jwt)) {
            try {
                if (tokenProvider.validateAccessToken(jwt)) {
                    long remainingExpiration = tokenProvider.getRemainingExpiration(jwt);
                    blacklistService.blacklistToken(jwt, remainingExpiration);
                    log.info("Token successfully blacklisted during logout.");
                }
            } catch (Exception e) {
                log.error("Error during token blacklisting on logout: {}", e.getMessage());
            }
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
