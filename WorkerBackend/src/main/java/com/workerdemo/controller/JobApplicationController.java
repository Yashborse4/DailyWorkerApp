package com.workerdemo.controller;

import com.workerdemo.dto.JobApplicationRequest;
import com.workerdemo.dto.JobApplicationResponse;
import com.workerdemo.entity.User;
import com.workerdemo.service.JobApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Job Applications", description = "Endpoints for applying to jobs and managing applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping("/jobs/{jobId}/apply")
    @Operation(summary = "Apply for a specific job")
    public ResponseEntity<JobApplicationResponse> applyForJob(
            @PathVariable Long jobId,
            @Valid @RequestBody JobApplicationRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(jobApplicationService.applyForJob(jobId, request, user));
    }

    @GetMapping("/jobs/{jobId}/applications")
    @Operation(summary = "Get all applications for a specific job (Hirer only)")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsForJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsForJob(jobId, user));
    }

    @GetMapping("/applications/my")
    @Operation(summary = "Get all applications submitted by the current worker")
    public ResponseEntity<List<JobApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(jobApplicationService.getMyApplications(user));
    }

    @PatchMapping("/applications/{applicationId}/status")
    @Operation(summary = "Update job application status (Hirer only)")
    public ResponseEntity<JobApplicationResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam com.workerdemo.entity.JobApplicationStatus status,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(jobApplicationService.updateApplicationStatus(applicationId, status, user));
    }

    @GetMapping("/applications/stats/count")
    @Operation(summary = "Get total applicant count for current hirer")
    public ResponseEntity<Long> getTotalApplicantCount(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(jobApplicationService.countTotalApplicantsForHirer(user));
    }

    @GetMapping("/applications/stats/shortlisted/count")
    @Operation(summary = "Get total shortlisted applicant count for current hirer")
    public ResponseEntity<Long> getShortlistedApplicantCount(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(jobApplicationService.countShortlistedApplicantsForHirer(user));
    }
}
