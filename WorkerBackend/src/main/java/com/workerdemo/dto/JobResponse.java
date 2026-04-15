package com.workerdemo.dto;

import com.workerdemo.entity.JobCategory;
import com.workerdemo.entity.JobStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private JobCategory category;
    private BigDecimal budget;
    private String location;
    private Double latitude;
    private Double longitude;
    private JobStatus status;
    private Integer applicantCount;
    private Long hirerId;
    private String hirerName;
    private Long workerId;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
