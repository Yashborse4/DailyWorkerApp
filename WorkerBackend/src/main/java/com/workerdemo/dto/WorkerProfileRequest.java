package com.workerdemo.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerProfileRequest {
    
    @Size(max = 1000)
    private String bio;
    
    private Set<String> skills;
    
    private Integer experienceYears;
    
    private Boolean isAvailable;

    private String trade;

    private String location;

    private String verificationStatus;
}
