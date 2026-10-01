package com.example.quizapp.dto;

import lombok.Data;

@Data
public class SubmitAnswerRequest {
    private String roomId;
    private Long userId;
    private Long questionId;
    private Integer selectedIndex;
}

