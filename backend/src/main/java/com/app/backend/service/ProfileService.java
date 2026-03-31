package com.app.backend.service;

import com.app.backend.dto.HealthProfileDto;
import com.app.backend.dto.HealthProfileResponseDto;
import com.app.backend.model.HealthProfile;
import com.app.backend.model.User;
import com.app.backend.repository.HealthProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {
    @Autowired
    private HealthProfileRepository profileRepository;

    @Autowired
    private BMICalculatorService bmiService;

    @Autowired
    private BMRCalculatorService bmrService;

    public HealthProfileResponseDto getProfile(User user) {
        Optional<HealthProfile> hpOpt = profileRepository.findByUserId(user.getId());
        if (hpOpt.isEmpty()) return null;
        return mapToResponse(hpOpt.get());
    }

    public HealthProfileResponseDto saveProfile(User user, HealthProfileDto dto) {
        HealthProfile hp = profileRepository.findByUserId(user.getId()).orElse(new HealthProfile());
        hp.setUser(user);
        hp.setAge(dto.getAge());
        hp.setGender(dto.getGender());
        hp.setHeightCm(dto.getHeightCm());
        hp.setWeightKg(dto.getWeightKg());
        hp.setBodyFatPercent(dto.getBodyFatPercent());
        hp.setActivityLevel(dto.getActivityLevel());
        hp.setHealthConditions(dto.getHealthConditions());
        hp.setDietaryPreference(dto.getDietaryPreference());
        hp.setAllergies(dto.getAllergies());
        
        hp = profileRepository.save(hp);
        return mapToResponse(hp);
    }
    
    public void deleteProfile(User user) {
        profileRepository.findByUserId(user.getId()).ifPresent(profileRepository::delete);
    }

    private HealthProfileResponseDto mapToResponse(HealthProfile hp) {
        double bmi = bmiService.calculateBMI(hp.getHeightCm(), hp.getWeightKg());
        String cat = bmiService.getCategory(bmi);
        double bmr = bmrService.calculateBMR(hp.getWeightKg(), hp.getHeightCm(), hp.getAge(), hp.getGender());
        double tdee = bmrService.calculateTDEE(bmr, hp.getActivityLevel());

        HealthProfileDto dto = new HealthProfileDto();
        dto.setAge(hp.getAge());
        dto.setGender(hp.getGender());
        dto.setHeightCm(hp.getHeightCm());
        dto.setWeightKg(hp.getWeightKg());
        dto.setBodyFatPercent(hp.getBodyFatPercent());
        dto.setActivityLevel(hp.getActivityLevel());
        dto.setHealthConditions(hp.getHealthConditions());
        dto.setDietaryPreference(hp.getDietaryPreference());
        dto.setAllergies(hp.getAllergies());

        return HealthProfileResponseDto.builder()
                .id(hp.getId())
                .profile(dto)
                .bmi(Math.round(bmi * 10.0) / 10.0)
                .bmiCategory(cat)
                .bmr(Math.round(bmr))
                .tdee(Math.round(tdee))
                .build();
    }
}
