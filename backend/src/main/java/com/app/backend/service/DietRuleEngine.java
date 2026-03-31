package com.app.backend.service;

import com.app.backend.model.*;
import com.app.backend.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DietRuleEngine {

    @Autowired
    private FoodItemRepository foodRepo;

    @Autowired
    private HealthProfileRepository profileRepo;

    @Autowired
    private WeightLogRepository weightRepo;

    @Autowired
    private DietPlanRepository dietPlanRepo;

    @Autowired
    private BMICalculatorService bmiService;

    @Autowired
    private BMRCalculatorService bmrService;

    @Autowired
    private DietaryRuleRepository ruleRepo;

    private final ObjectMapper mapper = new ObjectMapper();

    public DietPlan generateDietPlan(Long userId) throws JsonProcessingException {
        HealthProfile profile = profileRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Health Profile not found"));

        double bmi = bmiService.calculateBMI(profile.getHeightCm(), profile.getWeightKg());
        double bmr = bmrService.calculateBMR(profile.getWeightKg(), profile.getHeightCm(), profile.getAge(), profile.getGender());
        double baseTdee = bmrService.calculateTDEE(bmr, profile.getActivityLevel());

        List<WeightLog> recentLogs = weightRepo.findTop4ByUserIdOrderByLoggedAtDesc(userId);
        double targetCalories = baseTdee;

        if (recentLogs.size() >= 2) {
            double oldest = recentLogs.get(recentLogs.size() - 1).getWeightKg();
            double newest = recentLogs.get(0).getWeightKg();
            double diff = newest - oldest;
            
            if (bmi > 25) {
                if (diff >= 0) targetCalories -= 400;
                else targetCalories -= 200;
            } else if (bmi < 18.5) {
                if (diff <= 0) targetCalories += 400;
                else targetCalories += 200;
            }
        } else {
            if (bmi > 25) targetCalories -= 300;
            else if (bmi < 18.5) targetCalories += 300;
        }

        List<FoodItem> allFoods = foodRepo.findAll();
        List<FoodItem> allowed = applyFilters(allFoods, profile);
        
        List<FoodItem> recommended = new ArrayList<>();
        List<FoodItem> limited = new ArrayList<>();
        List<FoodItem> avoid = new ArrayList<>();
        
        categorizeFoods(allowed, profile, bmi, recommended, limited, avoid);

        Map<String, Object> mealPlan = generateMealPlan(targetCalories, recommended, limited);

        DietPlan plan = DietPlan.builder()
                .userId(userId)
                .targetCalories(targetCalories)
                .recommendedFoods(mapper.writeValueAsString(recommended))
                .limitedFoods(mapper.writeValueAsString(limited))
                .avoidFoods(mapper.writeValueAsString(avoid))
                .mealBreakdown(mapper.writeValueAsString(mealPlan))
                .build();

        return dietPlanRepo.save(plan);
    }

    private List<FoodItem> applyFilters(List<FoodItem> foods, HealthProfile profile) {
        return foods.stream().filter(f -> {
            if (profile.getDietaryPreference() == DietaryPreference.VEG && !f.isVeg()) return false;
            if (profile.getDietaryPreference() == DietaryPreference.JAIN && !f.isJainCompatible()) return false;
            if (profile.getDietaryPreference() == DietaryPreference.VEGAN && !f.isVegan()) return false;
            
            if (profile.getAllergies() != null && !profile.getAllergies().isEmpty() && !profile.getAllergies().equals("[]")) {
                try {
                    List<String> userAllergies = mapper.readValue(profile.getAllergies(), List.class);
                    List<String> foodAllergens = mapper.readValue(f.getCommonAllergens(), List.class);
                    for (String a : userAllergies) {
                        if (foodAllergens.contains(a)) return false;
                    }
                } catch (Exception e) {}
            }
            return true;
        }).collect(Collectors.toList());
    }

    private void categorizeFoods(List<FoodItem> allowed, HealthProfile profile, double bmi, 
                                 List<FoodItem> rec, List<FoodItem> lim, List<FoodItem> av) {
        
        List<String> conditions = new ArrayList<>();
        try {
            if (profile.getHealthConditions() != null) {
                conditions = mapper.readValue(profile.getHealthConditions(), List.class);
            }
        } catch(Exception e) {}

        List<DietaryRule> dbRules = ruleRepo.findByIsActiveTrueOrderByPriorityDesc();

        for (FoodItem f : allowed) {
            boolean isAvoid = false;
            boolean isLimited = false;
            
            if (bmi > 25) {
                if (f.getCategory() == FoodCategory.SNACK || f.getCategory() == FoodCategory.FAT) isAvoid = true;
                if (f.getName().contains("White Rice") || f.getName().contains("Potato")) isLimited = true;
            } else if (bmi < 18.5) {
                if (f.getCategory() == FoodCategory.FAT || f.getCategory() == FoodCategory.PROTEIN) rec.add(f);
            }

            if (conditions.contains("Diabetes Type 2")) {
                if (f.getName().contains("White Rice") || f.getName().contains("Potato") || f.getCategory() == FoodCategory.SNACK) isAvoid = true;
                if (f.getName().contains("Oats") || f.getName().contains("Karela")) rec.add(f);
            }
            if (conditions.contains("High Cholesterol")) {
                if (f.getName().contains("Ghee") || f.getName().contains("Butter")) isAvoid = true;
                if (f.getName().contains("Oats") || f.getName().contains("Almonds")) rec.add(f);
            }
            if (conditions.contains("Hypertension") && f.getCategory() == FoodCategory.SNACK) {
                isAvoid = true;
            }
            if (conditions.contains("PCOS")) {
                if (f.getName().contains("Flaxseeds")) rec.add(f);
                if (f.getCategory() == FoodCategory.DAIRY) isLimited = true;
            }

            // Database rules
            for (DietaryRule rule : dbRules) {
                if (evaluateCondition(rule.getCondition(), bmi, conditions)) {
                    String action = rule.getAction();
                    if (action.contains("AVOID " + f.getName()) || action.contains("AVOID " + f.getCategory().name())) isAvoid = true;
                    else if (action.contains("LIMIT " + f.getName()) || action.contains("LIMIT " + f.getCategory().name())) isLimited = true;
                    else if (action.contains("RECOMMEND " + f.getName()) || action.contains("RECOMMEND " + f.getCategory().name())) {
                        if (!rec.contains(f)) rec.add(f);
                    }
                }
            }
            
            if (isAvoid) av.add(f);
            else if (isLimited) lim.add(f);
            else if (!rec.contains(f)) rec.add(f);
        }
    }

    private boolean evaluateCondition(String condition, double bmi, List<String> conditions) {
        if (condition == null || condition.trim().isEmpty() || condition.equals("ALL")) return true;
        if (condition.contains("BMI > 25") && bmi > 25) return true;
        if (condition.contains("BMI < 18.5") && bmi < 18.5) return true;
        if (condition.contains("Diabetes") && conditions.contains("Diabetes Type 2")) return true;
        if (condition.contains("PCOS") && conditions.contains("PCOS")) return true;
        if (condition.contains("Hypertension") && conditions.contains("Hypertension")) return true;
        return false;
    }

    private Map<String, Object> generateMealPlan(double targetCal, List<FoodItem> rec, List<FoodItem> lim) {
        Map<String, Object> plan = new HashMap<>();
        Random rand = new Random();
        
        List<FoodItem> available = new ArrayList<>(rec);
        if (available.isEmpty()) available.addAll(lim);
        
        if (!available.isEmpty()) {
            plan.put("Breakfast", generateMealItems(targetCal * 0.25, available, rand));
            plan.put("Lunch", generateMealItems(targetCal * 0.35, available, rand));
            plan.put("Dinner", generateMealItems(targetCal * 0.30, available, rand));
            plan.put("Snacks", generateMealItems(targetCal * 0.10, available, rand));
        } else {
            plan.put("Breakfast", new ArrayList<>());
            plan.put("Lunch", new ArrayList<>());
            plan.put("Dinner", new ArrayList<>());
            plan.put("Snacks", new ArrayList<>());
        }
        return plan;
    }

    private List<Map<String, Object>> generateMealItems(double target, List<FoodItem> foods, Random rand) {
        List<Map<String, Object>> meal = new ArrayList<>();
        if (foods.isEmpty()) return meal;
        
        double currentCal = 0;
        int attempts = 0;
        while (currentCal < target && attempts < 15) {
            FoodItem f = foods.get(rand.nextInt(foods.size()));
            double portionMultiplier = 0.5 + (rand.nextDouble() * 1.5);
            double addedCal = f.getCalories100g() * portionMultiplier;
            double pCarbs = f.getCarbs100g() * portionMultiplier;
            double pProtein = f.getProtein100g() * portionMultiplier;
            double pFat = f.getFat100g() * portionMultiplier;
            
            Map<String, Object> item = new HashMap<>();
            item.put("name", f.getName());
            item.put("category", f.getCategory().toString());
            item.put("portionGrams", Math.round(100 * portionMultiplier));
            item.put("calories", Math.round(addedCal));
            item.put("carbs", Math.round(pCarbs));
            item.put("protein", Math.round(pProtein));
            item.put("fat", Math.round(pFat));
            meal.add(item);
            
            currentCal += addedCal;
            attempts++;
        }
        return meal;
    }
}
