package com.design_pattern_ecommerce.backend.strategies.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.design_pattern_ecommerce.backend.models.Product;
import com.design_pattern_ecommerce.backend.repositories.ProductRepository;
import com.design_pattern_ecommerce.backend.repositories.UserPreferenceRepository;
import com.design_pattern_ecommerce.backend.strategies.UserProductDisplayStrategy;

@Component
public class PreferenceProductStartegy implements UserProductDisplayStrategy {

    @Autowired
    private UserPreferenceRepository userPreferenceRepository;
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> GetUserProducts(int userId) {
        
        List<Product> products = null;

        List<Long> categoryIds = userPreferenceRepository.findCategoryIdsByUserId(userId);

        if (categoryIds == null || categoryIds.isEmpty()) {
            return null;
        }
        
        products = productRepository.findByCategory_IdIn(categoryIds);

        return products;
    }
    
}
