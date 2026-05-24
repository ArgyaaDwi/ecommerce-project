
package com.design_pattern_ecommerce.backend.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    @Column(name = "session_key")
    private String sessionKey;

    @Column(name = "product_preference")
    private String productPreference;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user")
    private List<UserPreference> userPreferences = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<UserPromotion> userPromotions = new ArrayList<>();

    public User() {
        // Default no-arg constructor required by JPA
    }

    public User(String name, String sessionKey) {
        this.name = name;
        this.sessionKey = sessionKey;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSessionKey() {
        return sessionKey;
    }

    public void setSessionKey(String sessionKey) {
        this.sessionKey = sessionKey;
    }

    public String getProductPreference() {
        return productPreference;
    }

    public void setProductPreference(String productPreference) {
        this.productPreference = productPreference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<UserPreference> getUserPreferences() {
        return userPreferences;
    }

    public void setUserPreferences(List<UserPreference> userPreferences) {
        this.userPreferences = userPreferences;
    }

    public List<UserPromotion> getUserPromotions() {
        return userPromotions;
    }

    public void setUserPromotions(List<UserPromotion> userPromotions) {
        this.userPromotions = userPromotions;
    }

    /**
     * Create new user session with random session key
     * Static factory method - demonstrates OOP factory pattern
     * 
     * @param name Username
     * @param userRepository Repository for database operations
     * @return User object saved to database with generated ID and session key
     */
    public static User createSession(String name, com.design_pattern_ecommerce.backend.repositories.UserRepository userRepository) {

        var sessionKey = generateSessionKey();
        if (name == null || name.trim().isEmpty()) {
            name = generateRandomName(); // For demo purposes, generate random name if not provided
        }

        User user = new User(name, sessionKey);
        
        // Save to database and return
        return userRepository.save(user);
    }

    private static String generateSessionKey() {
        return java.util.UUID.randomUUID().toString();
    }

    private static String generateRandomName() {
        String[] names = {"Alice", "Bob", "Charlie", "David", "Eve"};
        return names[(int) (Math.random() * names.length)];
    }

    /**
     * Save user to database
     * Instance method for persistence operations
     * 
     * @param userRepository Repository for database operations
     * @return Saved user with generated ID from database
     */
    public User save(com.design_pattern_ecommerce.backend.repositories.UserRepository userRepository) {
        return userRepository.save(this);
    }

    /**
     * Find user by session key
     * Static method - query operation
     * 
     * @param sessionKey Session key to search for
     * @param userRepository Repository for database operations
     * @return User if found, null otherwise
     */
    public static User findBySessionKey(String sessionKey, com.design_pattern_ecommerce.backend.repositories.UserRepository userRepository) {
        return userRepository.findBySessionKey(sessionKey);
    }
}
