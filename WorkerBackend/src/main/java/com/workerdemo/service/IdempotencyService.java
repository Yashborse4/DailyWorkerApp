package com.workerdemo.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class IdempotencyService {
    private final ConcurrentHashMap<String, Object> storage = new ConcurrentHashMap<>();

    public boolean isDuplicate(String key) {
        return storage.putIfAbsent(key, new Object()) != null;
    }
}
