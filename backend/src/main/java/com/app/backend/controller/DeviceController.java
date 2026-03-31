package com.app.backend.controller;

import com.app.backend.security.CustomUserDetails;
import com.app.backend.service.DeviceStubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/device")
public class DeviceController {

    @Autowired
    private DeviceStubService deviceStubService;

    @GetMapping("/simulate")
    public ResponseEntity<?> simulate(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        DeviceStubService.DeviceState state = deviceStubService.simulate(userDetails.getUser().getId());
        
        return ResponseEntity.ok(Map.of(
                "connected", true,
                "weightKg", state.weightKg(),
                "bodyFatPercent", state.bodyFatPercent()
        ));
    }
}
