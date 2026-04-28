package com.workerdemo.service;

import com.workerdemo.dto.JobApplicationRequest;
import com.workerdemo.dto.JobApplicationResponse;
import com.workerdemo.entity.Job;
import com.workerdemo.entity.JobApplication;
import com.workerdemo.entity.JobApplicationStatus;
import com.workerdemo.entity.User;
import com.workerdemo.exception.BusinessException;
import com.workerdemo.exception.ErrorCode;
import com.workerdemo.repository.JobApplicationRepository;
import com.workerdemo.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final NotificationService notificationService;

    @Transactional
    public JobApplicationResponse applyForJob(Long jobId, JobApplicationRequest request, User worker) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Job not found"));

        if (jobApplicationRepository.existsByJobAndWorker(job, worker)) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "You have already applied for this job");
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .worker(worker)
                .bidAmount(request.getBidAmount())
                .coverLetter(request.getCoverLetter())
                .status(JobApplicationStatus.PENDING)
                .build();

        JobApplication savedApplication = jobApplicationRepository.save(application);

        notificationService.createNotification(
                job.getHirer().getId(),
                "New Applicant!",
                worker.getDisplayName() + " has applied for your job: " + job.getTitle()
        );

        return mapToResponse(savedApplication);
    }

    public List<JobApplicationResponse> getApplicationsForJob(Long jobId, User hirer) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Job not found"));

        if (!job.getHirer().getId().equals(hirer.getId())) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "Not authorized to view applications for this job");
        }

        return jobApplicationRepository.findByJob(job).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Long countTotalApplicantsForHirer(User hirer) {
        List<Job> myJobs = jobRepository.findByHirer(hirer);
        return myJobs.stream()
                .mapToLong(job -> jobApplicationRepository.countByJob(job))
                .sum();
    }

    public Long countShortlistedApplicantsForHirer(User hirer) {
        return jobApplicationRepository.countByJob_HirerAndStatus(hirer, com.workerdemo.entity.JobApplicationStatus.ACCEPTED);
    }

    public List<JobApplicationResponse> getMyApplications(User worker) {
        return jobApplicationRepository.findByWorker(worker).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobApplicationResponse updateApplicationStatus(Long applicationId, JobApplicationStatus status, User hirer) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getJob().getHirer().getId().equals(hirer.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        application.setStatus(status);
        JobApplication savedApplication = jobApplicationRepository.save(application);

        String title = status == JobApplicationStatus.ACCEPTED ? "Bid Accepted!" : "Application Update";
        String body = status == JobApplicationStatus.ACCEPTED 
                ? "Your bid for '" + application.getJob().getTitle() + "' was accepted!" 
                : "Your application for '" + application.getJob().getTitle() + "' was marked as " + status;

        if (status == JobApplicationStatus.COMPLETED) {
            title = "Job Completed! 🎉";
            body = "Congratulations! Your work for '" + application.getJob().getTitle() + "' has been marked as completed. Earnings added to your profile.";
        }

        notificationService.createNotification(
                application.getWorker().getId(),
                title,
                body
        );

        return mapToResponse(savedApplication);
    }

    private JobApplicationResponse mapToResponse(JobApplication application) {
        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .workerId(application.getWorker().getId())
                .workerName(application.getWorker().getDisplayName())
                .bidAmount(application.getBidAmount())
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus())
                .createdAt(application.getCreatedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
