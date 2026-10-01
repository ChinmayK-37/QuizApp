package com.example.quizapp.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.quizapp.service.RoomService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(originPatterns = "*")
@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final RoomService roomService;

    
    @GetMapping("/{roomId}/questions")
    public List<?> getQuestions(@PathVariable String roomId) {
        return roomService.getQuestionsForRoom(roomId);
    }

    
    @GetMapping("/test")
    public String test() {
        return "Quiz Controller Working";
    }
}