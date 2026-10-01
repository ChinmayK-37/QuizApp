package com.example.quizapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardEntry {
    private Long userId;
    private String playerName;
    private Integer score;
    private boolean finished;
    private Long timeTakenSeconds; // null if still playing
}
