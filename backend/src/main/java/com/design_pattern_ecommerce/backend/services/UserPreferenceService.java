package com.design_pattern_ecommerce.backend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.design_pattern_ecommerce.backend.models.UserPreference;
import com.design_pattern_ecommerce.backend.models.User;
import com.design_pattern_ecommerce.backend.models.ProductCategory;
import com.design_pattern_ecommerce.backend.repositories.UserPreferenceRepository;
import com.design_pattern_ecommerce.backend.repositories.UserRepository;
import com.design_pattern_ecommerce.backend.repositories.ProductCategoryRepository;

@Service
public class UserPreferenceService {
    
    @Autowired
    private UserPreferenceRepository userPreferenceRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductCategoryRepository productCategoryRepository;


    public List<UserPreference> getUserPreferencesByUserId(int userId) {
        return userPreferenceRepository.findByUserId(userId);
    }

    /**
     * Set product preference for user
     * 
     * @param userId ID of the user to update
     * @param preference Product preference to set
     * @return Updated user
     */
    public User setUserPreferenceType(int userId, String preference) {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        if (preference == null || preference.trim().isEmpty()) {
            preference = "default";
        }

        user.setProductPreferenceType(preference);

        return userRepository.save(user);
    }

    public User setUserProductCategoryPreference(int userId, List<Integer> productCategoryIds) {
        
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        // Validate that all product categories exist
        for (Integer categoryId : productCategoryIds) {
            long categoryIdLong = (long) categoryId;

            ProductCategory category = productCategoryRepository.findById(categoryIdLong).orElse(null);
            if (category == null) {
                throw new IllegalArgumentException("Product category with id " + categoryIdLong + " not found");
            }
        }

        // Create UserPreference rows for each category
        for (Integer categoryId : productCategoryIds) {
            long categoryIdLong = (long) categoryId;
            ProductCategory category = productCategoryRepository.findById(categoryIdLong).get();

            UserPreference userPreference = new UserPreference();
            userPreference.setUser(user);
            userPreference.setProductCategory(category);
            
            userPreferenceRepository.save(userPreference);
        }

        // update user product_preference_type
        if (productCategoryIds.size() >= 1) {
            user.setProductPreferenceType("category");
        } else {
            user.setProductPreferenceType("default");

            // delete user preferences if category list is empty
            List<UserPreference> existingPreferences = userPreferenceRepository.findByUserId(userId);
            userPreferenceRepository.deleteAll(existingPreferences);
        }

        return userRepository.save(user);
    }


}
