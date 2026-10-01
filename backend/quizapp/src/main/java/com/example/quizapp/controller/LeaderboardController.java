package com.example.quizapp.controller;

import com.example.quizapp.dto.LeaderboardEntry;
import com.example.quizapp.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(originPatterns = "*")
@RestController
@RequestMapping("/api/room")
@RequiredArgsConstructor
public class LeaderboardController {

    private final RoomService roomService;

    @GetMapping("/{roomId}/leaderboard")
    public List<LeaderboardEntry> leaderboard(@PathVariable String roomId) {
        return roomService.getLeaderboard(roomId);
    }
}

