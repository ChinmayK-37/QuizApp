package com.example.quizapp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.quizapp.dto.CreateRoomRequest;
import com.example.quizapp.dto.JoinRoomRequest;
import com.example.quizapp.dto.QuizStartRequest;
import com.example.quizapp.entity.RoomPlayer;
import com.example.quizapp.service.RoomService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(originPatterns = "*")
@RestController
@RequestMapping("/api/room")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    // ✅ Create Room
 @PostMapping("/create")
public Map<String, Object> createRoom(@RequestBody CreateRoomRequest request) {

    Map<String, Object> created = roomService.createRoom(
            request.getHostId(),
            request.getHostName(),
            request.getMaxPlayers(),
            request.getTopic()
    );

    return Map.of(
            "message", "Room created successfully",
            "roomId", created.get("roomId"),
            "playerNumber", created.get("playerNumber")
    );
}
    // ✅ Join Room
    @PostMapping("/join")
    public Map<String, Object> joinRoom(@RequestBody JoinRoomRequest request) {

        Map<String, Object> joined = roomService.joinRoom(
                request.getRoomId(),
                request.getUserId(),
                request.getPlayerName()
        );

        return Map.of(
                "message", "Joined successfully",
                "playerNumber", joined.get("playerNumber")
        );
    }

    // ✅ Start Quiz (Host Only)
    @PostMapping("/start")
    public Map<String, String> startQuiz(@RequestBody QuizStartRequest request) {

        roomService.startQuiz(
                request.getRoomId(),
                request.getUserId()
        );

        return Map.of(
                "message", "Quiz started"
        );
    }

    // ✅ Get Players in Room (Lobby)
    @GetMapping("/{roomId}/players")
    public List<RoomPlayer> getPlayers(@PathVariable String roomId) {
        return roomService.getPlayers(roomId);
    }

}