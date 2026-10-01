import { Link } from "react-router";
import { gs } from "../global_styles/GameStyles";

/**
 * Navbar
 * Props:
 *  playerName  – display name shown beside avatar (default "Player")
 */
const Navbar = ({ playerName = "Player" }) => {
  return (
    <>
      {/* Google Fonts – loaded once here, available site-wide */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Nunito:wght@600;700;800;900&display=swap');`}</style>

      <nav className={gs.navbar} style={{ fontFamily: "'Nunito', sans-serif" }}>

        {/* ── Logo ─────────────────────────────────── */}
        <span className={gs.navLogo}><Link to={'/'}>QUIZEME</Link></span>

        {/* ── Nav links (hidden on small screens) ─── */}
        <div className="hidden sm:flex items-center gap-7">
          {["Leaderboard", "How to Play", "About"].map((item) => (
            <a key={item} className={gs.navLink}>{item}</a>
          ))}
        </div>

        {/* ── Player identity ──────────────────────── */}
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:block text-[0.72rem] font-bold tracking-widest uppercase text-white/30">
            {playerName}
          </span>
          <div className={gs.navAvatar}>
            {playerName.charAt(0).toUpperCase()}
          </div>
        </div>

      </nav>
    </>
  );
};

export default Navbar;