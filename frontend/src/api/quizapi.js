import { apiClient } from "./client";

function mapDbQuestionRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    question: row.question_text,
    options: [row.option_1, row.option_2, row.option_3, row.option_4],
    correctAnswerIndex: row.correct_answer,
  };
}

export const quizapi = {
  // optional (preview-only)
  generateQuiz: (payload) => apiClient.post("/api/gemini/generate", payload),

  getQuestionsForRoom: async (roomId) => {
    const rows = await apiClient.get(`/api/quiz/${roomId}/questions`);
    return (rows || []).map(mapDbQuestionRow).filter(Boolean);
  },

  submitAnswer: ({ roomId, userId, questionId, selectedIndex }) =>
    apiClient.post("/api/quiz/answer", { roomId, userId, questionId, selectedIndex }),
};