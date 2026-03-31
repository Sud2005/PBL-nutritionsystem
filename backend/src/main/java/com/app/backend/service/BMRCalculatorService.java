package com.app.backend.service;
import com.app.backend.model.Gender;
import com.app.backend.model.ActivityLevel;
import org.springframework.stereotype.Service;

@Service
public class BMRCalculatorService {
    public double calculateBMR(double weightKg, double heightCm, int age, Gender gender) {
        double bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
        if (gender == Gender.MALE) {
            return bmr + 5;
        } else {
            return bmr - 161;
        }
    }
    
    public double calculateTDEE(double bmr, ActivityLevel activityLevel) {
        if (activityLevel == null) return bmr * 1.2;
        return switch (activityLevel) {
            case SEDENTARY -> bmr * 1.2;
            case LIGHTLY_ACTIVE -> bmr * 1.375;
            case MODERATELY_ACTIVE -> bmr * 1.55;
            case VERY_ACTIVE -> bmr * 1.725;
        };
    }
}
