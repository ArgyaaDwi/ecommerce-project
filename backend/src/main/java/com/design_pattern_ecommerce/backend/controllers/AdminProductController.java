package com.design_pattern_ecommerce.backend.controllers;

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
    public ResponseEntity<ApiResponse<Product>> getProductDetails(@PathVariable Long productId) {
        try {
            Product product = productService.getProductById(productId);

            return ResponseEntity.ok(new ApiResponse<>(true, "Product details retrieved successfully", product));
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