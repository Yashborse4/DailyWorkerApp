package com.workerdemo;

import io.github.bucket4j.Bandwidth;
import java.time.Duration;

public class TestBucket4j {
    public static void main(String[] args) {
        Bandwidth limit = Bandwidth.builder()
            .capacity(10)
            .refillGreedy(10, Duration.ofMinutes(1))
            .build();
        System.out.println("Success!");
    }
}
