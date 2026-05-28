package com.design_pattern_ecommerce.backend.strategies;

import java.util.List;

import com.design_pattern_ecommerce.backend.models.Product;

public class UserProductDisplay {
    private UserProductDisplayStrategy strategy;  

    public UserProductDisplay() {
    }

    public void setStrategy(UserProductDisplayStrategy strategy) {
        this.strategy = strategy;
    }
    
    public UserProductDisplayStrategy getStrategy() {
        return strategy;
    }
    
    public List<Product> displayUserProductRecomendations(int userId) {
        if (strategy == null) {
            throw new IllegalStateException("Strategy not set");
        }
        
        return strategy.GetUserProducts(userId);
    }
}