package com.app.backend.repository;

import com.app.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByAssignedNutritionistIdAndAllowProfileSharingTrue(Long id);
}
