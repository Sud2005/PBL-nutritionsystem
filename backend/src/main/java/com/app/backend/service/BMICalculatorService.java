package com.app.backend.service;
import org.springframework.stereotype.Service;

@Service
public class BMICalculatorService {
    public double calculateBMI(double heightCm, double weightKg) {
        if (heightCm <= 0) return 0.0;
        double heightM = heightCm / 100.0;
        return weightKg / (heightM * heightM);
    }
    
    public String getCategory(double bmi) {
        if (bmi < 18.5) return "Underweight";
        if (bmi <= 24.9) return "Normal";
        if (bmi <= 29.9) return "Overweight";
        return "Obese";
    }
}
