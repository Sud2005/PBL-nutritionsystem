package com.app.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "food_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private FoodCategory category;

    @Enumerated(EnumType.STRING)
    private CuisineType cuisineType;

    private boolean isVeg;
    private boolean isJainCompatible;
    private boolean isVegan;

    @Column(columnDefinition = "TEXT")
    private String commonAllergens;

    private double calories100g;
    private double protein100g;
    private double carbs100g;
    private double fat100g;
}
