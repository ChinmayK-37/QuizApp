import { useState } from 'react'
const OPTION_LABELS = ["A", "B", "C", "D"];

const QuestionCard = ({ q, index, isRunning }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="bg-[#0f0f24] border-2 border-[#1e1e40] rounded-2xl p-5 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-start gap-3">
        <span
          className="shrink-0 w-7 h-7 rounded-lg bg-[#1a1a35] flex items-center justify-center font-['Russo_One'] text-xs text-yellow-400"
          style={{ fontFamily: "'Russo One', sans-serif" }}
        >
          {index + 1}
        </span>
        <p className="text-sm font-bold text-white leading-snug">{q.question}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {q.options.map((opt, i) => (
          <div
            key={i}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 border transition-colors duration-150
              ${revealed && i === q.correctAnswerIndex
                ? "border-emerald-500/60 bg-emerald-500/10"
                : "border-[#1e1e40] bg-[#13132b]"
              }`}
          >
            <span
              className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center font-['Russo_One'] text-[0.6rem]
                ${revealed && i === q.correctAnswerIndex ? "bg-emerald-500 text-[#090917]" : "bg-[#1e1e40] text-white/40"}`}
              style={{ fontFamily: "'Russo One', sans-serif" }}
            >
              {OPTION_LABELS[i]}
            </span>
            <span className={`text-xs font-bold ${revealed && i === q.correctAnswerIndex ? "text-emerald-400" : "text-white/60"}`}>
              {opt}
            </span>
          </div>
        ))}
      </div>

      {/* Answer reveal */}
      {isRunning ? (
        <></>
      ) : (
        <button
          onClick={() => setRevealed((p) => !p)}
          className="self-start flex items-center gap-1.5 text-[0.65rem] font-extrabold tracking-widest uppercase text-white/30 hover:text-yellow-400 transition-colors duration-150 select-none"
        >
          <span
            className="transition-transform duration-200"
            style={{
              display: "inline-block",
              transform: revealed ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            ▶
          </span>

          {revealed ? "Hide Answer" : "Reveal Answer"}
        </button>
      )}
    </div>
  );
};

export default QuestionCard