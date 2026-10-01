package com.example.quizapp.controller;
import org.springframework.web.bind.annotation.*;
import com.example.quizapp.service.GeminiService;
import lombok.RequiredArgsConstructor;
import java.util.Map;

@CrossOrigin(originPatterns = "*")
@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
public class GeminiController {

    private final GeminiService geminiService;

    // ✅ Generate questions based on topic
    @PostMapping("/generate")
    public Map<String, Object> generateQuestions(@RequestBody Map<String, String> request) {

        String topic = request.get("topic");

        if (topic == null || topic.isBlank()) {
            throw new RuntimeException("Topic is required");
        }

        return geminiService.generateQuestions(topic);
    }

    // ✅ Test endpoint (optional)
    @GetMapping("/test")
    public Map<String, String> test() {
        return Map.of(
                "message", "Gemini Controller is working");
    }
}