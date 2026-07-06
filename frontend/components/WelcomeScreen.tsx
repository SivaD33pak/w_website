"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { playMusic, useMusicPlayer } from "@/lib/use-music-player";
import MusicToggleIcon from "@/components/MusicToggleIcon";

// Images live in /public/welcome. Drop your files there and adjust the names
// below if yours differ.
const WELCOME_BG = "/welcome/welcome-bg.png";
const WELCOME_TEXT = "/welcome/welcome-text.png";

interface WelcomeScreenProps {
  onOpen: () => void;
}

export default function WelcomeScreen({ onOpen }: WelcomeScreenProps) {
  const { isPlaying, toggle } = useMusicPlayer();

  const handleOpen = () => {
    // This click is a valid user gesture — autoplay policies are satisfied,
    // so the song reliably starts here across all browsers.
    playMusic();
    onOpen();
  };

  // The overlay itself opens on tap. Clicks on the music button must NOT
  // bubble up to the overlay, or toggling music would also open the site.
  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Extra safety: ignore clicks originating from any interactive control
    // inside the overlay (the music button today, anything added later).
    const target = e.target as HTMLElement;
    if (target.closest("[data-no-open]")) return;
    handleOpen();
  };

  // Allow Esc / Enter to open as a keyboard alternative.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        handleOpen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="welcome-overlay"
      style={{ backgroundImage: `url(${WELCOME_BG})` }}
      onClick={onOverlayClick}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
    >
      {/* Subtle vignette for text legibility over busy backgrounds */}
      <div className="welcome-vignette" aria-hidden="true" />

      {/* Centered welcome text image */}
      <motion.div
        className="welcome-text-wrap"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={WELCOME_TEXT}
          alt="Sushmi & Nijin — welcome"
          className="welcome-text-img"
        />
      </motion.div>

      {/* Bottom-center: "Tap To Open" — purely visual indicator.
          The whole overlay is the actual tap target (see onOverlayClick). */}
      <motion.div
        className="welcome-open-btn"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <span className="welcome-open-text">TAP TO OPEN</span>
        <span className="welcome-open-line" aria-hidden="true" />
      </motion.div>

      {/* Bottom-left: music toggle. data-no-open stops taps here from
          opening the site. */}
      <button
        type="button"
        data-no-open
        className={`welcome-music-btn${isPlaying ? " is-playing" : ""}`}
        onClick={toggle}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
        title={isPlaying ? "Pause music" : "Play music"}
      >
        <MusicToggleIcon isPlaying={isPlaying} />
      </button>
    </motion.div>
  );
}
