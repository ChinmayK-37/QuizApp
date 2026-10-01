package com.example.quizapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class DBTableService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ✅ FIX: Use tableName directly (from RoomService)
    public void createTable(String tableName) {

        String sql = "CREATE TABLE " + tableName + " (" +
                "id SERIAL PRIMARY KEY, " +
                "question_text TEXT, " +
                "option_1 TEXT, " +
                "option_2 TEXT, " +
                "option_3 TEXT, " +
                "option_4 TEXT, " +
                "correct_answer INT" +
                ");";

        jdbcTemplate.execute(sql);
        System.out.println("Table created: " + tableName);
    }

    // ✅ FIXED INSERT
    public void insertQuestions(String tableName, Map<String, Object> quizData) {

        List<Map<String, Object>> questions =
                (List<Map<String, Object>>) quizData.get("questions");

        for (Map<String, Object> q : questions) {

            List<String> options = (List<String>) q.get("options");

            // ❌ DO NOT return → just skip bad data
            if (options == null || options.size() < 4) {
                continue;
            }

            String sql = "INSERT INTO " + tableName +
                    " (question_text, option_1, option_2, option_3, option_4, correct_answer) " +
                    "VALUES (?, ?, ?, ?, ?, ?)";

            jdbcTemplate.update(sql,
                    q.get("question"),
                    options.get(0),
                    options.get(1),
                    options.get(2),
                    options.get(3),
                    q.get("correctAnswerIndex")
            );
        }

        System.out.println("Questions inserted into " + tableName);
    }

    // ✅ ADD THIS (VERY IMPORTANT)
    public List<Map<String, Object>> getQuestions(String tableName) {
        String sql = "SELECT * FROM " + tableName;
        return jdbcTemplate.queryForList(sql);
    }

    public Integer getCorrectAnswerIndex(String tableName, Long questionId) {
        String sql = "SELECT correct_answer FROM " + tableName + " WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, questionId);
    }

    // ✅ OPTIONAL CLEANUP
    public void deleteTable(String tableName) {
        String sql = "DROP TABLE IF EXISTS " + tableName;
        jdbcTemplate.execute(sql);
    }
}