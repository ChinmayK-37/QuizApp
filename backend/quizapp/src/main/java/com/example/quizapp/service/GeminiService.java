package com.example.quizapp.service;

import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    private final Client client;
    private final JsontoStringService jsonService;

    // ✅ MAIN METHOD USED BY YOUR SYSTEM
    public Map<String, Object> generateQuestions(String topic) {

        // 1. Refine prompt using your service
        String prompt = jsonService.refinePrompt(topic);

        try {
            // 2. Call Gemini API
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.5-flash-lite",
                    prompt,
                    null
            );

            String rawText = response.text();

            // 3. Convert raw text → JSON Map
            return jsonService.toJSON(rawText);

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate quiz from Gemini", e);
        }
    }
}