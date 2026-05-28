package com.design_pattern_ecommerce.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.design_pattern_ecommerce.backend.models.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory_Id(Long categoryId);

    @Query("SELECT p FROM Product p WHERE p.category.id IN :categoryIds")
    List<Product> findByCategory_IdIn(@Param("categoryIds") List<Long> categoryIds);
}
