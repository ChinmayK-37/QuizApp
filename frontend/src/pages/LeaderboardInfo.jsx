import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { gs } from "../global_styles/GameStyles";

export default function LeaderboardInfo() {
  return (
    <div className={gs.page} style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />
      <main className="mt-[60px] min-h-[calc(100vh-60px)] flex flex-col items-center justify-center px-4 py-12">
        <section className="w-full max-w-3xl bg-[#0f0f24] border-2 border-[#1e1e40] rounded-2xl p-7 sm:p-10 text-center">
          <span className={gs.chip}>🏆 Room rankings</span>
          <h1 className="mt-4 font-['Russo_One'] text-3xl sm:text-5xl tracking-wide">CLIMB THE <span className="text-yellow-400">RANKS</span></h1>
          <p className="mt-4 text-sm font-bold text-white/40 leading-relaxed max-w-xl mx-auto">Leaderboards are specific to each quiz room. Join a room or create one to see live player scores and final rankings.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            {[['1', 'Finish', 'Completed players are ranked first.'], ['2', 'Score', 'Higher correct-answer score ranks higher.'], ['3', 'Speed', 'Equal scores use total completion time as a tie-breaker.']].map(([number, title, detail]) => (
              <div key={number} className="bg-[#13132b] border border-[#2a2a50] rounded-xl p-4"><span className="text-yellow-400 font-['Russo_One']">{number}</span><h2 className="mt-1 font-bold">{title}</h2><p className="mt-1 text-xs font-bold text-white/35 leading-relaxed">{detail}</p></div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"><Link to="/createquiz" className="px-6 py-3 rounded-xl font-['Russo_One'] text-xs tracking-widest bg-yellow-400 text-[#090917]">CREATE A QUIZ</Link><Link to="/joinquiz" className="px-6 py-3 rounded-xl font-['Russo_One'] text-xs tracking-widest border border-[#2a2a50] text-white/60">JOIN A ROOM</Link></div>
        </section>
      </main>
    </div>
  );
}
