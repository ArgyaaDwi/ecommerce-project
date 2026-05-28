package com.design_pattern_ecommerce.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.design_pattern_ecommerce.backend.models.UserPromotion;


@Repository
public interface UserPromotionRepository extends JpaRepository<UserPromotion, Long> {
    List<UserPromotion> findByUserId(Long userId);
    Optional<UserPromotion> findByUserIdAndProductId(Long userId, long productId);

    boolean existsByUserIdAndProductId(Long userId, long productId);
    
    void deleteByUserIdAndProductId(Long userId, long productId);
    
    @Query("SELECT up.product.id FROM UserPromotion up WHERE up.user.id = :userId")
    List<Long> findProductIdsByUserId(@Param("userId") Long userId);


    @Query("SELECT up.user.id FROM UserPromotion up WHERE up.product.id = :productId")
    List<Long> findUserIdsByProductId(@Param("productId") Long productId);
}