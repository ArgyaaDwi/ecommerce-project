package com.design_pattern_ecommerce.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.design_pattern_ecommerce.backend.models.ProductPromotion;

@RestController
@RequestMapping("/admin/promotion")
@CrossOrigin(origins = "*")
public class AdminProductPromotionController {

    @GetMapping("/list")
    public ResponseEntity<ApiResponse<List<ProductPromotion>>> getAllAdminPromotion() {
        try {

            return new ResponseEntity<>(
                    new ApiResponse<>(true, "Successfully retrieved product promotions", null),
                    HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "Failed to retrieve product promotions: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ProductPromotion>> createAdminPromotion() {
        try {

            return new ResponseEntity<>(
                    new ApiResponse<>(true, "Successfully created product promotion", null),
                    HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "Failed to create product promotion: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<ProductPromotion>> updateAdminPromotion() {
         try {

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
