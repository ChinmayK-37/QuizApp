package com.example.quizapp.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDateTime;
import lombok.Data;
@Entity
@Data
public class RoomPlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomId;
    private Long userId;

    private String playerName;
    private Integer playerNumber;
    private Integer score;

    private LocalDateTime joinedAt;
    private LocalDateTime finishedAt;
}