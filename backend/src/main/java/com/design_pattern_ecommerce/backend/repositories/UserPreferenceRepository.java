package com.design_pattern_ecommerce.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.design_pattern_ecommerce.backend.models.UserPreference;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
    List<UserPreference> findByUserId(int userId);

    @Query("SELECT u.productCategory.id FROM UserPreference u WHERE u.user.id = :userId")
    List<Long> findCategoryIdsByUserId(@Param("userId") int userId);


}
