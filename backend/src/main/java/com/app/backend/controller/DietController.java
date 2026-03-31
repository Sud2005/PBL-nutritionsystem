package com.app.backend.controller;

import com.app.backend.model.DietPlan;
import com.app.backend.repository.DietPlanRepository;
import com.app.backend.security.CustomUserDetails;
import com.app.backend.service.DietRuleEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diet")
public class DietController {

    @Autowired
    private DietRuleEngine dietRuleEngine;

    @Autowired
    private DietPlanRepository dietPlanRepo;

    @PostMapping("/generate")
    public ResponseEntity<?> generatePlan(Authentication auth) {
        try {
            Long userId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
            DietPlan plan = dietRuleEngine.generateDietPlan(userId);
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating plan: " + e.getMessage());
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestPlan(Authentication auth) {
        Long userId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        return dietPlanRepo.findTopByUserIdOrderByGeneratedAtDesc(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
