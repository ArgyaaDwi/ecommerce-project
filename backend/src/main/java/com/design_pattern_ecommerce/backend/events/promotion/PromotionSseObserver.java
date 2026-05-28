package com.design_pattern_ecommerce.backend.events.promotion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.design_pattern_ecommerce.backend.sse.SseConnectionManager;

@Component
public class PromotionSseObserver implements PromotionObserver {

    @Autowired
    private SseConnectionManager sseConnectionManager;

    @Override
    public void update(long userId, PromotionEvent event) {
        if (event == null) {
            return;
        }

        sseConnectionManager.send(userId, "promotion", event);
    }
}
