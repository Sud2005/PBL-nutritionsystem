package com.app.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "dietary_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietaryRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String condition; // Format: "BMI > 25", "Diabetes = true", etc.

    @Column(columnDefinition = "TEXT")
    private String action; // Format: "AVOID white_rice", "LIMIT high_fat", etc.

    private int priority;
    
    private boolean isActive;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
