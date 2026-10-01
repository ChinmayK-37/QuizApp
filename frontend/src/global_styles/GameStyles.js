/**
 * gameStyles.js
 * ─────────────────────────────────────────────────────────────────
 * Shared Tailwind class strings for QizeMe.
 * Import in any component/page to keep styles consistent.
 *
 * Usage:
 *   import { gs } from "./gameStyles";
 *   <button className={gs.btnPrimary}>Click</button>
 * ─────────────────────────────────────────────────────────────────
 */

export const gs = {

  // ── Page / Layout ──────────────────────────────────────────────
  /** Root page wrapper – dark bg, no overflow */
  page: "bg-[#090917] text-white font-sans overflow-x-hidden",

  /**
   * Main content area below the 60px fixed navbar.
   * Fills exactly the remaining viewport height and centres content.
   * Uses min-h so it still scrolls if content is very tall on tiny screens.
   */
  pageMain:
    "mt-[60px] min-h-[calc(100vh-60px)] flex flex-col items-center justify-center gap-6 px-4 py-10",

  // ── Typography ─────────────────────────────────────────────────
  /** Hero display title */
  heroTitle:
    "font-['Russo_One'] text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-wide text-white text-center",

  /** Yellow accent inside a title */
  titleAccent: "text-yellow-400",

  /** Small ALL-CAPS eyebrow label */
  eyebrow:
    "text-[0.65rem] font-extrabold tracking-[0.18em] uppercase",

  /** Muted description / body text */
  bodyMuted:
    "text-sm font-bold text-white/40 leading-relaxed text-center",

  /** Stat value number */
  statValue:
    "font-['Russo_One'] text-2xl text-white tracking-wide text-center",

  /** Stat sub-label */
  statLabel:
    "text-[0.65rem] font-extrabold tracking-[0.14em] uppercase text-white/30 mt-0.5 text-center",

  // ── Badges / Chips ─────────────────────────────────────────────
  /** Yellow announcement chip */
  chip:
    "inline-block bg-[#13132b] border border-[#2a2a50] rounded-md px-3 py-1 text-[0.65rem] font-extrabold tracking-[0.18em] uppercase text-yellow-400",

  // ── Cards ──────────────────────────────────────────────────────
  /**
   * Base card shell.
   * Combine with a hover-border colour class per usage.
   * flex-1 lets both cards share equal width in the row.
   */
  cardBase:
    "flex-1 min-w-[240px] max-w-[300px] bg-[#0f0f24] border-2 border-[#1e1e40] rounded-2xl p-6 flex flex-col items-center gap-4 text-center cursor-pointer transition-all duration-200 hover:-translate-y-1",

  /** Circular avatar / profile-pic placeholder inside a card */
  avatar:
    "w-16 h-16 rounded-full bg-[#13132b] border-2 border-[#2a2a50] flex items-center justify-center text-2xl shrink-0 transition-colors duration-200",

  // ── Buttons ────────────────────────────────────────────────────
  /** Full-width yellow primary button */
  btnPrimary:
    "w-full mt-auto py-3 rounded-xl font-['Russo_One'] text-xs tracking-widest bg-yellow-400 text-[#090917] hover:opacity-85 active:scale-95 transition-all duration-150",

  /** Full-width sky secondary button */
  btnSecondary:
    "w-full mt-auto py-3 rounded-xl font-['Russo_One'] text-xs tracking-widest bg-sky-400 text-[#090917] hover:opacity-85 active:scale-95 transition-all duration-150",

  /** Ghost / outline button */
  btnGhost:
    "w-full py-3 rounded-xl font-['Russo_One'] text-xs tracking-widest border border-[#2a2a50] text-white/50 hover:border-white/30 hover:text-white transition-colors duration-150",

  // ── Navbar ─────────────────────────────────────────────────────
  /** Fixed top navigation bar */
  navbar:
    "fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-6 sm:px-10 bg-[#090917] border-b-2 border-[#1a1a35]",

  /** Brand / logo text */
  navLogo:
    "font-['Russo_One'] text-xl tracking-widest text-yellow-400",

  /** Navigation anchor link */
  navLink:
    "text-[0.72rem] font-extrabold tracking-widest uppercase text-white/40 hover:text-yellow-400 transition-colors duration-150 cursor-pointer select-none",

  /** Avatar circle in the navbar */
  navAvatar:
    "w-9 h-9 rounded-full bg-[#12122a] border-2 border-[#2d2d52] flex items-center justify-center text-sm font-extrabold text-yellow-400 cursor-pointer hover:border-yellow-400 transition-colors duration-150 shrink-0 select-none",

  // ── Misc ───────────────────────────────────────────────────────
  /** Thin divider line (vertical or horizontal depending on context) */
  divider: "bg-[#1e1e40]",

  /** OR label between cards */
  orLabel:
    "font-['Russo_One'] text-[0.65rem] tracking-widest text-white/20 shrink-0 select-none",
};