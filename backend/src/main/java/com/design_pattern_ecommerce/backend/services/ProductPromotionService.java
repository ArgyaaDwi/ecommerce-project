package com.design_pattern_ecommerce.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.design_pattern_ecommerce.backend.models.Product;
import com.design_pattern_ecommerce.backend.models.ProductPromotion;
import com.design_pattern_ecommerce.backend.models.ProductPromotionLog;
import com.design_pattern_ecommerce.backend.models.User;
import com.design_pattern_ecommerce.backend.models.UserPromotion;
import com.design_pattern_ecommerce.backend.repositories.ProductPromotionLogRepository;
import com.design_pattern_ecommerce.backend.repositories.ProductPromotionRepository;
import com.design_pattern_ecommerce.backend.repositories.UserPromotionRepository;


@Service
public class ProductPromotionService {
    @Autowired
    private UserPromotionRepository userPromotionRepository;
    @Autowired
    private ProductPromotionRepository productPromotionRepository;
    @Autowired
    private ProductPromotionLogRepository productPromotionLogRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;


    public List<ProductPromotion> getAllProductPromotions() {
        return productPromotionRepository.findAll();
    }

    public List<ProductPromotion> getUserSubscribedProductPromotions(long userId) {
    
        List<Long> productIds = userPromotionRepository.findProductIdsByUserId(userId);

        List<ProductPromotion> promotions = productPromotionRepository.findByIdInAndIsActiveTrue(productIds); 

        // only update that showed to user
        updateSeenPromotionLogs(productIds, userId);

        return promotions;
    }


    // create log for user when show promotion to user, and update log to seen = true when user see the promotion
    private void updateSeenPromotionLogs(List<Long> productIds, long userId) {
        User user = userService.getUserById(userId);
        
        for (Long productId : productIds) {
            // Get all product promotions for this product
            List<ProductPromotion> promotions = productPromotionRepository.findByProductIdAndIsActiveTrue(productId);
            
            for (ProductPromotion promotion : promotions) {
                // Check if log already exists
                Optional<ProductPromotionLog> existingLog = productPromotionLogRepository
                    .findByUserIdAndProductPromotionId(userId, (long) promotion.getId());
                
                if (existingLog.isPresent()) {
                    // Update seen to true
                    ProductPromotionLog log = existingLog.get();
                    log.setIsSeen(true);
                    productPromotionLogRepository.save(log);
                } else {
                    // Create new log
                    Product product = productService.getProductById(productId);
                    ProductPromotionLog newLog = new ProductPromotionLog();
                    newLog.setUser(user);
                    newLog.setProductPromotion(promotion);
                    newLog.setProduct(product);
                    newLog.setIsSeen(true);
                    productPromotionLogRepository.save(newLog);
                }
            }
        }
    }

    // user subscribes to promotion for a product
    public void SubscribePromotion(long userId, Long productId) {
        
        User user = userService.getUserById(userId);
        Product product = productService.getProductById(productId);

        // check if has already subscribed
        Optional<UserPromotion> existingSubscription = userPromotionRepository
            .findByUserIdAndProductId(userId, product.getId());
        
        if (existingSubscription.isPresent()) {
            return; // Already subscribed
        }

        // create subscription record
        UserPromotion userPromotion = new UserPromotion();
        userPromotion.setUser(user);
        userPromotion.setProduct(product);
        userPromotionRepository.save(userPromotion);
    }


    public ProductPromotion CreateNewPromotion(Long productId, String name, int price, String description) {
        Product product = productService.getProductById(productId);

        ProductPromotion promotion = new ProductPromotion();
        promotion.setProduct(product);
        promotion.setName(name);
        promotion.setPrice(price);
        promotion.setDescription(description);
        promotion.setIsActive(true);
        productPromotionRepository.save(promotion);

        return promotion;
    }


    public void UnsubscribePromotion(long userId, Long productId) {
        Product product = productService.getProductById(productId);
        userPromotionRepository.deleteByUserIdAndProductId(userId, product.getId());
    }


    public UserPromotion getByProductIdAndUserId(long userId, int productId) {
        return userPromotionRepository.findByUserIdAndProductId(userId, productId).orElse(null);
    }


    public void ActiveOrDeactivePromotion(int promotionId, boolean isActive) {
        ProductPromotion promotion = productPromotionRepository.findById((long) promotionId)
            .orElseThrow(() -> new RuntimeException("Promotion not found"));

        promotion.setIsActive(isActive);
        productPromotionRepository.save(promotion);
    }
}

