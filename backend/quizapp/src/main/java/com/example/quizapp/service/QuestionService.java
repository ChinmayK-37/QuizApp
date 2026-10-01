package com.example.quizapp.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final DBTableService dbTableService;
    private final GeminiService geminiService;

    // ✅ Create table + generate + insert questions
    public void createQuizTableAndInsert(String tableName, String topic) {

    dbTableService.createTable(tableName);

    // ✅ Use dynamic topic
    Map<String, Object> quizData = geminiService.generateQuestions(topic);

    dbTableService.insertQuestions(tableName, quizData);
}

    // ✅ Fetch questions
    public List<Map<String, Object>> getQuestions(String tableName) {
        return dbTableService.getQuestions(tableName);
    }

    public Integer getCorrectAnswerIndex(String tableName, Long questionId) {
        return dbTableService.getCorrectAnswerIndex(tableName, questionId);
    }

    // ✅ Optional cleanup
    public void deleteQuizTable(String tableName) {
        dbTableService.deleteTable(tableName);
    }
}