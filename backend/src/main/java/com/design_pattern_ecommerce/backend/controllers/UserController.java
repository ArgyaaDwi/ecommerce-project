package com.design_pattern_ecommerce.backend.controllers;

import com.design_pattern_ecommerce.backend.annotations.RequireAuth;
import com.design_pattern_ecommerce.backend.models.User;
import com.design_pattern_ecommerce.backend.models.UserPreference;
import com.design_pattern_ecommerce.backend.services.UserPreferenceService;
import com.design_pattern_ecommerce.backend.services.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.List;

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

    @Autowired
    private UserPreferenceService userPreferenceService;

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
     *   "categoryIds": [1, 2, 3]
     * }
     */
    @PostMapping("/preference/update")
    @RequireAuth
    public ResponseEntity<ApiResponse<User>> setUserPreference(@RequestBody @Valid SetUserPreferenceRequest request, HttpServletRequest httpRequest) {
        try {
            User user = (User) httpRequest.getAttribute("currentUser");

            User updatedUser = userPreferenceService.setUserProductCategoryPreference(user.getId(), request.getCategoryIds());

            return new ResponseEntity<>(
                new ApiResponse<>(true, "User preference updated successfully", updatedUser),
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Failed to set user preference: " + e.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @GetMapping("/preference/detail")
    @RequireAuth
    public ResponseEntity<ApiResponse<List<UserPreference>>> getUserPreferenceDetail(HttpServletRequest httpRequest) {

        try {
            User user = (User) httpRequest.getAttribute("currentUser");
            List<UserPreference> preferences = userPreferenceService.getUserPreferencesByUserId(user.getId());

            return new ResponseEntity<>(
                new ApiResponse<>(true, "User preference retrieved successfully", preferences),
                HttpStatus.OK
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Failed to get user preference: " + e.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    
}

class SetUserPreferenceRequest {
    private List<Integer> categoryIds;

    public SetUserPreferenceRequest() {
    }

    public List<Integer> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(List<Integer> categoryIds) {
        this.categoryIds = categoryIds;
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

