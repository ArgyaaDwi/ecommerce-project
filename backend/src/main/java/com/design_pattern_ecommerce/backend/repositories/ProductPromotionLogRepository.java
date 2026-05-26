package com.design_pattern_ecommerce.backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.design_pattern_ecommerce.backend.models.ProductPromotionLog;


@Repository
public interface ProductPromotionLogRepository extends JpaRepository<ProductPromotionLog, Long> {
    Optional<ProductPromotionLog> findByUserIdAndProductPromotionId(Long userId, Long productPromotionId);
}
