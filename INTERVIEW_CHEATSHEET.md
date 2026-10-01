# QuizMe — Interview Cheat Sheet

## Elevator pitch

QuizMe is a room-based multiplayer quiz app. A host creates a quiz topic, the Spring Boot backend uses Gemini to generate questions, players join with a room code, the host starts the game, players submit answers, and a live leaderboard ranks non-host players by completion, score, and speed.

**Stack:** React 19 + Vite + Tailwind | Spring Boot 3.5 / Java 21 | PostgreSQL | Spring Data JPA + JdbcTemplate | Gemini SDK.

## Actual architecture

This is a **layered modular monolith**, not microservices.

```text
React SPA
  -> REST JSON APIs
Spring Boot controllers -> services -> JPA repositories / JdbcTemplate
  -> PostgreSQL
  -> Gemini API (question generation)
```

- **Controllers:** HTTP endpoints and request/response binding.
- **Services:** business rules, orchestration, scoring, Gemini calls.
- **Repositories:** JPA access for rooms and players.
- **JdbcTemplate:** creates and queries one dynamic question table per room.
- **React:** pages, browser-side session storage, and REST polling.

## Important user flow

1. Host uses `CreateQuiz.jsx` -> `POST /api/room/create`.
2. `RoomService.createRoom()` creates a six-character ID, creates `quiz_<ROOMID>`, generates Gemini questions, saves the room, and inserts the host as player #1.
3. Player uses `JoinQuiz.jsx` -> `POST /api/room/join`.
4. `Lobby.jsx` polls players every 2 seconds; players poll room status every 1.5 seconds.
5. Host starts -> `POST /api/room/start`; room status becomes `STARTED`.
6. Players fetch questions -> `GET /api/quiz/{roomId}/questions`.
7. Each answer -> `POST /api/quiz/answer`; backend checks the dynamic table and increments score if correct.
8. Finish -> `POST /api/quiz/finish`; leaderboard ranks players.

## Files to know

| File | Why it matters |
|---|---|
| `backend/.../service/RoomService.java` | Core business logic: create/join/start/answer/finish/leaderboard. |
| `backend/.../service/QuestionService.java` | Orchestrates table creation, Gemini generation, and question storage. |
| `backend/.../service/DBTableService.java` | Dynamic SQL and `JdbcTemplate` operations. |
| `backend/.../service/GeminiService.java` | Calls Gemini model `gemini-2.5-flash-lite`. |
| `backend/.../controller/RoomController.java` | Create/join/start/player REST APIs. |
| `backend/.../controller/AnswerController.java` | Answer and finish REST APIs. |
| `backend/.../entity/Room.java` | Room lifecycle and dynamic-table metadata. |
| `backend/.../entity/RoomPlayer.java` | Membership, score, and completion time. |
| `frontend/src/pages/CreateQuiz.jsx` | Host creates room and saves browser session. |
| `frontend/src/pages/Lobby.jsx` | Polling and host-start behavior. |
| `frontend/src/pages/Question.jsx` | Player answering flow and host leaderboard view. |
| `frontend/src/api/client.js` | Base HTTP client; backend is port 8080. |

## Database model

**PostgreSQL** is configured in `backend/quizapp/src/main/resources/application.properties`.

| Storage | Key fields | Purpose |
|---|---|---|
| `room` | `room_id` PK, `host_id`, `status`, `max_players`, `question_table_name`, timestamps | One quiz room. |
| `room_player` | generated `id` PK, `room_id`, `user_id`, `score`, `finished_at` | Room membership and leaderboard state. |
| `quiz_<ROOMID>` | `id SERIAL PRIMARY KEY`, question/options/correct answer | Questions for exactly one room. |

Key fact: `RoomPlayer.roomId` is a plain field; there is **no JPA relation or database foreign key** to `Room`.

## Key APIs

| Method | Endpoint | Service method |
|---|---|---|
| POST | `/api/room/create` | `RoomService.createRoom()` |
| POST | `/api/room/join` | `RoomService.joinRoom()` |
| POST | `/api/room/start` | `RoomService.startQuiz()` |
| GET | `/api/room/{roomId}` | direct `RoomRepository.findById()` |
| GET | `/api/room/{roomId}/players` | `RoomService.getPlayers()` |
| GET | `/api/room/{roomId}/leaderboard` | `RoomService.getLeaderboard()` |
| GET | `/api/quiz/{roomId}/questions` | `RoomService.getQuestionsForRoom()` |
| POST | `/api/quiz/answer` | `RoomService.submitAnswer()` |
| POST | `/api/quiz/finish` | `RoomService.finishQuiz()` |
| POST | `/api/gemini/generate` | `GeminiService.generateQuestions()` |

