package com.example.quizapp.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class JsontoStringService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> toJSON(String text) {
        try {
            // 1. Clean the text: Remove markdown code blocks if Gemini accidentally adds them
            String cleanJson = text.replaceAll("```json|```", "").trim();

            // 2. Convert the cleaned String into a Map
            return objectMapper.readValue(cleanJson, new TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            // In a real app, you'd log this and perhaps retry the AI call
            throw new RuntimeException("Failed to parse Gemini response into JSON: " + e.getMessage());
        }
    }

    public String refinePrompt(String prompt) {
        return "Act as an expert Quiz Generator. Create a high-quality quiz based on the following topic: " + prompt + ". " +
               "Return the response strictly in JSON format. Do not include any markdown formatting like ```json or any introductory text. " +
               "The JSON structure must exactly match this schema: " +
               "{ \"quizTitle\": \"string\", \"difficulty\": \"string\", \"questions\": [ " +
               "{ \"id\": number, \"question\": \"string\", \"options\": [\"string\", \"string\", \"string\", \"string\"], " +
               "\"correctAnswerIndex\": number } ] }. " +
               "Ensure the distractors (wrong answers) are plausible";
    }
}