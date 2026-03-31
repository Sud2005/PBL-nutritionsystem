package com.app.backend.controller;

import com.app.backend.model.DietaryRule;
import com.app.backend.model.FoodItem;
import com.app.backend.repository.DietaryRuleRepository;
import com.app.backend.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private FoodItemRepository foodRepo;

    @Autowired
    private DietaryRuleRepository ruleRepo;

    // --- FOOD ITEM MANAGEMENT ---

    @GetMapping("/food")
    public ResponseEntity<?> getAllFoods() {
        return ResponseEntity.ok(foodRepo.findAll());
    }

    @PostMapping("/food")
    public ResponseEntity<?> createFood(@RequestBody FoodItem item) {
        return ResponseEntity.ok(foodRepo.save(item));
    }

    @PutMapping("/food/{id}")
    public ResponseEntity<?> updateFood(@PathVariable Long id, @RequestBody FoodItem itemDetails) {
        return foodRepo.findById(id).map(food -> {
            food.setName(itemDetails.getName());
            food.setCategory(itemDetails.getCategory());
            food.setCuisineType(itemDetails.getCuisineType());
            food.setVeg(itemDetails.isVeg());
            food.setJainCompatible(itemDetails.isJainCompatible());
            food.setVegan(itemDetails.isVegan());
            food.setCommonAllergens(itemDetails.getCommonAllergens());
            food.setCalories100g(itemDetails.getCalories100g());
            food.setProtein100g(itemDetails.getProtein100g());
            food.setCarbs100g(itemDetails.getCarbs100g());
            food.setFat100g(itemDetails.getFat100g());
            return ResponseEntity.ok(foodRepo.save(food));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/food/{id}")
    public ResponseEntity<?> deleteFood(@PathVariable Long id) {
        return foodRepo.findById(id).map(food -> {
            foodRepo.delete(food);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- DIETARY RULE MANAGEMENT ---

    @GetMapping("/rules")
    public ResponseEntity<?> getAllRules() {
        return ResponseEntity.ok(ruleRepo.findAll());
    }

    @PostMapping("/rules")
    public ResponseEntity<?> createRule(@RequestBody DietaryRule rule) {
        return ResponseEntity.ok(ruleRepo.save(rule));
    }

    @PutMapping("/rules/{id}")
    public ResponseEntity<?> updateRule(@PathVariable Long id, @RequestBody DietaryRule ruleDetails) {
        return ruleRepo.findById(id).map(rule -> {
            rule.setCondition(ruleDetails.getCondition());
            rule.setAction(ruleDetails.getAction());
            rule.setPriority(ruleDetails.getPriority());
            rule.setActive(ruleDetails.isActive());
            return ResponseEntity.ok(ruleRepo.save(rule));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/rules/{id}")
    public ResponseEntity<?> deleteRule(@PathVariable Long id) {
        return ruleRepo.findById(id).map(rule -> {
            ruleRepo.delete(rule);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
