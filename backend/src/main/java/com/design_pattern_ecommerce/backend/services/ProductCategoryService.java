package com.design_pattern_ecommerce.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.design_pattern_ecommerce.backend.models.ProductCategory;
import com.design_pattern_ecommerce.backend.repositories.ProductCategoryRepository;

@Service
public class ProductCategoryService {
    
    @Autowired
    private ProductCategoryRepository productCategoryRepository;


    public ProductCategory createCategory(String name) {
        ProductCategory productCategory = new ProductCategory();
        productCategory.setName(name);
        return productCategoryRepository.save(productCategory);
    }

    public ProductCategory updateCategory(Long id, String name) {
        ProductCategory existingCategory = productCategoryRepository.findById(id).orElse(null);
        if (existingCategory != null) {
            existingCategory.setName(name);
            return productCategoryRepository.save(existingCategory);
        }
        return null;
    }
}
