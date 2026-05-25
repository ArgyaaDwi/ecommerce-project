package com.design_pattern_ecommerce.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.design_pattern_ecommerce.backend.annotations.RequireAuth;
import com.design_pattern_ecommerce.backend.models.ProductPromotion;
import com.design_pattern_ecommerce.backend.models.User;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/promotion")
@CrossOrigin(origins = "*")
public class ProductPromotionController {

    @GetMapping("/list")
    @RequireAuth
    public ResponseEntity<ApiResponse<ProductPromotion>> getUserPromotion(HttpServletRequest request) {
        try {

            User user = (User) request.getAttribute("currentUser");

            return new ResponseEntity<>(
                    new ApiResponse<>(true, "Successfully retrieved product promotions", null),
                    HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "Failed to retrieve product promotions: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping("/subscribe")
    @RequireAuth
    public ResponseEntity<ApiResponse<ProductPromotion>> subscribeToPromotion(HttpServletRequest request) {
        try {
            User user = (User) request.getAttribute("currentUser");

            return new ResponseEntity<>(
                    new ApiResponse<>(true, "Successfully subscribed to product promotion", null),
                    HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "Failed to subscribe to product promotion: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PutMapping("/unsubscribe")
    @RequireAuth
    public ResponseEntity<ApiResponse<ProductPromotion>> unsubscribeFromPromotion(HttpServletRequest request) {
        try {
            User user = (User) request.getAttribute("currentUser");
            return new ResponseEntity<>(
                    new ApiResponse<>(true, "Successfully unsubscribed from product promotion", null),
                    HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ApiResponse<>(false, "Failed to unsubscribe from product promotion: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
