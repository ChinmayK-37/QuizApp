import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { gs } from "../global_styles/GameStyles";

const steps = [
  ["01", "Create or join", "Create a quiz as the host, or enter a room code shared by a host."],
  ["02", "Wait in the lobby", "Everyone in the room appears in the lobby. The host starts the quiz when ready."],
  ["03", "Answer every question", "Choose one option and press Next. Your score increases when the answer is correct."],
  ["04", "See the results", "Finish the quiz to record your completion time and view the room leaderboard."],
];

export default function HowToPlay() {
  return (
    <div className={gs.page} style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />
      <main className="mt-[60px] min-h-[calc(100vh-60px)] px-4 py-12 sm:py-16">
        <section className="max-w-4xl mx-auto text-center">
          <span className={gs.chip}>🎮 Game guide</span>
          <h1 className="mt-4 font-['Russo_One'] text-3xl sm:text-5xl tracking-wide">HOW TO <span className="text-yellow-400">PLAY</span></h1>
          <p className="mt-3 text-sm font-bold text-white/40 max-w-xl mx-auto">Create a topic-based quiz with AI, invite friends using the room code, and compete on score and completion speed.</p>
        </section>

        <section className="max-w-4xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map(([number, title, description]) => (
            <article key={number} className="bg-[#0f0f24] border-2 border-[#1e1e40] rounded-2xl p-6 flex gap-4">
              <span className="font-['Russo_One'] text-xl text-yellow-400">{number}</span>
              <div><h2 className="font-['Russo_One'] tracking-wide text-lg">{title}</h2><p className="mt-2 text-sm font-bold text-white/40 leading-relaxed">{description}</p></div>
            </article>
          ))}
        </section>

        <div className="max-w-sm mx-auto mt-8"><Link to="/" className={`${gs.btnPrimary} block text-center`}>BACK TO HOME</Link></div>
      </main>
    </div>
  );
}
