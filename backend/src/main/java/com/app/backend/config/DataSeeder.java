package com.app.backend.config;

import com.app.backend.model.CuisineType;
import com.app.backend.model.FoodCategory;
import com.app.backend.model.FoodItem;
import com.app.backend.repository.FoodItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedDatabase(FoodItemRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.saveAll(List.of(
                    // GRAIN
                    new FoodItem(null, "Roti (Whole Wheat)", FoodCategory.GRAIN, CuisineType.NORTH_INDIAN, true, true, true, "[\"Gluten\"]", 297, 10, 58, 2),
                    new FoodItem(null, "White Rice", FoodCategory.GRAIN, CuisineType.GENERAL, true, true, true, "[]", 130, 2.7, 28, 0.3),
                    new FoodItem(null, "Brown Rice", FoodCategory.GRAIN, CuisineType.GENERAL, true, true, true, "[]", 111, 2.6, 23, 0.9),
                    new FoodItem(null, "Oats", FoodCategory.GRAIN, CuisineType.GENERAL, true, true, true, "[]", 389, 16.9, 66, 6.9),
                    new FoodItem(null, "Dosa", FoodCategory.GRAIN, CuisineType.SOUTH_INDIAN, true, true, true, "[]", 168, 3.9, 29, 3.7),
                    new FoodItem(null, "Idli", FoodCategory.GRAIN, CuisineType.SOUTH_INDIAN, true, true, true, "[]", 65, 2, 15, 0),
                    
                    // PROTEIN
                    new FoodItem(null, "Toor Dal", FoodCategory.PROTEIN, CuisineType.GENERAL, true, true, true, "[]", 343, 22, 63, 1.5),
                    new FoodItem(null, "Moong Dal", FoodCategory.PROTEIN, CuisineType.GENERAL, true, true, true, "[]", 347, 24, 63, 1),
                    new FoodItem(null, "Rajma", FoodCategory.PROTEIN, CuisineType.NORTH_INDIAN, true, true, true, "[]", 127, 8.7, 22.8, 0.5),
                    new FoodItem(null, "Chole", FoodCategory.PROTEIN, CuisineType.NORTH_INDIAN, true, true, true, "[]", 164, 8.9, 27.4, 2.6),
                    new FoodItem(null, "Paneer", FoodCategory.PROTEIN, CuisineType.NORTH_INDIAN, true, true, false, "[\"Dairy\"]", 265, 11, 3.4, 20),
                    new FoodItem(null, "Chicken Breast", FoodCategory.PROTEIN, CuisineType.GENERAL, false, false, false, "[]", 165, 31, 0, 3.6),
                    new FoodItem(null, "Boiled Egg", FoodCategory.PROTEIN, CuisineType.GENERAL, false, false, false, "[\"Eggs\"]", 155, 13, 1.1, 11),
                    new FoodItem(null, "Fish (Rohu)", FoodCategory.PROTEIN, CuisineType.GENERAL, false, false, false, "[]", 97, 16.5, 0, 3),

                    // VEGETABLE
                    new FoodItem(null, "Spinach", FoodCategory.VEGETABLE, CuisineType.GENERAL, true, true, true, "[]", 23, 2.9, 3.6, 0.4),
                    new FoodItem(null, "Lauki", FoodCategory.VEGETABLE, CuisineType.GENERAL, true, true, true, "[]", 15, 0.2, 3.4, 0.1),
                    new FoodItem(null, "Karela", FoodCategory.VEGETABLE, CuisineType.GENERAL, true, true, true, "[]", 17, 1, 3.7, 0.2),
                    new FoodItem(null, "Bhindi", FoodCategory.VEGETABLE, CuisineType.GENERAL, true, true, true, "[]", 33, 1.9, 7.5, 0.2),
                    new FoodItem(null, "Onion", FoodCategory.VEGETABLE, CuisineType.GENERAL, true, false, true, "[]", 40, 1.1, 9.3, 0.1),
                    new FoodItem(null, "Garlic", FoodCategory.VEGETABLE, CuisineType.GENERAL, true, false, true, "[]", 149, 6.4, 33, 0.5),
                    new FoodItem(null, "Potato", FoodCategory.VEGETABLE, CuisineType.GENERAL, true, false, true, "[]", 77, 2, 17, 0.1),
                    new FoodItem(null, "Carrot", FoodCategory.VEGETABLE, CuisineType.GENERAL, true, true, true, "[]", 41, 0.9, 9.6, 0.2),

                    // DAIRY & FAT
                    new FoodItem(null, "Curd", FoodCategory.DAIRY, CuisineType.GENERAL, true, true, false, "[\"Dairy\"]", 98, 3.5, 4.7, 4.3),
                    new FoodItem(null, "Milk", FoodCategory.DAIRY, CuisineType.GENERAL, true, true, false, "[\"Dairy\"]", 61, 3.2, 4.8, 3.3),
                    new FoodItem(null, "Ghee", FoodCategory.FAT, CuisineType.GENERAL, true, true, false, "[\"Dairy\"]", 900, 0, 0, 100),
                    new FoodItem(null, "Almonds", FoodCategory.FAT, CuisineType.GENERAL, true, true, true, "[\"Nuts\"]", 579, 21, 21, 49),
                    new FoodItem(null, "Flaxseeds", FoodCategory.FAT, CuisineType.GENERAL, true, true, true, "[]", 534, 18.3, 28.9, 42.2),

                    // SNACKS
                    new FoodItem(null, "Makhana", FoodCategory.SNACK, CuisineType.GENERAL, true, true, true, "[]", 350, 9.7, 77, 0.1),
                    new FoodItem(null, "Puri", FoodCategory.GRAIN, CuisineType.NORTH_INDIAN, true, true, true, "[\"Gluten\"]", 310, 6, 38, 15),
                    new FoodItem(null, "Pakora", FoodCategory.SNACK, CuisineType.GENERAL, true, true, true, "[]", 250, 6, 25, 12),
                    new FoodItem(null, "Samosa", FoodCategory.SNACK, CuisineType.NORTH_INDIAN, true, false, true, "[\"Gluten\"]", 262, 3.5, 32, 13)
                ));
            }
        };
    }
}
