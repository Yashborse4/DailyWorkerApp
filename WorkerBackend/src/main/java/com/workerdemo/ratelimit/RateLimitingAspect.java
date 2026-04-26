package com.workerdemo.ratelimit;

import com.workerdemo.exception.TooManyRequestsException;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.lang.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

/**
 * Aspect for rate limiting methods annotated with {@link RateLimit}.
 * Uses Redis-backed Bucket4j for distributed rate limiting, falling back to local memory if needed.
 */
@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class RateLimitingAspect {

    @Nullable
    private final ProxyManager<String> proxyManager;
    private final MeterRegistry meterRegistry;
    private final com.workerdemo.security.BotDetectionService botDetectionService;
    private final Map<String, Bucket> localBuckets = new ConcurrentHashMap<>();

    @Around("@annotation(rateLimit)")
    public Object rateLimit(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String key = resolveKey(request, joinPoint, rateLimit);

        try {
            // Configuration supplier (used for both distributed and local cases)
            Supplier<BucketConfiguration> configurationSupplier = () -> BucketConfiguration.builder()
                    .addLimit(Bandwidth.builder()
                            .capacity(rateLimit.capacity())
                            .refillGreedy(rateLimit.tokensPerPeriod(), Duration.ofSeconds(rateLimit.periodInSeconds()))
                            .build())
                    .build();

            Bucket bucket;
            if (proxyManager != null) {
                // Attempt to get the bucket from the distributed ProxyManager
                bucket = proxyManager.builder().build(key, configurationSupplier);
            } else {
                // Fallback: Use local in-memory bucket
                bucket = localBuckets.computeIfAbsent(key, k -> Bucket.builder()
                        .addLimit(Bandwidth.builder()
                                .capacity(rateLimit.capacity())
                                .refillGreedy(rateLimit.tokensPerPeriod(), Duration.ofSeconds(rateLimit.periodInSeconds()))
                                .build())
                        .build());
            }

            if (bucket.tryConsume(1)) {
                meterRegistry.counter("ratelimit.success", "key", key).increment();
                return joinPoint.proceed();
            } else {
                log.warn("Rate limit exceeded for key: {}", key);
                meterRegistry.counter("ratelimit.exceeded", "key", key).increment();
                
                // Track violation for bot detection
                String identifier = resolveIdentifier(request);
                botDetectionService.recordViolation(identifier);
                
                throw new TooManyRequestsException("Too many requests. Please try again later.");
            }
        } catch (TooManyRequestsException e) {
            throw e; // Rethrow expected rate limit exceptions
        } catch (Exception e) {
            log.error("Redis/Distributed Rate Limiting failed: {}. FAILING OPEN to maintain service availability.", e.getMessage());
            // Global Fail-Open: Proceed with the request instead of breaking the entire service
            return joinPoint.proceed();
        }
    }

    private String resolveKey(HttpServletRequest request, ProceedingJoinPoint joinPoint, RateLimit rateLimit) {
        String identifier = resolveIdentifier(request);
        String methodName = joinPoint.getSignature().toShortString();
        String prefix = rateLimit.key().isEmpty() ? methodName : rateLimit.key();
        return prefix + "_" + identifier;
    }

    private String resolveIdentifier(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            return authentication.getName();
        }
        
        // Handle X-Forwarded-For for proxy/load balancer environments
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isEmpty()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
