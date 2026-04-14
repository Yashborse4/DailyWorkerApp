package com.workerdemo.repository;

import com.workerdemo.entity.NotificationQueue;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationQueueRepository extends JpaRepository<NotificationQueue, Long> {
    
    @Query("SELECT n FROM NotificationQueue n WHERE n.status = :status AND (n.nextRetryAt IS NULL OR n.nextRetryAt <= :now)")
    List<NotificationQueue> findPendingNotifications(
            @Param("status") NotificationQueue.NotificationStatus status,
            @Param("now") LocalDateTime now,
            Pageable pageable);
}
