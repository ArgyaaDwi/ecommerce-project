package com.design_pattern_ecommerce.backend.strategies.impl;

import java.util.List;

import com.design_pattern_ecommerce.backend.models.Product;
import com.design_pattern_ecommerce.backend.strategies.UserProductDisplayStrategy;

public class PreferenceProductStartegy implements UserProductDisplayStrategy {

    @Override
    public List<Product> GetUserProducts(int userId) {
    
        return null;
    }
    
}
