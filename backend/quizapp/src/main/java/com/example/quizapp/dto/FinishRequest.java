package com.example.quizapp.dto;

import lombok.Data;

@Data
public class FinishRequest {
    private String roomId;
    private Long userId;
}
