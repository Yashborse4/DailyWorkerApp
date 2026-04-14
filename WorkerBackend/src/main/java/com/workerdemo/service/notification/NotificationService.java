package com.workerdemo.service.notification;

import com.workerdemo.entity.User;
import com.workerdemo.entity.UserDeviceToken;
import com.workerdemo.repository.UserDeviceTokenRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final UserDeviceTokenRepository tokenRepository;

    public void registerToken(User user, String token, UserDeviceToken.Platform platform) {
        tokenRepository.findByToken(token).ifPresentOrElse(
            t -> {
                t.setUpdatedAt(LocalDateTime.now());
                tokenRepository.save(t);
            },
            () -> {
                UserDeviceToken newToken = UserDeviceToken.builder()
                        .user(user)
                        .token(token)
                        .platform(platform)
                        .build();
                tokenRepository.save(newToken);
            }
        );
    }

    @Async
    @CircuitBreaker(name = "notificationService", fallbackMethod = "fallbackSendPush")
    public void sendPushNotification(Long userId, String title, String body, Map<String, String> data) {
        log.info("Sending push to user {}: {} - {}", userId, title, body);
        // Implementation logic...
    }

    public void fallbackSendPush(Long userId, String title, String body, Map<String, String> data, Throwable t) {
        log.error("Fallback: Could not send push to {}. Error: {}", userId, t.getMessage());
    }

    @Async
    public boolean sendPushImmediately(Long userId, String title, String body, Map<String, String> data) {
        log.debug("Immediate push to {}: {}", userId, title);
        return true; // Mock success
    }
}
