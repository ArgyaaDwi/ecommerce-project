package com.design_pattern_ecommerce.backend.events.promotion;

import java.time.LocalDateTime;

import com.design_pattern_ecommerce.backend.models.ProductPromotion;

public class PromotionEvent {
    private PromotionEventType type;
    private long promotionId;
    private long productId;
    private String promotionName;
    private Integer promotionPrice;
    private String description;
    private LocalDateTime createdAt;

    public PromotionEvent() {
    }

    public PromotionEvent(
            PromotionEventType type,
            long promotionId,
            long productId,
            String promotionName,
            Integer promotionPrice,
            String description,
            LocalDateTime createdAt) {
        this.type = type;
        this.promotionId = promotionId;
        this.productId = productId;
        this.promotionName = promotionName;
        this.promotionPrice = promotionPrice;
        this.description = description;
        this.createdAt = createdAt;
    }

    public static PromotionEvent fromPromotion(PromotionEventType type, ProductPromotion promotion) {
        if (promotion == null || promotion.getProduct() == null) {
            throw new IllegalArgumentException("Promotion and promotion.product cannot be null");
        }

        return new PromotionEvent(
                type,
                promotion.getId(),
                promotion.getProduct().getId(),
                promotion.getName(),
                promotion.getPrice(),
                promotion.getDescription(),
                promotion.getCreatedAt());
    }

    public PromotionEventType getType() {
        return type;
    }

    public void setType(PromotionEventType type) {
        this.type = type;
    }

    public long getPromotionId() {
        return promotionId;
    }

    public void setPromotionId(long promotionId) {
        this.promotionId = promotionId;
    }

    public long getProductId() {
        return productId;
    }

    public void setProductId(long productId) {
        this.productId = productId;
    }

    public String getPromotionName() {
        return promotionName;
    }

    public void setPromotionName(String promotionName) {
        this.promotionName = promotionName;
    }

    public Integer getPromotionPrice() {
        return promotionPrice;
    }

    public void setPromotionPrice(Integer promotionPrice) {
        this.promotionPrice = promotionPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
