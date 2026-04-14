package com.workerdemo.dto;

import com.workerdemo.entity.JobCategory;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 100)
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 2000)
    private String description;

    @NotNull(message = "Category is required")
    private JobCategory category;

    @NotNull(message = "Budget is required")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal budget;

    @NotBlank(message = "Location is required")
    private String location;

    private Double latitude;
    private Double longitude;

    private List<String> images;
}
