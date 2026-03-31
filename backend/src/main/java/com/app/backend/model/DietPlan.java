package com.app.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "diet_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private LocalDateTime generatedAt;

    private double targetCalories;

    @Column(columnDefinition = "TEXT")
    private String recommendedFoods;

    @Column(columnDefinition = "TEXT")
    private String limitedFoods;

    @Column(columnDefinition = "TEXT")
    private String avoidFoods;

    @Column(columnDefinition = "TEXT")
    private String mealBreakdown;

    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
    }
}
