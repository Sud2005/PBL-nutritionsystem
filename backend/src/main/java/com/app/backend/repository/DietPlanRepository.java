package com.app.backend.repository;

import com.app.backend.model.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {
    Optional<DietPlan> findTopByUserIdOrderByGeneratedAtDesc(Long userId);
}
