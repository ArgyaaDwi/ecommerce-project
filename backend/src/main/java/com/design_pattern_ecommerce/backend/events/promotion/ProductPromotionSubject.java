package com.design_pattern_ecommerce.backend.events.promotion;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.design_pattern_ecommerce.backend.repositories.UserPromotionRepository;

@Component
public class ProductPromotionSubject implements PromotionSubject {

    @Autowired
    private UserPromotionRepository userPromotionRepository;

    private final List<PromotionObserver> observers;

    public ProductPromotionSubject(List<PromotionObserver> observers) {
        this.observers = observers;
    }

    @Override
    public void notifySubscribers(PromotionEvent event) {
        if (event == null) {
            return;
        }

        List<Long> userIds = userPromotionRepository.findUserIdsByProductId(event.getProductId());
        if (userIds == null || userIds.isEmpty()) {
            return;
        }

        Set<Long> uniqueUserIds = new LinkedHashSet<>(userIds);
        for (Long userId : uniqueUserIds) {
            if (userId == null) {
                continue;
            }

            for (PromotionObserver observer : observers) {
                observer.update(userId, event);
            }
        }
    }
}
