package com.app.backend.controller;

import com.app.backend.dto.HealthProfileDto;
import com.app.backend.dto.HealthProfileResponseDto;
import com.app.backend.security.CustomUserDetails;
import com.app.backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        HealthProfileResponseDto resp = profileService.getProfile(userDetails.getUser());
        if (resp == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resp);
    }

    @PostMapping
    public ResponseEntity<?> createProfile(Authentication authentication, @RequestBody HealthProfileDto dto) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        HealthProfileResponseDto resp = profileService.saveProfile(userDetails.getUser(), dto);
        return ResponseEntity.ok(resp);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody HealthProfileDto dto) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        HealthProfileResponseDto resp = profileService.saveProfile(userDetails.getUser(), dto);
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteProfile(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        profileService.deleteProfile(userDetails.getUser());
        return ResponseEntity.ok("Profile deleted");
    }
}
