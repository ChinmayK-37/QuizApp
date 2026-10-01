const OPTION_LABELS = ["A", "B", "C", "D"];

const QuizQuestionCard = ({ q, index, selectedIndex, onSelect, disabled }) => {
  const handleSelect = (i) => {
    if (disabled) return;
    onSelect?.(i);
  };

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
        <p className="text-lg font-bold text-white leading-snug">
          {q.question}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {q.options.map((opt, i) => {
          const isSelected = selectedIndex === i;

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 border transition-all duration-150 text-left
                ${
                  isSelected
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-[#1e1e40] bg-[#13132b] hover:border-yellow-400/40"
                }
                ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
              `}
            >
              <span
                className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center font-['Russo_One'] text-lg
                  ${
                    isSelected
                      ? "bg-yellow-400 text-[#090917]"
                      : "bg-[#1e1e40] text-white/40"
                  }`}
                style={{ fontFamily: "'Russo One', sans-serif" }}
              >
                {OPTION_LABELS[i]}
              </span>

              <span
                className={`text-lg font-bold ${
                  isSelected ? "text-yellow-300" : "text-white/60"
                }`}
              >
                {opt}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestionCard;