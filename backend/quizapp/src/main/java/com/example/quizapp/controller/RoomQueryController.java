package com.example.quizapp.controller;

import com.example.quizapp.entity.Room;
import com.example.quizapp.repository.RoomRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(originPatterns = "*")
@RestController
@RequestMapping("/api/room")
@RequiredArgsConstructor
public class RoomQueryController {

    private final RoomRepository roomRepository;

    @GetMapping("/{roomId}")
    public Room getRoom(@PathVariable String roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }
}

