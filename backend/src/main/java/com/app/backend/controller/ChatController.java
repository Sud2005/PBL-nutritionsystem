package com.app.backend.controller;

import com.app.backend.service.ChatService;
import com.app.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping
    public ResponseEntity<?> getChatHistory(Authentication auth) {
        Long userId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        return ResponseEntity.ok(chatService.getHistory(userId));
    }

    @PostMapping("/message")
    public ResponseEntity<?> sendMessage(@RequestBody Map<String, String> payload, Authentication auth) {
        Long userId = ((CustomUserDetails) auth.getPrincipal()).getUser().getId();
        String message = payload.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message cannot be empty");
        }
        
        String reply = chatService.sendMessage(userId, message);
        Map<String, String> res = new HashMap<>();
        res.put("reply", reply);
        return ResponseEntity.ok(res);
    }
}
