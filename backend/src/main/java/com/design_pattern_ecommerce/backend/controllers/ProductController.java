package com.design_pattern_ecommerce.backend.controllers;

import com.design_pattern_ecommerce.backend.annotations.RequireAuth;
import com.design_pattern_ecommerce.backend.models.Product;
import com.design_pattern_ecommerce.backend.models.ProductCategory;
import com.design_pattern_ecommerce.backend.models.ProductPromotion;
import com.design_pattern_ecommerce.backend.models.User;
import com.design_pattern_ecommerce.backend.models.UserPromotion;
import com.design_pattern_ecommerce.backend.repositories.ProductCategoryRepository;
import com.design_pattern_ecommerce.backend.services.ProductPromotionService;
import com.design_pattern_ecommerce.backend.services.ProductService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/product")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductPromotionService productPromotionService;
    @Autowired
    private ProductCategoryRepository productCategoryRepository;
    
    
    // get all product
    @GetMapping("/list")
    @RequireAuth
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts(HttpServletRequest request) {
        try {
            User user = (User) request.getAttribute("currentUser");

            List<Product> products = productService.getAllProducts();

            for (Product product : products) {
                Boolean isSubscribedPromotion = false;
                UserPromotion userPromotion = productPromotionService.getByProductIdAndUserId(user.getId(), product.getId());
                
                if (userPromotion != null) {
                    isSubscribedPromotion = true;
                }
                
                product.setIsSubscribedPromotion(isSubscribedPromotion);
            }

            return new ResponseEntity<>(
                new ApiResponse<>(true, "Products retrieved successfully", products),
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Failed to retrieve products: " + e.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GetMapping("/detail/{productId}")
    @RequireAuth
    public ResponseEntity<ApiResponse<ProductDetailResponse>> getProductById(@PathVariable Long productId, HttpServletRequest request) {
        try {
            User user = (User) request.getAttribute("currentUser");

            Product product = productService.getDetailProductById(productId);

            if (product == null) {
                return new ResponseEntity<>(
                    new ApiResponse<>(false, "Product not found", null),
                    HttpStatus.NOT_FOUND
                );
            }

            // check if subscribed
            Boolean isSubscribedPromotion = false; 
            UserPromotion userPromotion = productPromotionService.getByProductIdAndUserId(user.getId(), productId.intValue());

            if (userPromotion != null) {
                isSubscribedPromotion = true;
            }

            product.setIsSubscribedPromotion(isSubscribedPromotion);

            List<ProductPromotionResponse> promotions = new ArrayList<>();
            for (ProductPromotion promotion : product.getPromotions()) {
                promotions.add(new ProductPromotionResponse(
                    promotion.getId(),
                    promotion.getName(),
                    promotion.getPrice(),
                    promotion.getDescription(),
                    promotion.getIsActive(),
                    promotion.getCreatedAt()
                ));
            }

            ProductDetailResponse response = new ProductDetailResponse(product, promotions);

            return new ResponseEntity<>(
                new ApiResponse<>(true, "Product retrieved successfully", response),
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Failed to retrieve product: " + e.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // get product category
    @GetMapping("/category/list")
    @RequireAuth
    public ResponseEntity<ApiResponse<List<ProductCategory>>> getAllCategories() {
        try {
            List<ProductCategory> categories = productCategoryRepository.findAll();

            return new ResponseEntity<>(
                new ApiResponse<>(true, "Categories retrieved successfully", categories),
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Failed to retrieve categories: " + e.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // get product by category id
    @GetMapping("/category/{categoryId}")
    @RequireAuth
    public ResponseEntity<ApiResponse<List<Product>>> getProductsByCategoryId(@PathVariable Long categoryId) {
        try {
            List<Product> products = productService.getProductsByCategoryId(categoryId);

            if (products.isEmpty()) {
                return new ResponseEntity<>(
                    new ApiResponse<>(false, "No products found for category ID: " + categoryId, null),
                    HttpStatus.NOT_FOUND
                );
            }
            return new ResponseEntity<>(
                new ApiResponse<>(true, "Products retrieved successfully", products),
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Failed to retrieve products: " + e.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    @GetMapping("/recomendation")
    @RequireAuth
    public ResponseEntity<ApiResponse<List<Product>>> getUserProductRecomendations(HttpServletRequest request) {
        try {
            User user = (User) request.getAttribute("currentUser");
            
            List<Product> products = productService.getRecomendationProductByUserPreference(user.getId());

            return new ResponseEntity<>(
                new ApiResponse<>(true, "Products retrieved successfully", products),
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Failed to retrieve products: " + e.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

}

class ProductDetailResponse {
    private final Product product;
    private final List<ProductPromotionResponse> promotions;

    public ProductDetailResponse(Product product, List<ProductPromotionResponse> promotions) {
        this.product = product;
        this.promotions = promotions;
    }

    public Product getProduct() {
        return product;
    }

    public List<ProductPromotionResponse> getPromotions() {
        return promotions;
    }
}

class ProductPromotionResponse {
    private final int id;
    private final String name;
    private final Integer price;
    private final String description;
    private final Boolean isActive;
    private final java.time.LocalDateTime createdAt;

    public ProductPromotionResponse(
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