package com.app.backend.repository;

import com.app.backend.model.WeightLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WeightLogRepository extends JpaRepository<WeightLog, Long> {
    List<WeightLog> findTop4ByUserIdOrderByLoggedAtDesc(Long userId);
}
