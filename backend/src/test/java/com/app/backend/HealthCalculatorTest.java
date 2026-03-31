package com.app.backend;

import com.app.backend.model.ActivityLevel;
import com.app.backend.model.Gender;
import com.app.backend.service.BMICalculatorService;
import com.app.backend.service.BMRCalculatorService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class HealthCalculatorTest {

    @Autowired
    private BMICalculatorService bmiService;

    @Autowired
    private BMRCalculatorService bmrService;

    @Test
    public void testBMICalculation() {
        // Height: 175cm, Weight: 70kg -> BMI should be around 22.86
        double bmi = bmiService.calculateBMI(175.0, 70.0);
        Assertions.assertEquals(22.86, bmi, 0.5);
        Assertions.assertEquals("Normal", bmiService.getCategory(bmi));
        
        // Obese test
        double obeseBmi = bmiService.calculateBMI(160.0, 90.0);
        Assertions.assertEquals("Obese", bmiService.getCategory(obeseBmi));
    }

    @Test
    public void testBMRAndTDEECalculation() {
        // Male, 25yr, 70kg, 175cm
        double bmr = bmrService.calculateBMR(70.0, 175.0, 25, Gender.MALE);
        Assertions.assertTrue(bmr > 1600 && bmr < 1800, "BMR should be in logical range");
        
        double tdee = bmrService.calculateTDEE(bmr, ActivityLevel.MODERATELY_ACTIVE);
        Assertions.assertTrue(tdee > 2500 && tdee < 2800, "TDEE moderately active multiplier check");
    }
}
