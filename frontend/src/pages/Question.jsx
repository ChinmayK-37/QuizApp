import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import QuizQuestionCard from "../components/QuizQuestionCard";
import { gs } from "../global_styles/GameStyles";
import { quizapi } from "../api/quizapi";
import { getSession } from "../state/session";
import { roomapi } from "../api/roomapi";
import Leaderboard from "../components/Leaderboard";

/* ── Loader ──────────────────────────────────────────────────────────── */
const Loader = () => (
  <div className="flex flex-col items-center justify-center gap-5 py-16">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-[#1e1e40]" />
      <div
        className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-400"
        style={{ animation: "spin 0.9s linear infinite" }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xl">✨</span>
    </div>
    <p
      className="font-['Russo_One'] text-sm tracking-widest text-white/50 uppercase"
      style={{ fontFamily: "'Russo One', sans-serif" }}
    >
      Loading Quiz…
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ── Main ────────────────────────────────────────────────────────────── */
const Question = () => {
  const [phase, setPhase] = useState("loading"); // loading | playing | done
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const location  = useLocation();
  const navigate  = useNavigate();
  const session   = useMemo(() => getSession(), []);

  const roomId = (location.state?.roomId || session.roomId || "").toUpperCase();

  // sessionStorage key for persisting player progress across refreshes
  const PROGRESS_KEY = roomId ? `quiz.progress.v2.${roomId}.${session.userId}` : null;

  // Ref to avoid calling finishQuiz more than once per session
  const finishCalled = useRef(false);

  /* ── Load questions (players only) ── */
  useEffect(() => {
    if (!roomId || session.isHost) return;

    const load = async () => {
      try {
        setPhase("loading");
        const qs = await quizapi.getQuestionsForRoom(roomId);
        setQuestions(qs);

        // Restore progress from sessionStorage to survive refreshes
        const saved = PROGRESS_KEY
          ? JSON.parse(sessionStorage.getItem(PROGRESS_KEY) || "null")
          : null;

        if (saved?.phase === "done") {
          // Player already finished — go straight to results, no restart
          setScore(saved.score || 0);
          setIdx(qs.length > 0 ? qs.length - 1 : 0);
          setPhase("done");
          return;
        }

        const restoredIdx   = saved?.idx   ?? 0;
        const restoredScore = saved?.score ?? 0;
        setIdx(restoredIdx);
        setScore(restoredScore);
        setSelectedIndex(null);
        setPhase("playing");
      } catch (e) {
        alert(e?.message || "Failed to load questions");
        setPhase("done");
      }
    };

    load();
    // intentionally only runs once on mount (roomId stable after first render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  /* ── Persist progress to sessionStorage ── */
  useEffect(() => {
    if (!PROGRESS_KEY || phase === "loading") return;
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify({ idx, score, phase }));
  }, [idx, score, phase, PROGRESS_KEY]);

  /* ── Poll leaderboard (host + player's done screen) ── */
  useEffect(() => {
    // Host polls live; player polls once they're done so they can watch others finish
    if (!roomId || (!session.isHost && phase !== "done")) return;

    let cancelled = false;
    const load = async () => {
      try {
        const data = await roomapi.getLeaderboard(roomId);
        if (!cancelled) setLeaderboard(data || []);
      } catch {
        // ignore transient errors
      }
    };
    load();
    const t = setInterval(load, 1500);
    return () => { cancelled = true; clearInterval(t); };
  }, [roomId, session.isHost, phase]);

  /* ── Host view: full-screen live leaderboard ── */
  if (session.isHost) {
    return (
      <div className={gs.page} style={{ fontFamily: "'Nunito', sans-serif" }}>
        <Navbar playerName={session.playerName || "Host"} />
        <div className="mt-[80px] min-h-[calc(100vh-60px)] flex flex-col items-center px-4 py-12 gap-6 w-full">

          <div className="w-full max-w-4xl flex items-center justify-between gap-3">
            <div className="text-[0.7rem] font-extrabold tracking-widest uppercase text-white/35">
              Room <span className="text-yellow-400/80">{roomId}</span>
            </div>
            <div className="text-[0.7rem] font-extrabold tracking-widest uppercase text-white/35">
              Live Leaderboard
            </div>
          </div>

          <div className="w-full max-w-4xl">
            <Leaderboard
              title="Live Leaderboard"
              entries={leaderboard}
              currentUserId={session.userId}
              hostName={session.playerName || "Host"}
              pageSize={12}
            />
          </div>

          <div className="w-full max-w-4xl flex justify-center pt-2">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-3 rounded-xl font-['Russo_One'] text-xs tracking-widest bg-[#13132b] border-2 border-[#1e1e40] text-white/80 hover:border-yellow-400/50 transition-all duration-150"
              style={{ fontFamily: "'Russo One', sans-serif" }}
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Submit handler ── */
  const handleNext = async () => {
    if (!q || selectedIndex === null || submitting) return;
    setSubmitting(true);
    try {
      const res = await quizapi.submitAnswer({
        roomId,
        userId: session.userId,
        questionId: q.id,
        selectedIndex,
      });
      if (typeof res?.score === "number") setScore(res.score);
    } catch (e) {
      alert(e?.message || "Failed to submit answer");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);

    const isLastQuestion = idx + 1 >= questions.length;
    if (isLastQuestion) {
      // Record finish time on backend (idempotent — safe on double-click / refresh)
      if (!finishCalled.current) {
        finishCalled.current = true;
        try {
          await roomapi.finishQuiz({ roomId, userId: session.userId });
        } catch {
          // Don't block the UI if this fails
        }
      }
      setPhase("done");
      return;
    }

    setIdx((i) => i + 1);
    setSelectedIndex(null);
  };

  const q = questions[idx];

  return (
    <div className={gs.page} style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar playerName={session.playerName || "Player"} />

      <div className="mt-[80px] min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-12 gap-6">

        {/* Loading */}
        {phase === "loading" && <Loader />}

        {/* Playing */}
        {phase === "playing" && q && (
          <>
            <div className="w-full max-w-3xl flex items-center justify-between gap-3">
              <div className="text-lg font-extrabold tracking-widest uppercase text-white/35">
                Room <span className="text-yellow-400/80">{roomId}</span>
              </div>
              <div className="text-lg font-extrabold tracking-widest uppercase text-white/35">
                Score: <span className="text-emerald-400/80">{score}</span>
                <span className="text-white/20 text-base">/{questions.length}</span>
              </div>
            </div>

            <div className="w-full max-w-3xl">
              <QuizQuestionCard
                key={q.id}
                q={q}
                index={idx}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                disabled={false}
              />
            </div>

            <div className="w-full max-w-3xl flex justify-between items-center">
              <span className="text-[0.65rem] font-extrabold tracking-widest uppercase text-white/25">
                Question {idx + 1} of {questions.length}
              </span>
              <button
                disabled={selectedIndex === null || submitting}
                onClick={handleNext}
                className="px-6 py-3 rounded-xl font-['Russo_One'] tracking-widest bg-yellow-400 text-[#090917] hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 text-lg"
                style={{ fontFamily: "'Russo One', sans-serif" }}
              >
                {submitting
                  ? "SAVING…"
                  : idx + 1 >= questions.length
                  ? "FINISH ▶"
                  : "NEXT ▶"}
              </button>
            </div>
          </>
        )}

        {phase === "playing" && !q && (
          <p className="text-white/40 text-center">No questions found for this room.</p>
        )}

        {/* Done */}
        {phase === "done" && (
          <div className="w-full max-w-4xl flex flex-col gap-5">

            {/* Score card */}
            <div className="bg-[#0f0f24] border-2 border-[#1e1e40] rounded-2xl p-6 flex flex-col gap-3 items-center text-center">
              <span className={gs.chip}>🏁 Quiz Complete</span>
              <h2
                className="font-['Russo_One'] text-2xl text-white tracking-wide"
                style={{ fontFamily: "'Russo One', sans-serif" }}
              >
                Your Score:{" "}
                <span className="text-emerald-400">{score}</span>
                <span className="text-white/25 text-xl">/{questions.length}</span>
              </h2>
              <p className="text-base font-bold text-white/35">
                {roomId ? `Room ${roomId}` : "Missing room info."}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    if (PROGRESS_KEY) sessionStorage.removeItem(PROGRESS_KEY);
                    navigate("/");
                  }}
                  className="px-5 py-3 rounded-xl font-['Russo_One'] text-xs tracking-widest bg-[#13132b] border-2 border-[#1e1e40] text-white/80 hover:border-yellow-400/50 transition-all duration-150"
                  style={{ fontFamily: "'Russo One', sans-serif" }}
                >
                  BACK TO HOME
                </button>
              </div>
            </div>

            {/* Live final leaderboard — polls so the player can watch others finish */}
            {roomId && (
              <Leaderboard
                title="Final Leaderboard"
                entries={leaderboard}
                currentUserId={session.userId}
                totalQuestions={questions.length || undefined}
                pageSize={10}
              />
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default Question;