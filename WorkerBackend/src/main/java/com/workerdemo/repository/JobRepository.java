package com.workerdemo.repository;

import com.workerdemo.entity.Job;
import com.workerdemo.entity.JobCategory;
import com.workerdemo.entity.JobStatus;
import com.workerdemo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    List<Job> findByHirer(User hirer);
    List<Job> findByWorker(User worker);
    List<Job> findByStatus(JobStatus status);
    List<Job> findByCategory(JobCategory category);
}
