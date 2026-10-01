package com.example.quizapp.util;
import java.util.UUID;
public class RoomIdGenerator {
    public static String generate() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}