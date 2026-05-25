package com.design_pattern_ecommerce.backend.services;

import com.design_pattern_ecommerce.backend.models.User;
import com.design_pattern_ecommerce.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * UserService - Business logic layer for User operations
 * Separates business logic from Controller and Model
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserPreferenceService userPreferenceService;

    /**
     * Create new user session with random session key
     * 
     * @param name Username
     * @return User object saved to database with generated ID and session key
     */
    public User createSession(String name) {
        // Validate name
        String validatedName = name;
        if (validatedName == null || validatedName.trim().isEmpty()) {
            validatedName = generateRandomName(); // For demo purposes
        }

        String sessionKey = generateSessionKey();

        User user = new User(validatedName, sessionKey);
        user = userRepository.save(user);

        // Set default product preference
        userPreferenceService.setUserPreferenceType(user.getId(), "default");

        return user;
    }

    /**
     * Find user by session key
     * 
     * @param sessionKey Session key to search for
     * @return User if found, null otherwise
     */
    public User findBySessionKey(String sessionKey) {
        return userRepository.findBySessionKey(sessionKey);
    }

    /**
     * Save user to database
     * 
     * @param user User object to save
     * @return Saved user with generated ID from database
     */
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Validate and extract session key from Authorization header
     * Expected format: "Bearer <session-key>"
     * 
     * @param authHeader Authorization header value
     * @return Session key if valid, null otherwise
     */
    public String extractSessionKey(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    // Private helper methods

    private String generateSessionKey() {
        return UUID.randomUUID().toString();
    }

    private String generateRandomName() {
        String[] names = {"Alice", "Bob", "Charlie", "David", "Eve"};
        return names[(int) (Math.random() * names.length)];
    }
}
