package com.design_pattern_ecommerce.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.design_pattern_ecommerce.backend.models.UserPreference;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
    UserPreference findByUserId(int userId);
}
