package com.workerdemo.ratelimit;

import java.util.Optional;

/**
 * Interface for a concurrency Limiter.
 * This is the core component that manages request throughput.
 */
public interface Limiter {

    /**
     * Try to acquire a permit to execute a request.
     * 
     * @return An Optional containing a Listener if the permit was acquired, or empty otherwise.
     */
    Optional<Listener> acquire();

    /**
     * Listener used to notify the Limiter of the outcome of a request.
     */
    interface Listener {
        /**
         * Notify the Limiter that the request was successful.
         */
        void onSuccess();

        /**
         * Notify the Limiter that the request failed.
         */
        void onDropped();

        /**
         * Notify the Limiter that the request should be ignored (e.g. 404).
         */
        void onIgnore();
    }
}
