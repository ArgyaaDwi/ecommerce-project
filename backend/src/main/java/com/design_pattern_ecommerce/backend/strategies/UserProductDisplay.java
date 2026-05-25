package com.design_pattern_ecommerce.backend.strategies;

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
    
    public void displayUserProductRecomendations(int userId) {
        if (strategy == null) {
            throw new IllegalStateException("Strategy not set");
        }
        strategy.GetUserProducts(userId);
    }
}