package com.example.quizapp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.quizapp.entity.RoomPlayer;
import java.util.List;
import java.util.Optional;
public interface RoomPlayerRepository extends JpaRepository<RoomPlayer, Long> {
    List<RoomPlayer> findByRoomId(String roomId);
    int countByRoomId(String roomId);
    boolean existsByRoomIdAndUserId(String roomId, Long userId);
    Optional<RoomPlayer> findByRoomIdAndUserId(String roomId, Long userId);
}