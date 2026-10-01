package com.example.quizapp.controller;

import com.example.quizapp.dto.FinishRequest;
import com.example.quizapp.dto.SubmitAnswerRequest;
import com.example.quizapp.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@CrossOrigin(originPatterns = "*")
@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class AnswerController {

    private final RoomService roomService;

    @PostMapping("/answer")
    public Map<String, Object> submit(@RequestBody SubmitAnswerRequest req) {
        return roomService.submitAnswer(req.getRoomId(), req.getUserId(), req.getQuestionId(), req.getSelectedIndex());
    }

    /**
     * Called when the player submits their last answer.
     * Records finishedAt so the leaderboard can calculate time taken.
     * Idempotent — safe to call on refresh.
     */
    @PostMapping("/finish")
    public ResponseEntity<Void> finish(@RequestBody FinishRequest req) {
        roomService.finishQuiz(req.getRoomId(), req.getUserId());
        return ResponseEntity.ok().build();
    }
}
