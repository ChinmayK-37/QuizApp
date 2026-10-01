package com.example.quizapp.dto;

import lombok.Data;

@Data
public class CreateRoomRequest {
    private Long hostId;
    private int maxPlayers;
    private String topic;
    private String hostName;
}