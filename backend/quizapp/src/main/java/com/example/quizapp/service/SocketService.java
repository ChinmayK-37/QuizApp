package com.example.quizapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class SocketService {

    private final SimpMessagingTemplate messagingTemplate;

    // ✅ USER JOIN EVENT
    public void sendJoinEvent(String roomId, Long userId) {
    messagingTemplate.convertAndSend(
            "/topic/" + roomId,
            (Object) Map.of(
                    "event", "USER_JOINED",
                    "userId", userId
            )
    );
}

public void sendStartEvent(String roomId) {
    messagingTemplate.convertAndSend(
            "/topic/" + roomId,
            (Object) Map.of(
                    "event", "QUIZ_STARTED"
            )
    );
}
}