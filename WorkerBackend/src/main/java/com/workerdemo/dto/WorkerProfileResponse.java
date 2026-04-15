package com.workerdemo.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfileResponse {
    private Long id;
    private Long userId;
    private String displayName;
    private String bio;
    private Set<String> skills;
    private Integer experienceYears;
    private Double rating;
    private Boolean isAvailable;
    private Integer completedJobsCount;
    private String verificationStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
