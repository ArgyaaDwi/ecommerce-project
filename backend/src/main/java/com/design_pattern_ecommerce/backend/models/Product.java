package com.design_pattern_ecommerce.backend.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer price;

    @Column
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ProductCategory category;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<ProductPromotion> promotions = new ArrayList<>();

    @Transient
    private Boolean isSubscribedPromotion;

    public Product() {
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

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategoryId(Integer categoryId) {
        if (this.category == null) {
            this.category = new ProductCategory();
        }
        this.category.setId(categoryId);
    }

    public ProductCategory getCategory() {
        return category;
    }

    public void setCategory(ProductCategory category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    public List<ProductPromotion> getPromotions() {
        return promotions;
    }

    public void setPromotions(List<ProductPromotion> promotions) {
        this.promotions = promotions;
    }

    public Boolean getIsSubscribedPromotion() {
        return isSubscribedPromotion;
    }

    public void setIsSubscribedPromotion(Boolean isSubscribedPromotion) {
        this.isSubscribedPromotion = isSubscribedPromotion;
    }
}