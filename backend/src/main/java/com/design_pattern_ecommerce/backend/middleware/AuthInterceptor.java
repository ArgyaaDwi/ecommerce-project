package com.design_pattern_ecommerce.backend.middleware;

import com.design_pattern_ecommerce.backend.services.UserService;
import com.design_pattern_ecommerce.backend.models.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.stereotype.Component;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private UserService userService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, 
                           Object handler) throws Exception {
        
        // Extract Authorization header
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || authHeader.isEmpty()) {
            // Boleh bypass jika endpoint tidak require auth
            return true;
        }

        try {
            // Extract session key dari "Bearer <session-key>"
            String sessionKey = userService.extractSessionKey(authHeader);
            
            if (sessionKey == null || sessionKey.isEmpty()) {
                return true; // Invalid format, biarkan controller handle
            }

            // Find user by session key
            User user = userService.findBySessionKey(sessionKey);
            
            if (user != null) {
                // Simpan user di request attribute untuk diakses di controller
                request.setAttribute("currentUser", user);
            }
        } catch (Exception e) {
            // Ignore, biarkan controller handle error
        }

        return true;
    }
}