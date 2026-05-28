package com.design_pattern_ecommerce.backend.strategies.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.design_pattern_ecommerce.backend.models.Product;
import com.design_pattern_ecommerce.backend.repositories.ProductRepository;
import com.design_pattern_ecommerce.backend.strategies.UserProductDisplayStrategy;

@Component
public class DefaultProductStategy implements UserProductDisplayStrategy {

    @Autowired
    private ProductRepository productRepository;


    @Override
    public List<Product> GetUserProducts(int userId) {
       
        List<Product> products = productRepository.findAll();

        return products;
    }
    
}
