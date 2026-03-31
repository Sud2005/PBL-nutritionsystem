package com.app.backend.controller;

import com.app.backend.model.User;
import com.app.backend.repository.DietPlanRepository;
import com.app.backend.repository.HealthProfileRepository;
import com.app.backend.repository.UserRepository;
import com.app.backend.repository.WeightLogRepository;
import com.app.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/nutritionist")
@PreAuthorize("hasAuthority('ROLE_NUTRITIONIST')")
public class NutritionistController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private HealthProfileRepository profileRepo;
    
    @Autowired
    private DietPlanRepository dietPlanRepo;
    
    @Autowired
    private WeightLogRepository weightRepo;

    @GetMapping("/patients")
    public ResponseEntity<?> getAssignedPatients(Authentication auth) {
        Long nutritionistId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        List<User> patients = userRepo.findByAssignedNutritionistIdAndAllowProfileSharingTrue(nutritionistId);
        
        List<Map<String, Object>> patientData = patients.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("email", p.getEmail());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(patientData);
    }

    @GetMapping("/patients/{patientId}/profile")
    public ResponseEntity<?> getPatientProfile(@PathVariable Long patientId, Authentication auth) {
        Long nutritionistId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        
        // Verify patient belongs to this nutritionist
        User patient = userRepo.findById(patientId)
                .filter(u -> nutritionistId.equals(u.getAssignedNutritionistId()) && u.isAllowProfileSharing())
                .orElse(null);
                
        if (patient == null) return ResponseEntity.status(403).body("Unauthorized to view this patient");

        Map<String, Object> response = new HashMap<>();
        response.put("user", patient);
        response.put("healthProfile", profileRepo.findByUserId(patientId).orElse(null));
        response.put("latestDietPlan", dietPlanRepo.findTopByUserIdOrderByGeneratedAtDesc(patientId).orElse(null));
        response.put("weightLogs", weightRepo.findTop4ByUserIdOrderByLoggedAtDesc(patientId));
        
        return ResponseEntity.ok(response);
    }
}
