package com.app.backend.controller;

import com.app.backend.model.WeightLog;
import com.app.backend.repository.WeightLogRepository;
import com.app.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/weight-log")
public class WeightLogController {

    @Autowired
    private WeightLogRepository weightRepo;

    @PostMapping
    public ResponseEntity<?> addLog(Authentication auth, @RequestBody Map<String, Double> payload) {
        Long userId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        WeightLog log = WeightLog.builder()
                .userId(userId)
                .weightKg(payload.get("weightKg"))
                .build();
        return ResponseEntity.ok(weightRepo.save(log));
    }

    @GetMapping
    public ResponseEntity<?> getLogs(Authentication auth) {
        Long userId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        List<WeightLog> logs = weightRepo.findTop4ByUserIdOrderByLoggedAtDesc(userId);
        return ResponseEntity.ok(logs);
    }
}
