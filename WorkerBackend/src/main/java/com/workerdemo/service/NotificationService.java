package com.workerdemo.service;

import com.workerdemo.entity.NotificationQueue;
import com.workerdemo.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationQueue> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            n.setUpdatedAt(LocalDateTime.now());
            notificationRepository.save(n);
        });
    }

    public void createNotification(Long userId, String title, String body) {
        NotificationQueue notification = NotificationQueue.builder()
                .userId(userId)
                .title(title)
                .body(body)
                .status(NotificationQueue.NotificationStatus.SENT)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }
}
