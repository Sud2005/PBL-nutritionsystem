package com.app.backend.controller;

import com.app.backend.model.DietPlan;
import com.app.backend.repository.DietPlanRepository;
import com.app.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class DietPlanHistoryController {

    @Autowired
    private DietPlanRepository dietPlanRepo;

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(Authentication auth) {
        Long userId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        List<DietPlan> plans = dietPlanRepo.findByUserIdOrderByGeneratedAtDesc(userId);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlanById(@PathVariable Long id, Authentication auth) {
        Long userId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        return dietPlanRepo.findById(id)
                .filter(p -> p.getUserId().equals(userId))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
