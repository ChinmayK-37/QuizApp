## Quiz WebApp (AI + Multiplayer Rooms)

This project is a **room-based quiz webapp**:
- A **host (creator)** creates a quiz room (questions are generated + stored on backend).
- Players join using the **room code**.
- Host starts the quiz.
- Players answer questions; backend stores their **scores**.
- Host sees a **live leaderboard** (host is not ranked).
- At the end, players see **final score + final ranking** (with pagination + top-3 highlighted).

## Tech Stack

### Backend
- **Spring Boot** (REST + WebSocket/STOMP)
- **PostgreSQL** (persistent storage)
- **JdbcTemplate** for dynamic per-room quiz tables
- **Spring Data JPA** for room + player entities
- **Gemini** (Google GenAI) for question generation

### Frontend
- **React (Vite)** + Tailwind
- Modular API clients in `frontend/src/api/`

## How the System Flow Works (End-to-End)

### 1) Create Quiz → Create Room (Host)
**Frontend**: `CreateQuiz` page

**Call**: `POST /api/room/create`

**Request body (example)**:
```json
{
  "hostId": 1712670000000,
  "hostName": "Alex",
  "maxPlayers": 8,
  "topic": "Java fundamentals"
}
```

**Backend path**
- `RoomController.createRoom(...)`
- `RoomService.createRoom(hostId, hostName, maxPlayers, topic)`
  - creates roomId (6 chars)
  - creates a dynamic quiz table named: `quiz_<ROOMID>`
  - generates questions using Gemini
  - inserts questions into that table
  - creates `Room` (status = `LOBBY`)
  - inserts host into `room_player` as:
    - `playerNumber = 1`
    - `score = 0`

**Response (example)**:
```json
{
  "message": "Room created successfully",
  "roomId": "6E2273",
  "playerNumber": 1
}
```

### 2) Join Room (Player)
**Frontend**: `JoinQuiz` page

**Call**: `POST /api/room/join`

**Request body (example)**:
```json
{
  "roomId": "6E2273",
  "userId": 1712670001234,
  "playerName": "Priya"
}
```

**Backend path**
- `RoomController.joinRoom(...)`
- `RoomService.joinRoom(roomId, userId, playerName)`
  - validates room exists + status is `LOBBY`
  - assigns `playerNumber = (currentCount + 1)`
  - inserts into `room_player` with `score = 0`
  - optionally emits websocket event via `SocketService.sendJoinEvent(...)`

**Response (example)**:
```json
{
  "message": "Joined successfully",
  "playerNumber": 2
}
```

### 3) Lobby (Players list)
**Frontend**: `Lobby` page

**Call**: `GET /api/room/{roomId}/players`

**Backend path**
- `RoomController.getPlayers(roomId)`
- `RoomService.getPlayers(roomId)` (sorted by `playerNumber`)

**What user sees**
- Player names are shown consistently as:
  - `(you) Alex #1` for current user
  - `Priya #2` for other players

### 4) Start Quiz (Host)
**Frontend**: Host clicks “Start Quiz”

**Call**: `POST /api/room/start`

**Request body (example)**:
```json
{
  "roomId": "6E2273",
  "userId": 1712670000000
}
```

**Backend path**
- `RoomController.startQuiz(...)`
- `RoomService.startQuiz(roomId, userId)`
  - validates only host can start
  - updates `room.status = STARTED`
  - optionally emits websocket event via `SocketService.sendStartEvent(...)`

**Player auto-start**
- The lobby checks room state using:
  - `GET /api/room/{roomId}`
  - if `status === "STARTED"` → navigates to quiz

### 5) Quiz Questions (Players)
**Frontend**: `Question` page (player view)

**Fetch questions**: `GET /api/quiz/{roomId}/questions`

**Backend path**
- `QuizController.getQuestions(roomId)`
- `RoomService.getQuestionsForRoom(roomId)`
- `QuestionService.getQuestions(tableName)`
- `DBTableService.getQuestions(tableName)` (returns rows from `quiz_<ROOMID>`)

**Answering rules**
- Player can change selection multiple times.
- Score is only applied when user taps **Next**.
- No option is selected by default.

### 6) Submit Answer → Live Score Stored (Players)
**Frontend call** (on Next): `POST /api/quiz/answer`

**Request body (example)**:
```json
{
  "roomId": "6E2273",
  "userId": 1712670001234,
  "questionId": 1,
  "selectedIndex": 2
}
```

**Backend path**
- `AnswerController.submit(...)`
- `RoomService.submitAnswer(roomId, userId, questionId, selectedIndex)`
  - reads the correct answer index from `quiz_<ROOMID>` using `JdbcTemplate`
  - updates `room_player.score` if correct
  - returns updated score

### 7) Live Leaderboard (Host view)
**Frontend**: Host sees leaderboard only (no questions).

**Call**: `GET /api/room/{roomId}/leaderboard`

**Backend path**
- `LeaderboardController.leaderboard(roomId)`
- `RoomService.getLeaderboard(roomId)`
  - sorts by score desc
  - **excludes the host from ranking**

### 8) Final Score + Ranking (Players)
At the end of the quiz, the player sees:
- their final score
- final leaderboard (same endpoint), with:
  - pagination for many players
  - top 3 highlighted (gold/silver/bronze)

## Database (What’s Stored Where)

### Static tables (JPA)
- **`room`**
  - `room_id`, `host_id`, `status`, `max_players`, `question_table_name`, `created_at`, `topic`
- **`room_player`**
  - `room_id`, `user_id`, `player_name`, `player_number`, `score`, `joined_at`

### Dynamic per-room quiz tables (JdbcTemplate)
- **`quiz_<ROOMID>`** (example: `quiz_6E2273`)
  - `id` (SERIAL)
  - `question_text`
  - `option_1..option_4`
  - `correct_answer` (0..3)

## Running Locally

### Backend (Spring Boot)
```bash
cd backend/quizapp
mvn -DskipTests package
java -jar target/quizapp-0.0.1-SNAPSHOT.jar
```

Backend runs at `http://localhost:8080`.

### Frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API Summary

### Room APIs
- `POST /api/room/create`
- `POST /api/room/join`
- `POST /api/room/start`
- `GET /api/room/{roomId}`
- `GET /api/room/{roomId}/players`
- `GET /api/room/{roomId}/leaderboard`

### Quiz APIs
- `GET /api/quiz/{roomId}/questions`
- `POST /api/quiz/answer`

### Gemini API (optional preview)
- `POST /api/gemini/generate`
