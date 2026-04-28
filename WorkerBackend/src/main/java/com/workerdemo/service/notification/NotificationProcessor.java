package com.workerdemo.service.notification;

import com.workerdemo.entity.NotificationQueue;
import com.workerdemo.repository.NotificationQueueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationProcessor {

    private final NotificationQueueRepository queueRepository;
    private final NotificationService notificationService;
    private final AtomicBoolean isProcessing = new AtomicBoolean(false);

    @Value("${app.notification.batch-size:50}")
    private int batchSize;

    @Scheduled(fixedDelay = 60000) // Increased frequency to 1 minute
    @Transactional
    protected void processQueue() {
        if (!isProcessing.compareAndSet(false, true)) return;
        try {
            List<NotificationQueue> pending = queueRepository.findPendingNotifications(
                NotificationQueue.NotificationStatus.PENDING, LocalDateTime.now(), PageRequest.of(0, batchSize));
            
            if (pending.isEmpty()) return;

            log.info("Processing {} pending notifications", pending.size());
            pending.forEach(this::handleNotificationInstance);
            queueRepository.saveAll(pending); // Batch save at the end
        } catch (Exception e) {
            log.error("Queue processing failed", e);
        } finally {
            isProcessing.set(false);
        }
    }

    private void handleNotificationInstance(NotificationQueue n) {
        try {
            boolean success = notificationService.sendPushImmediately(n.getUserId(), n.getTitle(), n.getBody(), null);
            n.setStatus(success ? NotificationQueue.NotificationStatus.SENT : NotificationQueue.NotificationStatus.FAILED);
            n.setUpdatedAt(LocalDateTime.now());
        } catch (Exception e) {
            log.error("Failed to send notification {}", n.getId(), e);
            n.setStatus(NotificationQueue.NotificationStatus.FAILED);
        }
    }
}
