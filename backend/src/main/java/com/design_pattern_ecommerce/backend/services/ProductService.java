package com.design_pattern_ecommerce.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.design_pattern_ecommerce.backend.models.Product;
import com.design_pattern_ecommerce.backend.models.User;
import com.design_pattern_ecommerce.backend.repositories.ProductRepository;
import com.design_pattern_ecommerce.backend.repositories.UserRepository;
import com.design_pattern_ecommerce.backend.strategies.UserProductDisplay;
import com.design_pattern_ecommerce.backend.strategies.UserProductDisplayStrategy;
import com.design_pattern_ecommerce.backend.strategies.impl.PreferenceProductStartegy;
import com.design_pattern_ecommerce.backend.strategies.impl.DefaultProductStategy;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PreferenceProductStartegy preferenceProductStartegy;
    @Autowired
    private DefaultProductStategy defaultProductStategy;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategory_Id(categoryId);
    }

    public Product createProduct(String name, String description, Integer price, Integer categoryId) {

        Product newProduct = new Product();
        newProduct.setName(name);
        newProduct.setDescription(description);
        newProduct.setPrice(price);
        newProduct.setCategoryId(categoryId);

        return productRepository.save(newProduct);
    }

    public Product updateProduct(Long id, String name, String description, Integer price, Integer categoryId) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct == null) {
            return null;
        }

        existingProduct.setName(name);
        existingProduct.setDescription(description);
        existingProduct.setPrice(price);
        existingProduct.setCategoryId(categoryId);

        return productRepository.save(existingProduct);
    }

    public List<Product> getRecomendationProductByUserPreference(int userId) {

        // get User
        User user = userRepository.findById(userId).orElse(null);
        UserProductDisplay userProductDisplay = new UserProductDisplay();

        UserProductDisplayStrategy strategy;

        // Pilih strategy berdasarkan user preference type
        if (user != null && "category".equals(user.getProductPreferenceType())) {
            strategy = preferenceProductStartegy;
        } else {
            strategy = defaultProductStategy;
        }

        userProductDisplay.setStrategy(strategy);

        return userProductDisplay.displayUserProductRecomendations(userId);
    }
}
