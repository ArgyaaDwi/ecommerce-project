package com.design_pattern_ecommerce.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// import com.design_pattern_ecommerce.backend.models.UserPreference;
import com.design_pattern_ecommerce.backend.models.User;
// import com.design_pattern_ecommerce.backend.repositories.UserPreferenceRepository;
import com.design_pattern_ecommerce.backend.repositories.UserRepository;

@Service
public class UserPreferenceService {
    
    // @Autowired
    // private UserPreferenceRepository userPreferenceRepository;
    @Autowired
    private UserRepository userRepository;

    /**
     * Set product preference for user
     * 
     * @param userId ID of the user to update
     * @param preference Product preference to set
     * @return Updated user
     */
    public User setProductPreference(int userId, String preference) {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        if (preference == null || preference.trim().isEmpty()) {
            preference = "default";
        }

        user.setProductPreference(preference);

        return userRepository.save(user);
    }


}
