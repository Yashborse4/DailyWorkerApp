package com.workerdemo.repository;

import com.workerdemo.entity.WorkerProfile;
import com.workerdemo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, Long> {
    Optional<WorkerProfile> findByUser(User user);
    Optional<WorkerProfile> findByUserId(Long userId);
    boolean existsByUser(User user);
}
