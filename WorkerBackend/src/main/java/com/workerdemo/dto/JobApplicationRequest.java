package com.workerdemo.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationRequest {
    
    @DecimalMin(value = "0.0")
    private BigDecimal bidAmount;
    
    @Size(max = 1000)
    private String coverLetter;
}
