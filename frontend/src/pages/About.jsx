import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { gs } from "../global_styles/GameStyles";

const technologies = ["React + Vite", "Spring Boot", "PostgreSQL", "Google Gemini AI"];

export default function About() {
  return (
    <div className={gs.page} style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />
      <main className="mt-[60px] min-h-[calc(100vh-60px)] px-4 py-12 sm:py-16">
        <section className="max-w-3xl mx-auto text-center">
          <span className={gs.chip}>⚡ About QuizMe</span>
          <h1 className="mt-4 font-['Russo_One'] text-3xl sm:text-5xl tracking-wide">QUIZZES MADE <span className="text-yellow-400">SOCIAL</span></h1>
          <p className="mt-4 text-sm font-bold text-white/40 leading-relaxed max-w-2xl mx-auto">QuizMe is a room-based quiz experience where hosts create AI-generated quizzes on a topic and players compete in the same room.</p>
        </section>
        <section className="max-w-3xl mx-auto mt-10 bg-[#0f0f24] border-2 border-[#1e1e40] rounded-2xl p-6 sm:p-8">
          <h2 className="font-['Russo_One'] text-xl tracking-wide">HOW IT WORKS</h2>
          <p className="mt-3 text-sm font-bold text-white/40 leading-relaxed">The backend asks Google Gemini to generate quiz questions, stores the room and player state in PostgreSQL, and exposes REST APIs to the React frontend. Players share a room code, submit answers independently, and compare their final results on a room leaderboard.</p>
          <h2 className="mt-7 font-['Russo_One'] text-xl tracking-wide">BUILT WITH</h2>
          <div className="mt-3 flex flex-wrap gap-2">{technologies.map((technology) => <span key={technology} className="rounded-full bg-[#13132b] border border-[#2a2a50] px-3 py-1.5 text-xs font-extrabold text-white/60">{technology}</span>)}</div>
        </section>
        <div className="max-w-sm mx-auto mt-8"><Link to="/" className={`${gs.btnPrimary} block text-center`}>START PLAYING</Link></div>
      </main>
    </div>
  );
}
