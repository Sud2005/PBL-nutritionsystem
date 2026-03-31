package com.app.backend.repository;

import com.app.backend.model.DietaryRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DietaryRuleRepository extends JpaRepository<DietaryRule, Long> {
    List<DietaryRule> findByIsActiveTrueOrderByPriorityDesc();
}
