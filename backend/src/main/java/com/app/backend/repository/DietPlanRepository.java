package com.app.backend.repository;

import com.app.backend.model.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {
    Optional<DietPlan> findTopByUserIdOrderByGeneratedAtDesc(Long userId);
    List<DietPlan> findByUserIdOrderByGeneratedAtDesc(Long userId);
}
