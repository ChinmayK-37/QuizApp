import { useMemo, useState } from "react";

/* ── Helpers ─────────────────────────────────────────────────────────── */

const MEDAL_ICON = ["🥇", "🥈", "🥉"];

function medalBorder(rank) {
  if (rank === 1)
    return "border-yellow-400/60 bg-gradient-to-r from-yellow-400/8 to-transparent shadow-[0_0_18px_rgba(250,204,21,0.10)]";
  if (rank === 2)
    return "border-slate-300/45 bg-gradient-to-r from-slate-300/8 to-transparent";
  if (rank === 3)
    return "border-orange-400/45 bg-gradient-to-r from-orange-400/8 to-transparent";
  return "border-[#1e1e40] bg-[#0d0d22]";
}

function formatTime(secs) {
  if (secs == null) return null;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/* ── Leaderboard ─────────────────────────────────────────────────────── */

/**
 * Props
 *   entries        – array of { userId, playerName, score, finished, timeTakenSeconds }
 *   currentUserId  – highlights the calling player's row
 *   hostName       – shown as a static banner outside the ranked list
 *   totalQuestions – if provided shows "N / total" denominator
 *   pageSize       – rows per page (default 10)
 *   title          – section label
 */
const Leaderboard = ({
  entries = [],
  currentUserId,
  hostName,
  totalQuestions,
  pageSize = 10,
  title = "Leaderboard",
}) => {
  const [page, setPage] = useState(1);

  /* Sort: finished (score↓ time↑) → running (score↓) */
  const sorted = useMemo(() => {
    return [...(entries || [])].sort((a, b) => {
      const af = !!a.finished, bf = !!b.finished;
      if (af !== bf) return af ? -1 : 1;
      const sd = (b.score || 0) - (a.score || 0);
      if (sd !== 0) return sd;
      const at = a.timeTakenSeconds, bt = b.timeTakenSeconds;
      if (at == null && bt == null) return 0;
      if (at == null) return 1;
      if (bt == null) return -1;
      return at - bt;
    });
  }, [entries]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const start      = (safePage - 1) * pageSize;
  const slice      = sorted.slice(start, start + pageSize);

  const runningCount  = sorted.filter((p) => !p.finished).length;
  const finishedCount = sorted.filter((p) => p.finished).length;

  return (
    <div className="bg-[#0a0a1e] border-2 border-[#1e1e40] rounded-2xl p-5 w-full overflow-hidden">
      <style>{`
        @keyframes runningPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.65; transform:scale(0.96); }
        }
        @keyframes rowIn {
          from { opacity:0; transform:translateY(7px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes popIn {
          0%   { transform:scale(1.25); }
          100% { transform:scale(1); }
        }
        @keyframes scorePulse {
          0%,100% { text-shadow: 0 0 0px rgba(52,211,153,0); }
          50%      { text-shadow: 0 0 10px rgba(52,211,153,0.5); }
        }
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <div className="text-[0.6rem] font-extrabold tracking-widest uppercase text-white/30">
            {title}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[0.58rem] font-bold text-emerald-400/50">
              {finishedCount} done
            </span>
            {runningCount > 0 && (
              <>
                <span className="text-white/15 text-[0.55rem]">·</span>
                <span
                  className="text-[0.58rem] font-bold text-amber-400/60"
                  style={{ animation: "runningPulse 1.8s ease infinite" }}
                >
                  {runningCount} running
                </span>
              </>
            )}
          </div>
        </div>

        {sorted.length > pageSize && (
          <div className="flex items-center gap-1.5">
            <button
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded-lg border border-[#1e1e40] text-[0.6rem] font-extrabold tracking-widest text-white/40 disabled:opacity-25 hover:border-white/20 transition-colors"
            >
              ‹ Prev
            </button>
            <span className="text-[0.6rem] font-extrabold text-white/25">
              {safePage}/{totalPages}
            </span>
            <button
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded-lg border border-[#1e1e40] text-[0.6rem] font-extrabold tracking-widest text-white/40 disabled:opacity-25 hover:border-white/20 transition-colors"
            >
              Next ›
            </button>
          </div>
        )}
      </div>

      {/* ── Host name (outside ranked list) ── */}
      {hostName && (
        <div className="flex items-center gap-2 px-4 py-2.5 mb-3 rounded-xl bg-[#13132b] border border-dashed border-[#2a2a50]">
          <span className="text-[0.58rem] font-extrabold tracking-widest uppercase text-white/25">
            Host
          </span>
          <span className="text-xs font-bold text-yellow-400/70 flex-1 truncate">
            {hostName}
          </span>
          <span className="text-[0.55rem] font-extrabold tracking-widest uppercase text-white/20">
            not ranked
          </span>
        </div>
      )}

      {/* ── Player rows ── */}
      <div className="flex flex-col gap-2">
        {slice.map((p, i) => {
          const rank    = start + i + 1;
          const isYou   = currentUserId && String(p.userId) === String(currentUserId);
          const medal   = MEDAL_ICON[rank - 1] ?? null;
          const time    = formatTime(p.timeTakenSeconds);
          const pct     = totalQuestions
            ? Math.min(100, Math.round(((p.score || 0) / totalQuestions) * 100))
            : null;

          return (
            <div
              key={`${p.userId}-${rank}`}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl border
                transition-all duration-500
                ${medalBorder(rank)}
                ${isYou ? "ring-1 ring-sky-400/40" : ""}
              `}
              style={{ animation: `rowIn 0.35s ease ${i * 55}ms both` }}
            >
              {/* Score bar accent at bottom */}
              {pct !== null && (
                <div className="absolute bottom-0 left-0 h-[2px] rounded-full bg-emerald-400/25 transition-all duration-700"
                  style={{ width: `${pct}%` }} />
              )}

              {/* Rank / Medal */}
              <div className="w-8 shrink-0 flex items-center justify-center">
                {medal ? (
                  <span
                    className="text-xl leading-none select-none"
                    style={{ animation: rank <= 3 ? "popIn 0.5s cubic-bezier(.34,1.56,.64,1)" : undefined }}
                  >
                    {medal}
                  </span>
                ) : (
                  <span
                    className="font-['Russo_One'] text-sm text-white/35"
                    style={{ fontFamily: "'Russo One', sans-serif" }}
                  >
                    {rank}
                  </span>
                )}
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {isYou && (
                    <span className="text-[0.55rem] font-extrabold tracking-widest uppercase text-sky-400/80 border border-sky-400/30 rounded-full px-1.5 py-0.5">
                      you
                    </span>
                  )}
                  <span className="text-sm font-bold text-white/90 truncate">
                    {p.playerName}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  {p.finished ? (
                    time && (
                      <span className="text-[0.58rem] font-bold text-white/30">
                        ⏱ {time}
                      </span>
                    )
                  ) : (
                    <span
                      className="text-[0.55rem] font-extrabold tracking-widest uppercase text-amber-400/80 px-1.5 py-0.5 rounded-full border border-amber-400/30 bg-amber-400/8"
                      style={{ animation: "runningPulse 1.6s ease infinite" }}
                    >
                      🏃 Running
                    </span>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="shrink-0 flex flex-col items-end gap-0.5">
                <span
                  className="font-['Russo_One'] text-base text-emerald-400"
                  style={{
                    fontFamily: "'Russo One', sans-serif",
                    animation: "scorePulse 2.5s ease infinite",
                  }}
                >
                  {p.score || 0}
                </span>
                {totalQuestions && (
                  <span className="text-[0.52rem] font-bold text-white/22">
                    /{totalQuestions}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="text-sm font-bold text-white/25 text-center py-10">
            No players yet…
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
