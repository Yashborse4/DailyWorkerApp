package com.workerdemo.ratelimit;

import io.github.bucket4j.distributed.ExpirationAfterWriteStrategy;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.Bucket4jLettuce;
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.codec.ByteArrayCodec;
import io.lettuce.core.codec.RedisCodec;
import io.lettuce.core.codec.StringCodec;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

import java.time.Duration;

@Configuration
@Slf4j
public class RateLimitConfiguration {

    @Bean
    public Limiter concurrencyLimiter() {
        // initialLimit=20, minLimit=10, maxLimit=200, smoothing=0.2, rttTolerance=4
        return new GradientLimiter(10, 200, 200, 0.2, 4);
    }

    @Bean
    public ConcurrencyLimitFilter concurrencyLimitFilter(Limiter limiter) {
        return new ConcurrencyLimitFilter(limiter);
    }

    @Bean
    public ProxyManager<String> proxyManager(RedisConnectionFactory redisConnectionFactory) {
        if (redisConnectionFactory instanceof LettuceConnectionFactory lettuceFactory) {
            try {
                // Safely extract RedisClient from LettuceConnectionFactory
                RedisClient redisClient = (RedisClient) lettuceFactory.getNativeClient();
                if (redisClient == null) {
                    throw new IllegalStateException("Lettuce native client is null");
                }

                StatefulRedisConnection<String, byte[]> connection = redisClient.connect(RedisCodec.of(StringCodec.UTF8, ByteArrayCodec.INSTANCE));
                
                log.info("Initialized Distributed Redis Rate Limiting (Lettuce)");
                return Bucket4jLettuce.casBasedBuilder(connection)
                        .expirationAfterWrite(ExpirationAfterWriteStrategy.basedOnTimeForRefillingBucketUpToMax(Duration.ofMinutes(1)))
                        .build();
            } catch (Exception e) {
                log.error("Failed to connect to Redis for Rate Limiting: {}. Falling back to Local Fail-Open mode.", e.getMessage());
                return null; // Return null so the Aspect handles local fallback
            }
        }
        log.warn("Non-Lettuce connection factory detected. Rate limiting will operate in Local Fail-Open mode.");
        return null;
    }
}
