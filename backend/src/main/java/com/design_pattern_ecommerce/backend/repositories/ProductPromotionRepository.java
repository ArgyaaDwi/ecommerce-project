package com.design_pattern_ecommerce.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.design_pattern_ecommerce.backend.models.ProductPromotion;

@Repository
public interface ProductPromotionRepository extends JpaRepository<ProductPromotion, Long> {
    List<ProductPromotion> findByProductId(Long productId);
    List<ProductPromotion> findByIdIn(List<Long> ids);

    @Query("SELECT p FROM ProductPromotion p JOIN UserPromotion up ON p.product.id = up.product.id WHERE up.user.id = :userId AND p.product.id IN :productIds")
    List<ProductPromotion> findByUserIdAndProductIdIn(@Param("userId") Long userId, @Param("productIds") List<Long> productIds);
}
