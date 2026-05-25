package com.design_pattern_ecommerce.backend.middleware;

import com.design_pattern_ecommerce.backend.controllers.ApiResponse;
import com.design_pattern_ecommerce.backend.models.User;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@Aspect
public class AuthAspect {

    @Autowired
    private com.design_pattern_ecommerce.backend.services.UserService userService;

    @Around("@annotation(com.design_pattern_ecommerce.backend.annotations.RequireAuth)")
    public Object handleAuth(ProceedingJoinPoint joinPoint) throws Throwable {
        
        // Get current request
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "No request context", null),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        HttpServletRequest request = attributes.getRequest();
        String authHeader = request.getHeader("Authorization");

        // 1. Check if header exists
        if (authHeader == null || authHeader.isEmpty()) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Authorization header is required", null),
                HttpStatus.UNAUTHORIZED
            );
        }

        // 2. Extract session key
        String sessionKey = userService.extractSessionKey(authHeader);
        if (sessionKey == null || sessionKey.isEmpty()) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Invalid Authorization header format. Use: Bearer <session-key>", null),
                HttpStatus.UNAUTHORIZED
            );
        }

        // 3. Find user
        User user = userService.findBySessionKey(sessionKey);
        if (user == null) {
            return new ResponseEntity<>(
                new ApiResponse<>(false, "Session not found or expired", null),
                HttpStatus.NOT_FOUND
            );
        }

        // 4. Store user di request untuk diakses di controller
        request.setAttribute("currentUser", user);

        // 5. Lanjut ke controller method
        return joinPoint.proceed();
    }
}