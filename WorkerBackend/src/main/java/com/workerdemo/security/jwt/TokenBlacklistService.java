package com.workerdemo.security.jwt;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Service to manage JWT token revocation using Redis.
 * Revoked tokens are stored with a TTL matching their expiration time.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TokenBlacklistService {

    private final StringRedisTemplate redisTemplate;
    private static final String BLACKLIST_PREFIX = "jwt:blacklist:";

    /**
     * Blacklists a token for a given duration.
     *
     * @param token The JWT token to blacklist
     * @param expirationMs The remaining expiration time in milliseconds
     */
    public void blacklistToken(String token, long expirationMs) {
        if (expirationMs <= 0) {
            log.debug("Token already expired, no need to blacklist.");
            return;
        }

        String key = BLACKLIST_PREFIX + token;
        try {
            redisTemplate.opsForValue().set(key, "revoked", expirationMs, TimeUnit.MILLISECONDS);
            log.info("Token blacklisted successfully for {} ms", expirationMs);
        } catch (Exception e) {
            log.error("Failed to blacklist token in Redis: {}", e.getMessage());
            // Fail-safe: In a production environment, we might want to log this to a persistent DLQ
            // or use a local cache as a secondary fallback.
        }
    }

    /**
     * Checks if a token is present in the blacklist.
     *
     * @param token The token to check
     * @return true if blacklisted, false otherwise
     */
    public boolean isBlacklisted(String token) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + token));
        } catch (Exception e) {
            log.error("Error checking token blacklist in Redis: {}. Failing open.", e.getMessage());
            return false; // Fail open to maintain service availability
        }
    }
}
