package com.workerdemo.security.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenBlacklistServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private TokenBlacklistService tokenBlacklistService;

    @BeforeEach
    void setUp() {
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testBlacklistToken_Success() {
        String token = "sample.jwt.token";
        long durationMs = 60000L;

        tokenBlacklistService.blacklistToken(token, durationMs);

        verify(valueOperations).set("jwt:blacklist:" + token, "revoked", durationMs, TimeUnit.MILLISECONDS);
    }

    @Test
    void testBlacklistToken_ExpiredToken_NotStored() {
        String token = "expired.jwt.token";
        long durationMs = -100L;

        tokenBlacklistService.blacklistToken(token, durationMs);

        verify(valueOperations, never()).set(anyString(), anyString(), anyLong(), any(TimeUnit.class));
    }

    @Test
    void testIsBlacklisted_True() {
        String token = "revoked.jwt.token";
        when(redisTemplate.hasKey("jwt:blacklist:" + token)).thenReturn(true);

        assertTrue(tokenBlacklistService.isBlacklisted(token));
    }

    @Test
    void testIsBlacklisted_False() {
        String token = "valid.jwt.token";
        when(redisTemplate.hasKey("jwt:blacklist:" + token)).thenReturn(false);

        assertFalse(tokenBlacklistService.isBlacklisted(token));
    }

    @Test
    void testIsBlacklisted_RedisException_FailsOpen() {
        String token = "any.jwt.token";
        when(redisTemplate.hasKey(anyString())).thenThrow(new RuntimeException("Redis connection refused"));

        assertFalse(tokenBlacklistService.isBlacklisted(token), "Should fail open and return false on Redis exception");
    }
}
