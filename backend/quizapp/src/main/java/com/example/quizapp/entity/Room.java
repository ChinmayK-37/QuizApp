package com.example.quizapp.entity;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
@Entity
@Data
public class Room {

    @Id
    private String roomId;

    private Long hostId;
    private int maxPlayers;
    private String status; 
    private String topic;
    private String questionTableName;  

    private LocalDateTime createdAt;
    private LocalDateTime startedAt;
}