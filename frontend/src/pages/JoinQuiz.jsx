import { useState } from "react";
import Navbar from "../components/Navbar";
import { gs } from "../global_styles/GameStyles.js";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { roomapi } from "../api/roomapi";
import { setSession } from "../state/session";

const JoinQuiz = () => {
  const [form, setForm] = useState({ playerName: "", roomCode: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const canJoin = form.playerName.trim() && form.roomCode.trim().length >= 4;

  const inputCls = "w-full bg-[#13132b] border-2 border-[#1e1e40] rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:border-sky-400/60 transition-colors duration-150";
  const labelCls = "block text-[0.65rem] font-extrabold tracking-[0.16em] uppercase text-white/40 mb-1.5";

  const handleJoin = async () => {
    if (!canJoin || loading) return;
    setLoading(true);
    try {
      const userId = Date.now();
      const roomId = form.roomCode.trim().toUpperCase();
      const joined = await roomapi.joinRoom({ roomId, userId, playerName: form.playerName.trim() });

      setSession({
        roomId,
        isHost: false,
        userId,
        playerName: form.playerName.trim(),
        playerNumber: joined?.playerNumber,
      });

      navigate("/lobby", { state: { isHost: false, roomId } });
    } catch (e) {
      alert(e?.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={gs.page} style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      <main className="mt-[60px] min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-10">

        <div className="w-full max-w-md flex flex-col gap-6">

          {/* Heading */}
          <div className="text-center flex flex-col items-center gap-2">
            <span className={`${gs.chip} border-sky-400/30 text-sky-400 bg-sky-400/5`}>
              🎯 Join a Room
            </span>
            <h1
              className="font-['Russo_One'] text-3xl sm:text-4xl text-white tracking-wide mt-1"
              style={{ fontFamily: "'Russo One', sans-serif" }}
            >
              JOIN THE <span className="text-sky-400">QUIZ</span>
            </h1>
            <p className="text-xs font-bold text-white/35 leading-relaxed">
              Enter your name and the room code to join the quiz.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-[#0f0f24] border-2 border-[#1e1e40] rounded-2xl p-6 sm:p-8 flex flex-col gap-5">

            {/* Player Name */}
            <div>
              <label className={labelCls}>Player Name</label>
              <input
                name="playerName"
                value={form.playerName}
                onChange={handleChange}
                placeholder="e.g. Alex"
                className={inputCls}
                autoComplete="off"
              />
            </div>

            {/* Room Code */}
            <div>
              <label className={labelCls}>Room Code</label>
              <input
                name="roomCode"
                value={form.roomCode}
                onChange={handleChange}
                placeholder="e.g. ABCD12"
                maxLength={8}
                className={`${inputCls} uppercase tracking-widest font-['Russo_One'] text-base`}
                style={{ fontFamily: "'Russo One', sans-serif" }}
                autoComplete="off"
              />
            </div>

            {/* Join button */}
            <button
              disabled={!canJoin}
              onClick={handleJoin}
              className="w-full mt-1 py-3.5 rounded-xl font-['Russo_One'] text-sm tracking-widest flex items-center justify-center gap-2
                bg-sky-400 text-[#090917] hover:opacity-90 active:scale-95 transition-all duration-150
                disabled:opacity-25 disabled:cursor-not-allowed disabled:active:scale-100"
              style={{ fontFamily: "'Russo One', sans-serif" }}
            >
              {loading ? "JOINING..." : "🎯 JOIN ROOM"}
            </button>

          </div>

          {/* Back link */}
          <p className="text-center text-[0.7rem] font-extrabold tracking-widest uppercase text-white/20 hover:text-white/40 transition-colors cursor-pointer select-none">
            <Link to={'/'}>
            ← Back to Home
            </Link>
          </p>

        </div>
      </main>
    </div>
  );
};

export default JoinQuiz;