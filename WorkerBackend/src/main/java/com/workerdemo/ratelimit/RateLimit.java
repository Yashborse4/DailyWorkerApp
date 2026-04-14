package com.workerdemo.ratelimit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to mark methods for rate limiting.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {
    /**
     * The number of tokens the bucket can hold.
     */
    long capacity() default 10;

    /**
     * How many tokens are refilled periodically.
     */
    long tokensPerPeriod() default 10;

    /**
     * The period length in seconds for refilling tokens.
     */
    long periodInSeconds() default 60;

    /**
     * Key prefix for the rate limit. 
     * If empty, the method signature will be used as a base.
     */
    String key() default "";
}
