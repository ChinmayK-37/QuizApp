package com.example.quizapp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.quizapp.entity.Room;
public interface RoomRepository extends JpaRepository<Room, String> {
}