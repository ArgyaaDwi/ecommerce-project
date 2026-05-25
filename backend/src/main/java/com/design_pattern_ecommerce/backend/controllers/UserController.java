package com.design_pattern_ecommerce.backend.controllers;

import com.design_pattern_ecommerce.backend.annotations.RequireAuth;
import com.design_pattern_ecommerce.backend.models.User;
import com.design_pattern_ecommerce.backend.services.UserService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Create new user session
     * POST /user/create_session
     * 
     * Request body:
     * {
     *   "name": "John Doe"
     * }
     * 
     * Response (201 Created):
     * {
     *   "success": true,
     *   "message": "User session created successfully",
     *   "data": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "sessionKey": "uuid-string",
     *     "createdAt": "2024-05-24T10:00:00"
     *   }
     * }
     */
    @PostMapping("/create_session")
    public ResponseEntity<ApiResponse<User>> createSession(@RequestBody CreateSessionRequest request) {
        try {
            // Validate input
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return new ResponseEntity<>(
                    new ApiResponse<>(false, "Name is required", null),
                    HttpStatus.BAD_REQUEST
                );
            }

            // Call service to create session
            User user = userService.createSession(request.getName());
            
            return new ResponseEntity<>(
                new ApiResponse<>(true, "User session created successfully", user),
                HttpStatus.CREATED
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Failed to create session: " + e.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Get user session by session key from Authorization header
     * GET /user/get_session
     * 
     * Header:
     * Authorization: Bearer <session-key>
     * 
     * Response (200 OK):
     * {
     *   "success": true,
     *   "message": "User retrieved successfully",
     *   "data": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "sessionKey": "uuid-string",
     *     "createdAt": "2024-05-24T10:00:00"
     *   }
     * }
     */
    @GetMapping("/get_session")
    @RequireAuth
    public ResponseEntity<ApiResponse<User>> getSession(HttpServletRequest request) {
        try {
            User user = (User) request.getAttribute("currentUser");

            return new ResponseEntity<>(
                new ApiResponse<>(true, "User retrieved successfully", user),
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Failed to retrieve session: " + e.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    

     /**
     * Create new user session
     * POST /user/create_session
     * 
     * Request body:
     * {
     *   "category_ids": [1, 2, 3]
     * }
     */
    @PostMapping("/set_preference")
    public ResponseEntity<ApiResponse<User>> setUserPreference(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Validate Authorization header
            if (authHeader == null || authHeader.isEmpty()) {
                return new ResponseEntity<>(
                    new ApiResponse<>(false, "Authorization header is required", null),
                    HttpStatus.UNAUTHORIZED
                );
            }

            // Extract session key from "Bearer <session-key>" format
            String sessionKey = userService.extractSessionKey(authHeader);
            
            if (sessionKey == null || sessionKey.isEmpty()) {
                return new ResponseEntity<>(
                    new ApiResponse<>(false, "Invalid Authorization header format. Use: Bearer <session-key>", null),
                    HttpStatus.UNAUTHORIZED
                );
            }

            // Find user by session key
            User user = userService.findBySessionKey(sessionKey);
            
            if (user == null) {
                return new ResponseEntity<>(
                    new ApiResponse<>(false, "Session not found or expired", null),
                    HttpStatus.NOT_FOUND
                );
            }

            return new ResponseEntity<>(
                new ApiResponse<>(true, "User preference updated successfully", user),
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Failed to set user preference: " + e.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

class CreateSessionRequest {
    private String name;

    public CreateSessionRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

