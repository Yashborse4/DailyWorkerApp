package com.workerdemo.dto;

import com.workerdemo.entity.JobApplicationStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long workerId;
    private String workerName;
    private BigDecimal bidAmount;
    private String coverLetter;
    private JobApplicationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
