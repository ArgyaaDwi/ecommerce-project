package com.design_pattern_ecommerce.backend.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.design_pattern_ecommerce.backend.models.Product;
import com.design_pattern_ecommerce.backend.models.ProductPromotion;
import com.design_pattern_ecommerce.backend.services.ProductService;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/admin/product")
@CrossOrigin(origins = "*")
public class AdminProductController {
    
    @Autowired
    private ProductService productService;

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<Product>>> listProducts() {
        try {
            List<Product> products = productService.getAllProducts();

            return ResponseEntity.ok(new ApiResponse<>(true, "Successfully retrieved products", products));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to retrieve products: " + e.getMessage(), null));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody @Valid ProductRequest bodyRequest) {
        try {

            Product product = productService.createProduct(
                bodyRequest.getName(),
                bodyRequest.getDescription(),
                bodyRequest.getPrice().intValue(),
                bodyRequest.getCategoryId(),
                bodyRequest.getImageUrl()
            );

            return ResponseEntity.ok(new ApiResponse<>(true, "Product created successfully", product));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to create product: " + e.getMessage(), null));
        }
    }

    @GetMapping("/detail/{productId}")
    public ResponseEntity<ApiResponse<ProductDetailAdminResponse>> getProductDetails(@PathVariable Long productId) {
        try {
            Product product = productService.getDetailProductById(productId);

            if (product == null) {
                return ResponseEntity.status(404).body(new ApiResponse<>(false, "Product not found", null));
            }

            List<ProductPromotionAdminResponse> promotions = new ArrayList<>();
            for (ProductPromotion promotion : product.getPromotions()) {
                promotions.add(new ProductPromotionAdminResponse(
                    promotion.getId(),
                    promotion.getName(),
                    promotion.getPrice(),
                    promotion.getDescription(),
                    promotion.getIsActive(),
                    promotion.getCreatedAt()
                ));
            }

            ProductDetailAdminResponse response = new ProductDetailAdminResponse(product, promotions);

            return ResponseEntity.ok(new ApiResponse<>(true, "Product details retrieved successfully", response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to retrieve product details: " + e.getMessage(), null));
        }
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Long productId, @RequestBody @Valid ProductRequest bodyRequest) {
        try {
            Product product = productService.updateProduct(
                productId,
                bodyRequest.getName(),
                bodyRequest.getDescription(),
                bodyRequest.getPrice().intValue(),
                bodyRequest.getCategoryId(),
                bodyRequest.getImageUrl()
            );

            return ResponseEntity.ok(new ApiResponse<>(true, "Product updated successfully", product));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to update product: " + e.getMessage(), null));
        }
    }

}


class ProductRequest {
    @NotBlank
    @JsonProperty("name")
    private String name;

    @NotNull
    @Positive
    @JsonProperty("price")
    private Double price;

    @NotBlank
    @JsonProperty("description")
    private String description;

    @NotNull
    @JsonProperty("categoryId")
    private Integer categoryId;

    @NotBlank
    @JsonProperty("imageUrl")
    private String imageUrl;

    public String getName() {
        return name;
    }

    public Double getPrice() {
        return price;
    }

    public String getDescription() {
        return description;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

}

class ProductDetailAdminResponse {
    private final Product product;
    private final List<ProductPromotionAdminResponse> promotions;

    public ProductDetailAdminResponse(Product product, List<ProductPromotionAdminResponse> promotions) {
        this.product = product;
        this.promotions = promotions;
    }

    public Product getProduct() {
        return product;
    }

    public List<ProductPromotionAdminResponse> getPromotions() {
        return promotions;
    }
}

class ProductPromotionAdminResponse {
    private final int id;
    private final String name;
    private final Integer price;
    private final String description;
    private final Boolean isActive;
    private final java.time.LocalDateTime createdAt;

    public ProductPromotionAdminResponse(
        int id,
        String name,
        Integer price,
        String description,
        Boolean isActive,
        java.time.LocalDateTime createdAt
    ) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getPrice() {
        return price;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }
}