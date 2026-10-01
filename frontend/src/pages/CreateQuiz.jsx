import { useState } from "react";
import Navbar from "../components/Navbar";
import { gs } from "../global_styles/GameStyles";
import { Link } from "react-router";
import QuestionCard from "../components/QuestionCard";
import { quizapi } from "../api/quizapi";
import { roomapi } from "../api/roomapi";
import { useNavigate } from "react-router";
import { setSession } from "../state/session";



/* ── Loader ─────────────────────────────────────────────────────── */
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
      Generating Quiz...
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ── Main Page ───────────────────────────────────────────────────── */
const CreateQuiz = () => {
  const [phase, setPhase] = useState("form"); // "form" | "loading" | "result"
  const [copied, setCopied] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    quizName: "",
    generatorName: "",
    topic: "",
    difficulty: "Medium",
    numQuestions: "10",
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleGenerate = async () => {
    if (!form.quizName || !form.topic || !form.generatorName) return;

    try {
      setPhase("loading");

      // backend create-room generates/stores quiz questions
      const hostId = Date.now();
      const maxPlayers = 8;

      const created = await roomapi.createRoom({
        hostId,
        hostName: form.generatorName,
        maxPlayers,
        topic: form.topic,
      });

      const newRoomId = created?.roomId?.toUpperCase?.() || "";
      setRoomId(newRoomId);

      setSession({
        roomId: newRoomId,
        isHost: true,
        userId: hostId,
        playerName: form.generatorName,
        playerNumber: created?.playerNumber ?? 1,
        quizName: form.quizName,
        topic: form.topic,
        difficulty: form.difficulty,
        numQuestions: Number(form.numQuestions),
      });

      const qs = newRoomId ? await quizapi.getQuestionsForRoom(newRoomId) : [];
      setQuestions(qs);
      setPhase("result");

    } catch (error) {
      console.error("Failed:", error);
      alert(error?.message || "Failed to create quiz room");
      setPhase("form");
    }
  };

  const handleCopy = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  /* shared input / select style */
  const inputCls = "w-full bg-[#13132b] border-2 border-[#1e1e40] rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/60 transition-colors duration-150";
  const labelCls = "block text-[0.65rem] font-extrabold tracking-[0.16em] uppercase text-white/40 mb-1.5";

  return (
    <div className={gs.page} style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      <main className="mt-[60px] min-h-[calc(100vh-60px)] flex flex-col items-center px-4 py-12 gap-8">

        {/* ════════════════════════════════════
            PHASE: FORM
        ════════════════════════════════════ */}
        {phase === "form" && (
          <div className="w-full max-w-lg flex flex-col gap-6 lg:min-w-[60vw]">

            {/* Page heading */}
            <div className="text-center">
              <span className={gs.chip}>✨ AI Quiz Builder</span>
              <h1
                className="font-['Russo_One'] text-3xl sm:text-4xl text-white tracking-wide mt-3"
                style={{ fontFamily: "'Russo One', sans-serif" }}
              >
                CREATE A <span className={gs.titleAccent}>QUIZ</span>
              </h1>
              <p className={`${gs.bodyMuted} text-xs mt-2`}>
                Fill in the details and let AI do the heavy lifting.
              </p>
            </div>

            {/* Form card */}
            <div className="bg-[#0f0f24] border-2 border-[#1e1e40] rounded-2xl p-6 sm:p-8 flex flex-col gap-5 ">

              <div className="flex flex-col gap-5 lg:flex-row lg:gap-4">
                {/* Quiz Name */}
                <div className="flex-1">
                  <label className={labelCls}>Quiz Name</label>
                  <input
                    name="quizName"
                    value={form.quizName}
                    onChange={handleChange}
                    placeholder="e.g. Science Showdown"
                    className={inputCls}
                  />
                </div>

                {/* Generator / Host Name */}
                <div className="flex-1">
                  <label className={labelCls}>Your Name (Host)</label>
                  <input
                    name="generatorName"
                    value={form.generatorName}
                    onChange={handleChange}
                    placeholder="e.g. Alex"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className={labelCls}>Quiz Topic / Prompt</label>
                <textarea
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  placeholder="e.g. World History, JavaScript, Space..."
                  className={inputCls}
                />
              </div>

              {/* Difficulty + Num Questions — side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Difficulty</label>
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className={`${inputCls} cursor-pointer`}
                    style={{ appearance: "none" }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>No. of Questions</label>
                  <select
                    name="numQuestions"
                    value={form.numQuestions}
                    onChange={handleChange}
                    className={`${inputCls} cursor-pointer`}
                    style={{ appearance: "none" }}
                  >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!form.quizName || !form.topic || !form.generatorName}
                className="w-full mt-2 py-3.5 rounded-xl font-['Russo_One'] text-sm tracking-widest flex items-center justify-center gap-2
                  bg-yellow-400 text-[#090917] hover:opacity-90 active:scale-95 transition-all duration-150
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
                style={{ fontFamily: "'Russo One', sans-serif" }}
              >
                <span>✨</span> GENERATE QUIZ
              </button>

            </div>

            {/* Back link */}
            <p className="text-center text-[0.7rem] font-extrabold tracking-widest uppercase text-white/20 hover:text-white/40 transition-colors cursor-pointer select-none">
              <Link to={'/'}>
                ← Back to Home
              </Link>
            </p>

          </div>
        )}

        {/* ════════════════════════════════════
            PHASE: LOADING
        ════════════════════════════════════ */}
        {phase === "loading" && <Loader />}

        {/* ════════════════════════════════════
            PHASE: RESULT
        ════════════════════════════════════ */}
        {phase === "result" && (
          <div className="w-full max-w-5xl flex flex-col gap-6">

            {/* ── Top bar: quiz info + room panel ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0f0f24] border-2 border-[#1e1e40] rounded-2xl px-5 py-4 sm:px-6 sm:py-5">

              {/* Left: quiz meta */}
              <div className="flex flex-col gap-0.5">
                <h2
                  className="font-['Russo_One'] text-xl sm:text-2xl text-white tracking-wide leading-tight"
                  style={{ fontFamily: "'Russo One', sans-serif" }}
                >
                  {form.quizName || "Science Showdown"}
                </h2>
                <p className="text-xs font-bold text-white/35 tracking-wide">
                  by <span className="text-yellow-400/70">{form.generatorName || "Alex"}</span>
                  <span className="ml-2 text-white/20">·</span>
                  <span className="ml-2">{form.numQuestions} Questions</span>
                  <span className="ml-2 text-white/20">·</span>
                  <span className="ml-2">{form.difficulty}</span>
                </p>
              </div>

              {/* Right: room code + start */}
              <div className="flex items-center gap-3 shrink-0">

                {/* Room code badge */}
                <div className="flex items-center gap-2 bg-[#13132b] border-2 border-[#2a2a50] rounded-xl px-4 py-2.5">
                  <span className="text-[0.6rem] font-extrabold tracking-widest uppercase text-white/30">
                    Room
                  </span>
                  <span
                    className="font-['Russo_One'] text-base tracking-widest text-yellow-400"
                    style={{ fontFamily: "'Russo One', sans-serif" }}
                  >
                    {roomId || "------"}
                  </span>
                  <button
                    onClick={handleCopy}
                    title="Copy room code"
                    disabled={!roomId}
                    className="ml-1 text-white/30 hover:text-yellow-400 transition-colors duration-150 select-none"
                  >
                    {copied ? (
                      <span className="text-emerald-400 text-xs font-extrabold tracking-widest">✓</span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Start Quiz */}
                <button
                  type="button"
                  disabled={!roomId}
                  onClick={() =>
                    navigate("/lobby", {
                      state: {
                        isHost: true,
                        roomId,
                        quizName: form.quizName,
                        hostName: form.generatorName,
                      },
                    })
                  }
                  className="shrink-0 px-5 py-2.5 rounded-xl font-['Russo_One'] text-xs tracking-widest bg-yellow-400 text-[#090917] hover:opacity-90 active:scale-95 transition-all duration-150 max-sm:text-xs"
                  style={{ fontFamily: "'Russo One', sans-serif" }}
                >
                  START QUIZ ROOM ▶
                </button>
              </div>
            </div>
            {questions.length === 0 && (
              <p className="text-white/40 text-center">No questions generated.</p>
            )}

            {/* ── Questions grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.map((q, i) => (
                <QuestionCard key={q.id} q={q} index={i} isRunning={false} />
              ))}
            </div>

            {/* ── Regenerate ── */}
            {/* <div className="flex justify-center pb-4">
              <button
                onClick={() => setPhase("form")}
                className="text-[0.7rem] font-extrabold tracking-widest uppercase text-white/25 hover:text-white/50 transition-colors duration-150 select-none"
              >
                ← Back to form
              </button>
            </div> */}

          </div>
        )}

      </main>
    </div>
  );
};

export default CreateQuiz;