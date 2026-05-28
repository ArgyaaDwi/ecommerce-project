package com.design_pattern_ecommerce.backend.events.promotion;

public interface PromotionSubject {
    void notifySubscribers(PromotionEvent event);
}
