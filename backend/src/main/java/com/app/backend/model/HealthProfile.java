package com.app.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private int age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private double heightCm;
    private double weightKg;
    private double bodyFatPercent;

    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel;

    @Column(columnDefinition = "TEXT")
    private String healthConditions;

    @Enumerated(EnumType.STRING)
    private DietaryPreference dietaryPreference;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
