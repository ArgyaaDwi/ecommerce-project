package com.design_pattern_ecommerce.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.design_pattern_ecommerce.backend.models.User;
import com.design_pattern_ecommerce.backend.services.UserService;
import com.design_pattern_ecommerce.backend.sse.SseConnectionManager;

@RestController
@RequestMapping("/promotion")
@CrossOrigin(origins = "*")
public class PromotionStreamController {

    @Autowired
    private UserService userService;

    @Autowired
    private SseConnectionManager sseConnectionManager;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> stream(@RequestParam("sessionKey") String sessionKey) {
        if (sessionKey == null || sessionKey.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        User user = userService.findBySessionKey(sessionKey);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        SseEmitter emitter = new SseEmitter(0L);
        sseConnectionManager.register(user.getId(), emitter);
        sseConnectionManager.send(user.getId(), "connected", "ok");

        return new ResponseEntity<>(emitter, HttpStatus.OK);
    }
}
