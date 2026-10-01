package com.example.quizapp.service;

import org.springframework.stereotype.Service;
import com.example.quizapp.repository.RoomRepository;
import com.example.quizapp.repository.RoomPlayerRepository;
import com.example.quizapp.entity.Room;
import com.example.quizapp.entity.RoomPlayer;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepo;
    private final RoomPlayerRepository playerRepo;

    private final QuestionService questionService;
    private final SocketService socketService;

    public Map<String, Object> createRoom(Long hostId, String hostName, int maxPlayers, String topic) {

        String roomId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String tableName = "quiz_" + roomId;

        questionService.createQuizTableAndInsert(tableName, topic);

        Room room = new Room();
        room.setRoomId(roomId);
        room.setHostId(hostId);
        room.setMaxPlayers(maxPlayers);
        room.setStatus("LOBBY");
        room.setQuestionTableName(tableName);
        room.setCreatedAt(LocalDateTime.now());

        roomRepo.save(room);

        RoomPlayer player = new RoomPlayer();
        player.setRoomId(roomId);
        player.setUserId(hostId);
        player.setPlayerName(hostName != null && !hostName.isBlank() ? hostName : "Host");
        player.setPlayerNumber(1);
        player.setScore(0);
        player.setJoinedAt(LocalDateTime.now());

        playerRepo.save(player);

        return Map.of(
                "roomId", roomId,
                "playerNumber", 1
        );
    }

    public Map<String, Object> joinRoom(String roomId, Long userId, String playerName) {

        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getStatus().equals("LOBBY"))
            throw new RuntimeException("Quiz already started");

        int count = playerRepo.countByRoomId(roomId);
        if (count >= room.getMaxPlayers())
            throw new RuntimeException("Room full");

        if (playerRepo.existsByRoomIdAndUserId(roomId, userId))
            throw new RuntimeException("User already joined");

        int playerNumber = count + 1;

        RoomPlayer player = new RoomPlayer();
        player.setRoomId(roomId);
        player.setUserId(userId);
        player.setPlayerName(playerName != null && !playerName.isBlank() ? playerName : "Player");
        player.setPlayerNumber(playerNumber);
        player.setScore(0);
        player.setJoinedAt(LocalDateTime.now());

        playerRepo.save(player);

        socketService.sendJoinEvent(roomId, userId);

        return Map.of(
                "playerNumber", playerNumber
        );
    }

    public void startQuiz(String roomId, Long userId) {

        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getHostId().equals(userId))
            throw new RuntimeException("Only host can start");

        room.setStatus("STARTED");
        room.setStartedAt(LocalDateTime.now()); // ← record quiz start time
        roomRepo.save(room);

        socketService.sendStartEvent(roomId);
    }

    public List<?> getQuestionsForRoom(String roomId) {

        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        String tableName = room.getQuestionTableName();

        return questionService.getQuestions(tableName);
    }

    public List<RoomPlayer> getPlayers(String roomId) {
        return playerRepo.findByRoomId(roomId).stream()
                .sorted(Comparator.comparing(p -> p.getPlayerNumber() == null ? Integer.MAX_VALUE : p.getPlayerNumber()))
                .collect(Collectors.toList());
    }

    /**
     * Mark a player as finished. Idempotent — won't overwrite an existing
     * finishedAt timestamp so refresh / double-submit is safe.
     */
    public void finishQuiz(String roomId, Long userId) {
        RoomPlayer player = playerRepo.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new RuntimeException("Player not found in room"));

        if (player.getFinishedAt() == null) {
            player.setFinishedAt(LocalDateTime.now());
            playerRepo.save(player);
        }
    }

    /**
     * Returns leaderboard entries for all non-host players, sorted by:
     *  1. Finished players first
     *  2. Score descending
     *  3. Time taken ascending (faster = better)
     */
    public List<com.example.quizapp.dto.LeaderboardEntry> getLeaderboard(String roomId) {
        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Long hostId = room.getHostId();
        LocalDateTime startedAt = room.getStartedAt();

        return getPlayers(roomId).stream()
                .filter(p -> hostId == null || !hostId.equals(p.getUserId()))
                .map(p -> {
                    boolean finished = p.getFinishedAt() != null;
                    Long timeTakenSeconds = null;
                    if (finished && startedAt != null) {
                        timeTakenSeconds = Duration.between(startedAt, p.getFinishedAt()).getSeconds();
                    }
                    return new com.example.quizapp.dto.LeaderboardEntry(
                            p.getUserId(),
                            p.getPlayerName(),
                            p.getScore() == null ? 0 : p.getScore(),
                            finished,
                            timeTakenSeconds
                    );
                })
                .sorted((a, b) -> {
                    // Finished players ranked first
                    if (a.isFinished() != b.isFinished()) return a.isFinished() ? -1 : 1;
                    // Then by score descending
                    int scoreDiff = (b.getScore() == null ? 0 : b.getScore())
                                  - (a.getScore() == null ? 0 : a.getScore());
                    if (scoreDiff != 0) return scoreDiff;
                    // Then by time taken ascending (faster wins), nulls last
                    if (a.getTimeTakenSeconds() == null && b.getTimeTakenSeconds() == null) return 0;
                    if (a.getTimeTakenSeconds() == null) return 1;
                    if (b.getTimeTakenSeconds() == null) return -1;
                    return Long.compare(a.getTimeTakenSeconds(), b.getTimeTakenSeconds());
                })
                .collect(Collectors.toList());
    }

    public Map<String, Object> submitAnswer(String roomId, Long userId, Long questionId, Integer selectedIndex) {
        if (selectedIndex == null || selectedIndex < 0 || selectedIndex > 3) {
            throw new IllegalArgumentException("Invalid selectedIndex");
        }
        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        String tableName = room.getQuestionTableName();
        Integer correctIndex = questionService.getCorrectAnswerIndex(tableName, questionId);

        RoomPlayer player = playerRepo.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new RuntimeException("Player not found in room"));

        int prev = player.getScore() == null ? 0 : player.getScore();
        boolean correct = correctIndex != null && correctIndex.equals(selectedIndex);
        if (correct) {
            player.setScore(prev + 1);
            playerRepo.save(player);
        }

        return Map.of(
                "correct", correct,
                "correctAnswerIndex", correctIndex,
                "score", player.getScore() == null ? prev : player.getScore()
        );
    }
}