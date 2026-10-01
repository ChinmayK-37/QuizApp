import Navbar from "../components/Navbar";
import { gs } from "../global_styles/GameStyles.js";
import { Link } from "react-router";


/* ─────────────────────────────────────────────────────────────────
   QuizCard — reusable for any quiz action (Create / Join / etc.)
   Props:
     icon         emoji shown in the avatar circle
     eyebrowText  small label above the title
     eyebrowColor Tailwind text-colour class
     title        card heading
     description  body copy
     btnLabel     button text
     btnClass     gs.btnPrimary | gs.btnSecondary | gs.btnGhost
     hoverBorder  Tailwind hover:border-* class
───────────────────────────────────────────────────────────────── */
const QuizCard = ({
  icon,
  eyebrowText,
  eyebrowColor = "text-yellow-400",
  title,
  description,
  btnLabel,
  btnClass,
  hoverBorder = "hover:border-yellow-400",
  navigate
}) => (
  <div className={`${gs.cardBase} ${hoverBorder}`}>

    {/* ── Avatar / profile-pic placeholder ── */}
    <div className={gs.avatar}>{icon}</div>

    {/* ── Label + Title ── */}
    <div className="flex flex-col items-center gap-1 w-full">
      <span className={`${gs.eyebrow} ${eyebrowColor}`}>
        {eyebrowText}
      </span>
      <h2
        className="font-['Russo_One'] text-xl sm:text-2xl tracking-wide text-white leading-tight"
        style={{ fontFamily: "'Russo One', sans-serif" }}
      >
        {title}
      </h2>
    </div>

    {/* ── Description ── */}
    <p className={`${gs.bodyMuted} text-xs sm:text-sm`}>
      {description}
    </p>

    {/* ── CTA button — pushed to bottom with mt-auto ── */}
    <Link to={navigate} className={btnClass}><button className="cursor-pointer">{btnLabel}</button></Link>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   StatItem — reusable stat pill
───────────────────────────────────────────────────────────────── */
const StatItem = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span
      className={gs.statValue}
      style={{ fontFamily: "'Russo One', sans-serif" }}
    >
      {value}
    </span>
    <span className={gs.statLabel}>{label}</span>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   OR Divider — adapts between horizontal (mobile) and vertical (sm+)
───────────────────────────────────────────────────────────────── */
const OrDivider = () => (
  <div className="flex sm:flex-col items-center justify-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-0 self-stretch">
    <div className={`flex-1 h-px sm:h-auto sm:w-px sm:flex-1 ${gs.divider}`} />
    <span
      className={gs.orLabel}
      style={{ fontFamily: "'Russo One', sans-serif" }}>
      OR
    </span>
    <div className={`flex-1 h-px sm:h-auto sm:w-px sm:flex-1 ${gs.divider}`} />
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   Home Page
───────────────────────────────────────────────────────────────── */
const Home = () => (
  <div
    className={gs.page}
    style={{ fontFamily: "'Nunito', sans-serif" }}
  >
    <Navbar />

    {/*
      mt-[60px]                  → clears the fixed navbar
      min-h-[calc(100vh-60px)]   → fills remaining viewport height
      flex flex-col items-center justify-center → centres vertically + horizontally
      gap-6 px-4 py-10           → spacing that works at all sizes
    */}
    <main className={gs.pageMain}>

      {/* ── Chip ─────────────────────────────── */}
      <span className={gs.chip}>⚡ Multiplayer AI Quiz</span>

      {/* ── Hero title ───────────────────────── */}
      <h1
        className={gs.heroTitle}
        style={{ fontFamily: "'Russo One', sans-serif" }}
      >
        PLAY. QUIZ.{" "}
        <span className={gs.titleAccent}>WIN.</span>
      </h1>

      {/* ── Description ─────────────────────── */}
      <p className={`${gs.bodyMuted} max-w-sm sm:max-w-md text-xs sm:text-sm`}>
        Build quizzes with AI or jump into a live match.
        Compete with friends, climb the ranks, and prove your brain is built different.
      </p>

      {/* ── Cards ───────────────────────────── */}
      {/*
        On mobile:  column, cards stack full-width (max-w capped)
        On sm+:     row, equal-width cards with an OR divider between
        w-full max-w-2xl keeps the row from stretching too wide
      */}
      <div className="flex flex-col sm:flex-row items-center sm:items-stretch justify-center w-full max-w-2xl gap-4 sm:gap-0">

        <QuizCard
          icon="✏️"
          eyebrowText="For Creators"
          eyebrowColor="text-yellow-400"
          title="Create Quiz"
          description="Design your own AI-powered quiz. Set the rules, pick the topics, challenge your players."
          btnLabel="START CREATING"
          btnClass={gs.btnPrimary}
          hoverBorder="hover:border-yellow-400"
          navigate="/createquiz"
        />

        <OrDivider />

        <QuizCard
          icon="🎯"
          eyebrowText="For Players"
          eyebrowColor="text-sky-400"
          title="Join Quiz"
          description="Enter a room code and drop into a live match. Answer fast, think faster."
          btnLabel="ENTER ROOM"
          btnClass={gs.btnSecondary}
          hoverBorder="hover:border-sky-400"
          navigate = "/joinquiz"
        />

      </div>

      {/* ──────────────────────── Stats strip ─────────────────────── */}
      <div className="flex items-center justify-center gap-6 sm:gap-10 pt-2">
        <StatItem value="50K+" label="Players" />
        <div className="w-px h-8 bg-[#1e1e40]" />
        <StatItem value="1.2M"  label="Quizzes Played" />
        <div className="w-px h-8 bg-[#1e1e40]" />
        <StatItem value="#1"    label="AI Quiz App" />
      </div>

    </main>
  </div>
);

export default Home;
