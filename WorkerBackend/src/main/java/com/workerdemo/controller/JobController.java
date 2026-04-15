package com.workerdemo.controller;

import com.workerdemo.dto.JobRequest;
import com.workerdemo.dto.JobResponse;
import com.workerdemo.entity.JobStatus;
import com.workerdemo.entity.User;
import com.workerdemo.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs", description = "Job management endpoints")
public class JobController {

    private final JobService jobService;

    @PostMapping
    @Operation(summary = "Create a new job posting")
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(jobService.createJob(request, user));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job details by ID")
    public ResponseEntity<JobResponse> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJob(id));
    }

    @GetMapping
    @Operation(summary = "Get all job postings")
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/my-jobs")
    @Operation(summary = "Get current hirer's job postings")
    public ResponseEntity<List<JobResponse>> getMyJobs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.getJobsByHirer(user));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update job status")
    public ResponseEntity<JobResponse> updateJobStatus(
            @PathVariable Long id,
            @RequestParam JobStatus status,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(jobService.updateJobStatus(id, status, user));
    }
}
