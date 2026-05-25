package com.design_pattern_ecommerce.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.design_pattern_ecommerce.backend.models.Product;
import com.design_pattern_ecommerce.backend.repositories.ProductRepository;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> getProductsByUserPreferences(int userId) {

        // todo call display strategy based on user preferences

        return null;
    }
}
