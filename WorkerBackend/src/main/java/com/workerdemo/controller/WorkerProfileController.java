package com.workerdemo.controller;

import com.workerdemo.dto.WorkerProfileRequest;
import com.workerdemo.dto.WorkerProfileResponse;
import com.workerdemo.entity.User;
import com.workerdemo.service.WorkerProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/workers")
@RequiredArgsConstructor
@Tag(name = "Workers", description = "Worker profile management endpoints")
public class WorkerProfileController {

    private final WorkerProfileService workerProfileService;

    @PostMapping("/profile")
    @Operation(summary = "Create or update current user's worker profile")
    public ResponseEntity<WorkerProfileResponse> createOrUpdateProfile(
            @Valid @RequestBody WorkerProfileRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(workerProfileService.createOrUpdateProfile(request, user));
    }

    @GetMapping("/{userId}/profile")
    @Operation(summary = "Get worker profile by user ID")
    public ResponseEntity<WorkerProfileResponse> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(workerProfileService.getProfile(userId));
    }
}
