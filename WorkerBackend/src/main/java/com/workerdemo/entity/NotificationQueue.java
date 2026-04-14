package com.workerdemo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notification_queue", indexes = {
    @Index(name = "idx_notif_status_retry", columnList = "status, nextRetryAt"),
    @Index(name = "idx_notif_user", columnList = "userId")
})
public class NotificationQueue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String title;
    private String body;
    
    @Column(columnDefinition = "TEXT")
    private String metadata; // JSON string

    @Enumerated(EnumType.STRING)
    private NotificationStatus status;

    private int attempts;
    private LocalDateTime nextRetryAt;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum NotificationStatus {
        PENDING, SENT, FAILED
    }
}
