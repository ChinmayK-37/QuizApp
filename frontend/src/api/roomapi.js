import { apiClient } from "./client";

export const roomapi = {
  createRoom: ({ hostId, hostName, maxPlayers, topic }) =>
    apiClient.post("/api/room/create", { hostId, hostName, maxPlayers, topic }),

  joinRoom: ({ roomId, userId, playerName }) =>
    apiClient.post("/api/room/join", { roomId, userId, playerName }),

  startQuiz: ({ roomId, userId }) =>
    apiClient.post("/api/room/start", { roomId, userId }),

  getPlayers: (roomId) => apiClient.get(`/api/room/${roomId}/players`),

  // optional: if backend exposes /api/room/{roomId}
  getRoom: (roomId) => apiClient.get(`/api/room/${roomId}`),

  getLeaderboard: (roomId) => apiClient.get(`/api/room/${roomId}/leaderboard`),

  finishQuiz: ({ roomId, userId }) =>
    apiClient.post("/api/quiz/finish", { roomId, userId }),
};

