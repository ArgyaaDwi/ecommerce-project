package com.design_pattern_ecommerce.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.Valid;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.design_pattern_ecommerce.backend.models.ProductPromotion;
import com.design_pattern_ecommerce.backend.services.ProductPromotionService;

@RestController
@RequestMapping("/admin/promotion")
@CrossOrigin(origins = "*")
public class AdminProductPromotionController {

    @Autowired
    private ProductPromotionService productPromotionService;

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<ProductPromotion>>> getAllAdminPromotion() {
        try {

            List<ProductPromotion> promotions = productPromotionService.getAllProductPromotions();

            return new ResponseEntity<>(
                    new ApiResponse<>(true, "Successfully retrieved product promotions", promotions),
                    HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "Failed to retrieve product promotions: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ProductPromotion>> createAdminPromotion(@RequestBody @Valid CreateProductPromotionRequest bodyRequest) {
        try {
            
            ProductPromotion createdPromotion = productPromotionService.CreateNewPromotion(
                bodyRequest.getProductId(),
                bodyRequest.getPromotionName(),
                bodyRequest.getPrice(),
                bodyRequest.getDescription()
            );
            
            return new ResponseEntity<>(
                    new ApiResponse<>(true, "Successfully created product promotion", createdPromotion),
                    HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "Failed to create product promotion: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<ProductPromotion>> updateAdminPromotion(@RequestBody @Valid UpdateProductPromotionRequest bodyRequest) {
         try {

            productPromotionService.ActiveOrDeactivePromotion(
                bodyRequest.getPromotionId(),
                bodyRequest.getIsActive()
            );

            return new ResponseEntity<>(
                    new ApiResponse<>(true, "Successfully updated product promotion", null),
                    HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "Failed to update product promotion: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

class UpdateProductPromotionRequest {

    @NotNull()
    private Boolean isActive;

    @NotNull()
    private Integer promotionId;

    public Integer getPromotionId() {
        return promotionId;
    }

    public Boolean getIsActive() {
        return isActive;
    }
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}

class CreateProductPromotionRequest {
    
    @NotNull()
    private Long productId;
    
    @NotBlank()
    @JsonProperty("promotionName")
    private String promotionName;
    
    @NotNull()
    @Positive()
    private Integer price;
    
    @NotBlank()
    private String description;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getPromotionName() {
        return promotionName;
    }

    public void setPromotionName(String promotionName) {
        this.promotionName = promotionName;
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
}