## Leaderboard rules

`RoomService.getLeaderboard()`:

1. Excludes the host.
2. Finished players rank before unfinished players.
3. Higher score ranks higher.
4. For equal scores, shorter completion time wins.

## Authentication and real-time behavior

- **No real authentication or RBAC exists.** There is no Spring Security, JWT, login endpoint, or session validation.
- Frontend creates `userId` with `Date.now()` and stores it in `localStorage` through `frontend/src/state/session.js`.
- The host-only rule compares request `userId` with `Room.hostId`; it is not secure authorization.
- The backend configures STOMP/SockJS and emits room events, but the React client does **not** subscribe. The UI actually uses REST polling.

## Strong interview observations / improvement points

1. **Answer leakage:** `/api/quiz/{roomId}/questions` returns `correct_answer`; a player can inspect it. Return a player-safe DTO without answers.
2. **Replay scoring bug:** no answer-attempt record or uniqueness check exists. Repeating a correct answer request can increase score.
3. **Race condition on joining:** count/check/insert are separate operations, so concurrent joins can exceed capacity or duplicate player numbers.
4. **Race condition on scoring:** score is read, incremented in Java, and saved; concurrent requests can lose updates.
5. **No cross-step transaction:** room creation performs DDL, Gemini call, inserts, and JPA saves. Failures can leave orphaned tables/partial data.
6. **Dynamic tables:** easy prototype isolation but hard schema management. Prefer normalized `quiz`, `question`, and `answer_attempt` tables with foreign keys/indexes.
7. **Security:** browser-generated IDs, permissive CORS, no authentication, and no rate limiting are development/prototype choices.
8. **Validation:** validation dependency exists, but DTOs do not use Bean Validation annotations or `@Valid`.
9. **Errors:** `ApiExceptionHandler` maps all `RuntimeException`s to 400; unexpected failures should be 500 and logged.
10. **Unused/incomplete code:** `QuizUser`, empty `QuestionRepository`, and `RoomIdGenerator` are not part of the active flow.
11. **UI fields not implemented end-to-end:** difficulty, number of questions, and quiz name are not persisted/used by question generation; max players is hardcoded to 8 in `CreateQuiz.jsx`.

## Technology choices

- **Spring Boot:** REST APIs, dependency injection, JPA integration.
- **JPA/Hibernate:** conventional persistence for `Room` and `RoomPlayer`.
- **JdbcTemplate:** direct SQL for runtime-created question tables.
- **PostgreSQL:** relational persistence and dynamic SQL tables.
- **Gemini:** topic-driven AI question generation.
- **React/Vite:** fast component-based SPA development.
- **Tailwind:** utility-first styling.

## Build and run

```powershell
# Backend
cd backend/quizapp
mvn package
java -jar target/quizapp-0.0.1-SNAPSHOT.jar

# Frontend
cd frontend
npm install
npm run dev
```

- Backend: `http://localhost:8080`
- Frontend: Vite default `http://localhost:5173`
- Requires local PostgreSQL database `QuizDb` and a Gemini API key loaded through `GeminiConfig`.
- No Docker, CI/CD workflow, cloud configuration, or database migration files are present.
- Verified locally: `mvn test` and `npm run lint` pass. The only backend test is a Spring context-load test.

## 60-second verbal answer

“QuizMe is a multiplayer, room-based quiz application built with React and Spring Boot. A host creates a quiz topic, and the backend calls Gemini to generate questions. It stores rooms and player scores in PostgreSQL using JPA, while questions are stored in a dynamic table per room using JdbcTemplate. Players join using a room code, the host starts the quiz, and players submit answers through REST APIs. The leaderboard excludes the host and ranks players by completion status, score, and completion time. The frontend currently uses polling for lobby and leaderboard updates, although the backend has unused STOMP/WebSocket support. The main production improvements would be authentication, normalized question tables, answer-attempt tracking, transactions, concurrency protection, and removing correct answers from player responses.”
