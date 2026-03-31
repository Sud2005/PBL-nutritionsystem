package com.app.backend.dto;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class HealthProfileResponseDto {
    private Long id;
    private HealthProfileDto profile;
    private double bmi;
    private String bmiCategory;
    private double bmr;
    private double tdee;
}
