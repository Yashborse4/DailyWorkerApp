package com.workerdemo.ratelimit;

import lombok.extern.slf4j.Slf4j;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Implementation of an adaptive concurrency Limiter based on the Gradient algorithm.
 * It adjusts the concurrency limit based on the ratio between minimum observed RTT
 * and current average RTT.
 */
@Slf4j
public class GradientLimiter implements Limiter {

    private double limit;
    private long rttMin = Long.MAX_VALUE;
    private double rttActual = 0;
    
    private final int minLimit;
    private final int maxLimit;
    private final double smoothing;
    private final int queueSize;
    
    private final AtomicInteger inflight = new AtomicInteger(0);

    public GradientLimiter(int initialLimit, int minLimit, int maxLimit, double smoothing, int queueSize) {
        this.limit = initialLimit;
        this.minLimit = minLimit;
        this.maxLimit = maxLimit;
        this.smoothing = smoothing;
        this.queueSize = queueSize;
    }

    @Override
    public Optional<Listener> acquire() {
        int currentInflight = inflight.get();
        if (currentInflight >= (int) limit) {
            log.warn("Concurrency limit reached: inflight={}, limit={}", currentInflight, (int) limit);
            return Optional.empty();
        }

        inflight.incrementAndGet();
        long startTime = System.nanoTime();

        return Optional.of(new Listener() {
            @Override
            public void onSuccess() {
                inflight.decrementAndGet();
                updateLimit(System.nanoTime() - startTime);
            }

            @Override
            public void onDropped() {
                inflight.decrementAndGet();
            }

            @Override
            public void onIgnore() {
                inflight.decrementAndGet();
            }
        });
    }

    private synchronized void updateLimit(long rtt) {
        if (rttMin == Long.MAX_VALUE || rtt < rttMin) {
            rttMin = rtt;
        }

        if (rttActual == 0) {
            rttActual = rtt;
        } else {
            rttActual = rttActual * (1 - smoothing) + rtt * smoothing;
        }

        double gradient = (double) rttMin / rttActual;
        gradient = Math.max(0.5, Math.min(1.0, gradient));

        double newLimit = limit * gradient + queueSize;
        limit = Math.max(minLimit, Math.min(maxLimit, newLimit));

        if (log.isDebugEnabled()) {
            log.debug("RTT: {}ms, RTT_min: {}ms, Gradient: {}, New Limit: {}", 
                rtt / 1_000_000.0, rttMin / 1_000_000.0, String.format("%.2f", gradient), (int) limit);
        }
    }
}
