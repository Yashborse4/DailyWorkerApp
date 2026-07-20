package com.workerdemo.security.jwt;

import com.workerdemo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * Custom logout handler to blacklist JWT Access & Refresh tokens in Redis upon logout,
 * and wipe the active refresh token from the database.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CustomLogoutHandler implements LogoutHandler {

    private final TokenBlacklistService blacklistService;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String jwt = getJwtFromRequest(request);
        String refreshToken = request.getHeader("X-Refresh-Token");
        if (!StringUtils.hasText(refreshToken)) {
            refreshToken = request.getParameter("refreshToken");
        }

        if (StringUtils.hasText(jwt)) {
            try {
                if (tokenProvider.validateAccessToken(jwt)) {
                    long remainingExpiration = tokenProvider.getRemainingExpiration(jwt);
                    blacklistService.blacklistToken(jwt, remainingExpiration);
                    log.info("Access token successfully blacklisted during logout.");

                    Long userId = tokenProvider.getUserIdFromToken(jwt);
                    if (userId != null) {
                        userRepository.findById(userId).ifPresent(user -> {
                            user.setRefreshToken(null);
                            userRepository.save(user);
                            log.info("User refresh token revoked in database for user ID {}", userId);
                        });
                    }
                }
            } catch (Exception e) {
                log.error("Error during access token blacklisting on logout: {}", e.getMessage());
            }
        }

        if (StringUtils.hasText(refreshToken)) {
            try {
                if (tokenProvider.validateRefreshToken(refreshToken)) {
                    long remainingExpiration = tokenProvider.getRemainingExpiration(refreshToken);
                    blacklistService.blacklistToken(refreshToken, remainingExpiration);
                    log.info("Refresh token successfully blacklisted during logout.");
                }
            } catch (Exception e) {
                log.error("Error during refresh token blacklisting on logout: {}", e.getMessage());
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
