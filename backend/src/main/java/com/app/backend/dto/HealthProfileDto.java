package com.app.backend.dto;
import com.app.backend.model.*;
import lombok.Data;
@Data
public class HealthProfileDto {
    private int age;
    private Gender gender;
    private double heightCm;
    private double weightKg;
    private double bodyFatPercent;
    private ActivityLevel activityLevel;
    private String healthConditions;
    private DietaryPreference dietaryPreference;
    private String allergies;
}
