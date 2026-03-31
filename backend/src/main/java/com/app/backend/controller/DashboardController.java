package com.app.backend.controller;

import com.app.backend.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @GetMapping
    public ResponseEntity<?> getDashboard(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(Map.of(
                "message", "Welcome " + userDetails.getUser().getName(),
                "role", userDetails.getUser().getRole(),
                "email", userDetails.getUser().getEmail()
        ));
    }
}
