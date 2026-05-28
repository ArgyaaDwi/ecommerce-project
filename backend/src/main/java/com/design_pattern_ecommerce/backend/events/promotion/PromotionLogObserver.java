package com.design_pattern_ecommerce.backend.events.promotion;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.design_pattern_ecommerce.backend.models.Product;
import com.design_pattern_ecommerce.backend.models.ProductPromotion;
import com.design_pattern_ecommerce.backend.models.ProductPromotionLog;
import com.design_pattern_ecommerce.backend.models.User;
import com.design_pattern_ecommerce.backend.repositories.ProductPromotionLogRepository;
import com.design_pattern_ecommerce.backend.repositories.ProductPromotionRepository;
import com.design_pattern_ecommerce.backend.services.ProductService;
import com.design_pattern_ecommerce.backend.services.UserService;

@Component
public class PromotionLogObserver implements PromotionObserver {

    @Autowired
    private ProductPromotionLogRepository productPromotionLogRepository;

    @Autowired
    private ProductPromotionRepository productPromotionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Override
    public void update(long userId, PromotionEvent event) {
        if (event == null) {
            return;
        }

        Optional<ProductPromotionLog> existing = productPromotionLogRepository
                .findByUserIdAndProductPromotionId(userId, event.getPromotionId());

        if (existing.isPresent()) {
            return;
        }

        User user = userService.getUserById(userId);
        if (user == null) {
            return;
        }

        Product product = productService.getProductById(event.getProductId());
        if (product == null) {
            return;
        }

        ProductPromotion promotion = productPromotionRepository.findById(event.getPromotionId())
                .orElse(null);
        if (promotion == null) {
            return;
        }

        ProductPromotionLog log = new ProductPromotionLog();
        log.setUser(user);
        log.setProduct(product);
        log.setProductPromotion(promotion);
        log.setIsSeen(false);
        productPromotionLogRepository.save(log);
    }
}
