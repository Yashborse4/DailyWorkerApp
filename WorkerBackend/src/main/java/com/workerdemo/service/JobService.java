package com.workerdemo.service;

import com.workerdemo.dto.JobRequest;
import com.workerdemo.dto.JobResponse;
import com.workerdemo.entity.Job;
import com.workerdemo.entity.JobStatus;
import com.workerdemo.entity.User;
import com.workerdemo.exception.BusinessException;
import com.workerdemo.exception.ErrorCode;
import com.workerdemo.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final com.workerdemo.repository.JobApplicationRepository jobApplicationRepository;

    @Transactional
    public JobResponse createJob(JobRequest request, User hirer) {
        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .budget(request.getBudget())
                .location(request.getLocation())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .images(request.getImages())
                .hirer(hirer)
                .status(JobStatus.PUBLISHED)
                .build();

        Job savedJob = jobRepository.save(job);
        return mapToResponse(savedJob);
    }

    public JobResponse getJob(Long id) {
        return jobRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Job not found"));
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<JobResponse> getJobsByHirer(User hirer) {
        return jobRepository.findByHirer(hirer).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobResponse updateJobStatus(Long id, JobStatus status, User user) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Job not found"));

        // Basic authorization check
        if (!job.getHirer().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Not authorized to update this job");
        }

        job.setStatus(status);
        return mapToResponse(jobRepository.save(job));
    }

    private JobResponse mapToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .category(job.getCategory())
                .budget(job.getBudget())
                .location(job.getLocation())
                .latitude(job.getLatitude())
                .longitude(job.getLongitude())
                .status(job.getStatus())
                .applicantCount((int) jobApplicationRepository.countByJob(job))
                .hirerId(job.getHirer().getId())
                .hirerName(job.getHirer().getDisplayName())
                .workerId(job.getWorker() != null ? job.getWorker().getId() : null)
                .images(job.getImages())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
