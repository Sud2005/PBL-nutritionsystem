package com.app.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "weight_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeightLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private double weightKg;

    private LocalDateTime loggedAt;

    @PrePersist
    protected void onCreate() {
        if (loggedAt == null) {
            loggedAt = LocalDateTime.now();
        }
    }
}
