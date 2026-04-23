package com.workerdemo.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Service to detect bot-like behavior by tracking rate limit violations.
 * If a client exceeds the violation threshold, their IP/identifier is blacklisted.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BotDetectionService {

    private final StringRedisTemplate redisTemplate;

    private static final String VIOLATION_PREFIX = "bot:violations:";
    private static final String IP_BLACKLIST_PREFIX = "bot:blacklist:";
    
    // Configuration constants (could be externalized)
    private static final int VIOLATION_THRESHOLD = 5;
    private static final long VIOLATION_WINDOW_MINUTES = 5;
    private static final long BAN_DURATION_HOURS = 1;

    /**
     * Records a rate limit violation and blacklists the client if the threshold is reached.
     *
     * @param identifier The client identifier (IP or username)
     */
    public void recordViolation(String identifier) {
        String violationKey = VIOLATION_PREFIX + identifier;
        
        try {
            Long violations = redisTemplate.opsForValue().increment(violationKey);
            
            if (violations != null && violations == 1) {
                redisTemplate.expire(violationKey, VIOLATION_WINDOW_MINUTES, TimeUnit.MINUTES);
            }

            log.debug("Violation recorded for {}. Total violations in window: {}", identifier, violations);

            if (violations != null && violations >= VIOLATION_THRESHOLD) {
                banClient(identifier);
            }
        } catch (Exception e) {
            log.error("Failed to record violation in Redis: {}", e.getMessage());
        }
    }

    /**
     * Checks if a client is blacklisted.
     *
     * @param identifier The client identifier
     * @return true if blacklisted, false otherwise
     */
    public boolean isBlacklisted(String identifier) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(IP_BLACKLIST_PREFIX + identifier));
        } catch (Exception e) {
            log.error("Error checking IP blacklist in Redis: {}. Failing open.", e.getMessage());
            return false;
        }
    }

    private void banClient(String identifier) {
        String blacklistKey = IP_BLACKLIST_PREFIX + identifier;
        try {
            redisTemplate.opsForValue().set(blacklistKey, "banned", BAN_DURATION_HOURS, TimeUnit.HOURS);
            log.warn("CLIENT BANNED: {} has been blacklisted for {} hour(s) due to excessive violations", 
                    identifier, BAN_DURATION_HOURS);
            
            // Clean up violations after banning
            redisTemplate.delete(VIOLATION_PREFIX + identifier);
        } catch (Exception e) {
            log.error("Failed to ban client in Redis: {}", e.getMessage());
        }
    }
}
