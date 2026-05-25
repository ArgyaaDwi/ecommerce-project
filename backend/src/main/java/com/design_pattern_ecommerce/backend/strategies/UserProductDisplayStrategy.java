package com.design_pattern_ecommerce.backend.strategies;

import java.util.List;

import com.design_pattern_ecommerce.backend.models.Product;

public interface UserProductDisplayStrategy {
    
    List<Product> GetUserProducts(int userId);

}
