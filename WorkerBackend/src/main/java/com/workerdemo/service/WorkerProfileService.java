package com.workerdemo.service;

import com.workerdemo.dto.WorkerProfileRequest;
import com.workerdemo.dto.WorkerProfileResponse;
import com.workerdemo.entity.Role;
import com.workerdemo.entity.User;
import com.workerdemo.entity.WorkerProfile;
import com.workerdemo.exception.BusinessException;
import com.workerdemo.exception.ErrorCode;
import com.workerdemo.repository.UserRepository;
import com.workerdemo.repository.WorkerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WorkerProfileService {

    private final WorkerProfileRepository workerProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public WorkerProfileResponse createOrUpdateProfile(WorkerProfileRequest request, User user) {
        WorkerProfile profile = workerProfileRepository.findByUser(user)
                .orElse(WorkerProfile.builder().user(user).build());

        profile.setBio(request.getBio());
        profile.setSkills(request.getSkills());
        profile.setExperienceYears(request.getExperienceYears());
        if (request.getIsAvailable() != null) {
            profile.setIsAvailable(request.getIsAvailable());
        }
        if (request.getVerificationStatus() != null) {
            profile.setVerificationStatus(request.getVerificationStatus());
        }

        // Upgrade user role to WORKER if not already
        if (user.getRole() != Role.WORKER && user.getRole() != Role.ADMIN) {
            user.setRole(Role.WORKER);
            userRepository.save(user);
        }

        WorkerProfile savedProfile = workerProfileRepository.save(profile);
        return mapToResponse(savedProfile);
    }

    public WorkerProfileResponse getProfile(Long userId) {
        return workerProfileRepository.findByUserId(userId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR, "Worker profile not found"));
    }

    private WorkerProfileResponse mapToResponse(WorkerProfile profile) {
        return WorkerProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .displayName(profile.getUser().getDisplayName())
                .bio(profile.getBio())
                .skills(profile.getSkills())
                .experienceYears(profile.getExperienceYears())
                .rating(profile.getRating())
                .isAvailable(profile.getIsAvailable())
                .completedJobsCount(profile.getCompletedJobsCount())
                .verificationStatus(profile.getVerificationStatus())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
