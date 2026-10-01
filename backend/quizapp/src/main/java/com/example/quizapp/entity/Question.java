package com.example.quizapp.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Frontend-facing question model.
 *
 * Note: Questions are stored in per-room dynamic tables via JdbcTemplate,
 * so this class is intentionally NOT a JPA entity.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    
    private long id;

    private String question;

    private String options[];

    private int answer;

}
