import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import { gs } from "../global_styles/GameStyles.js";
import { useLocation, useNavigate } from "react-router";
import { roomapi } from "../api/roomapi";
import { getSession } from "../state/session";

const COLORS = ["#facc15", "#38bdf8", "#a78bfa", "#34d399", "#fb923c", "#f472b6", "#60a5fa"];

function colorForUserId(userId) {
  const n = Number(userId || 0);
  return COLORS[Math.abs(n) % COLORS.length];
}

function formatDisplayName({ baseName, isYou }) {
  const you = isYou ? "(YOU) " : "";
  return `${you}${baseName || "Player"}`.trim();
}

/* ── Spinner ─────────────────────────────────────────────────────── */
const Spinner = () => (
  <span
    className="w-4 h-4 rounded-full border-2 border-white/20 border-t-sky-400 shrink-0"
    style={{ animation: "spin 0.9s linear infinite", display: "inline-block" }}
  />
);

/* ── Player Row ──────────────────────────────────────────────────── */
const PlayerRow = ({ player, index }) => (
  <div
    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0f0f24] border border-[#1e1e40] transition-all duration-300"
    style={{ animation: "fadeSlideIn 0.3s ease both", animationDelay: `${index * 40}ms` }}
  >
    {/* Avatar */}
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-[#090917] shrink-0"
      style={{ background: player.color }}
    >
      {player.playerNumber}
    </div>

    {/* Name */}
    <span className="text-sm font-bold text-white/80 flex-1">{player.name}</span>

    {/* Ready badge */}
    <span className="text-[0.6rem] font-extrabold tracking-widest uppercase text-emerald-400/70">
      ✓ Ready
    </span>
  </div>
);

/* ── Main Component ──────────────────────────────────────────────── */

/**
 * Lobby
 * Props:
 *   isHost  – boolean, toggles bottom bar between host/player view (default: false)
 *   quizName
 *   hostName
 *   roomCode
 */
const Lobby = ({
  quizName = "Science Showdown",
  hostName = "Alex",
  roomCode = "ABCD12",
}) => {
  const [players, setPlayers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const session = useMemo(() => getSession(), []);
  const { isHost, roomId } = location.state || {};

  const effectiveRoomId = (roomId || session.roomId || roomCode || "").toUpperCase();
  const effectiveIsHost = Boolean(isHost ?? session.isHost);
  const effectiveHostName = session.isHost ? (session.playerName || hostName) : hostName;
  const effectiveQuizName = session.quizName || quizName;

  /* Poll players list */
  useEffect(() => {
    if (!effectiveRoomId) return;

    let cancelled = false;
    const load = async () => {
      try {
        const rows = await roomapi.getPlayers(effectiveRoomId);
        if (cancelled) return;
        const mapped = (rows || []).map((p) => {
          const isYou = p.userId === session.userId;
          const baseName =
            isYou && session.playerName ? session.playerName : (p.playerName || "Player");
          const displayName = formatDisplayName({ baseName, isYou });
          return {
            id: p.id,
            name: displayName,
            avatar: (baseName || "P").charAt(0).toUpperCase(),
            color: colorForUserId(p.userId),
            userId: p.userId,
            playerNumber: p.playerNumber,
          };
        });
        setPlayers(mapped);
      } catch {
        // ignore transient polling errors
      }
    };

    load();
    const timer = setInterval(load, 2000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [effectiveRoomId, session.playerName, session.userId]);

  /* Player: detect quiz started and navigate */
  useEffect(() => {
    if (!effectiveRoomId || effectiveIsHost) return;

    let cancelled = false;
    const check = async () => {
      try {
        const room = await roomapi.getRoom(effectiveRoomId);
        if (cancelled) return;
        if (room?.status === "STARTED") {
          navigate("/question", { state: { roomId: effectiveRoomId } });
        }
      } catch {
        // ignore
      }
    };

    check();
    const timer = setInterval(check, 1500);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [effectiveRoomId, effectiveIsHost, navigate]);

  const handleStart = async () => {
    if (!effectiveRoomId || starting) return;
    setStarting(true);
    try {
      await roomapi.startQuiz({ roomId: effectiveRoomId, userId: session.userId });
      navigate("/question", { state: { roomId: effectiveRoomId } });
    } catch (e) {
      alert(e?.message || "Failed to start quiz");
    } finally {
      setStarting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(effectiveRoomId || roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={gs.page} style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Nunito:wght@600;700;800;900&display=swap');
        @keyframes spin        { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-dot   { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
      `}</style>

      <Navbar playerName={session.playerName || (effectiveIsHost ? effectiveHostName : "Player")} />

      {/*
        Layout: fixed navbar (60px) + sticky footer (~64px)
        Middle section scrolls independently.
      */}
      <div className="mt-[60px] flex flex-col" style={{ minHeight: "calc(100vh - 60px)" }}>

        {/* ── Top Info Bar ─────────────────────────────────────── */}
        <div className="bg-[#0f0f24] border-b-2 border-[#1e1e40] px-4 sm:px-8 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 flex-wrap">

            {/* Left: quiz meta */}
            <div className="flex flex-col gap-0.5">
              <h2
                className="font-['Russo_One'] text-lg sm:text-xl text-white tracking-wide leading-tight"
                style={{ fontFamily: "'Russo One', sans-serif" }}
              >
                {effectiveQuizName}
              </h2>
              <p className="text-xs font-bold text-white/35 tracking-wide">
                Hosted by{" "}
                <span className="text-yellow-400/80">{effectiveHostName}</span>
              </p>
            </div>

            {/* Right: room code + count */}
            <div className="flex items-center gap-3 flex-wrap">

              {/* Room code badge */}
              {effectiveIsHost ? (
              <div className="flex items-center gap-2 bg-[#13132b] border border-[#2a2a50] rounded-xl px-3 py-2">
                <span className="text-[0.58rem] font-extrabold tracking-widest uppercase text-white/25">Room</span>
                <span
                  className="font-['Russo_One'] text-sm tracking-widest text-yellow-400"
                  style={{ fontFamily: "'Russo One', sans-serif" }}
                >
                  {effectiveRoomId || roomCode}
                </span>
                <button onClick={handleCopy} className="text-white/25 hover:text-yellow-400 transition-colors duration-150">
                  {copied
                    ? <span className="text-emerald-400 text-[0.65rem] font-extrabold">✓</span>
                    : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                </button>
              </div>
              ):( <></> )}

              {/* Player count */}
              <div className="flex items-center gap-1.5 bg-[#13132b] border border-[#2a2a50] rounded-xl px-3 py-2">
                <span className="text-sm">👥</span>
                <span
                  className="font-['Russo_One'] text-sm text-white/80"
                  style={{ fontFamily: "'Russo One', sans-serif" }}
                >
                  {players.length}
                </span>
                <span className="text-[0.6rem] font-extrabold uppercase tracking-widest text-white/25">Joined</span>
              </div>

            </div>
          </div>
        </div>

        {/* ── Scrollable Middle ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 pb-32">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">

            {/* Title block */}
            <div className="text-center flex flex-col items-center gap-2">
              <span
                className="font-['Russo_One'] text-2xl sm:text-3xl text-white tracking-wide"
                style={{ fontFamily: "'Russo One', sans-serif" }}
              >
                WAITING IN <span className="text-yellow-400">LOBBY</span>
              </span>
              <p className="text-xs font-bold text-white/35 leading-relaxed">
                The quiz will start once the host hits the button.{" "}
                <span className="text-yellow-400/60">Be Ready! ⚡</span>
              </p>
            </div>

            {/* Players grid */}
            <div className="flex flex-col gap-2">
              {/* Section label */}
              <div className="flex items-center justify-between mb-1">
                <span className={`${gs.eyebrow} text-white/30`}>Players</span>
                <span className={`${gs.eyebrow} text-emerald-400/60`}>
                  {players.length} in room
                </span>
              </div>

              {players.map((player, i) => (
                <PlayerRow key={player.id} player={player} index={i} />
              ))}

              {/* Live joining indicator */}
              <div className="flex items-center gap-2 px-4 py-2.5 mt-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/20"
                    style={{ animation: `pulse-dot 1.2s ease ${i * 0.2}s infinite` }}
                  />
                ))}
                <span className="text-[0.65rem] font-bold text-white/20 tracking-wide">
                  waiting for more players…
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Sticky Bottom Bar ────────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#090917] border-t-2 border-[#1a1a35] px-4 sm:px-8 py-4">
          <div className="max-w-3xl mx-auto">

            {effectiveIsHost ? (
              /* Host: Start Quiz button */
              <button
                onClick={handleStart}
                className="w-full py-3.5 rounded-xl font-['Russo_One'] text-sm tracking-widest flex items-center justify-center gap-2
                  bg-yellow-400 text-[#090917] hover:opacity-90 active:scale-95 transition-all duration-150"
                style={{ fontFamily: "'Russo One', sans-serif" }}
              >
                {starting ? "STARTING..." : "START QUIZ ▶"}
              </button>
            ) : (
              /* Player: waiting indicator */
              <div className="flex items-center justify-center gap-3">
                <Spinner />
                <span
                  className="font-['Russo_One'] text-xs tracking-widest text-white/35 uppercase"
                  style={{ fontFamily: "'Russo One', sans-serif" }}
                >
                  Waiting for host to start the quiz…
                </span>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Lobby;