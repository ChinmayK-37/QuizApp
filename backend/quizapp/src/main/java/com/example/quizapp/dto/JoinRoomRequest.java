package com.example.quizapp.dto;
import lombok.Data;
@Data
public class JoinRoomRequest {
private String roomId;
private Long userId;
private String playerName;
}
