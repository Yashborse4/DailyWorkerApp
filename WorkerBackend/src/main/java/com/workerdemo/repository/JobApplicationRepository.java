package com.workerdemo.repository;

import com.workerdemo.entity.Job;
import com.workerdemo.entity.JobApplication;
import com.workerdemo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJob(Job job);
    List<JobApplication> findByWorker(User worker);
    Optional<JobApplication> findByJobAndWorker(Job job, User worker);
    boolean existsByJobAndWorker(Job job, User worker);
    long countByJob(Job job);
    long countByJob_HirerAndStatus(User hirer, com.workerdemo.entity.JobApplicationStatus status);
}
