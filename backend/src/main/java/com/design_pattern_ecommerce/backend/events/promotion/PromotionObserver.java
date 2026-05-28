package com.design_pattern_ecommerce.backend.events.promotion;

public interface PromotionObserver {
    void update(long userId, PromotionEvent event);
}
