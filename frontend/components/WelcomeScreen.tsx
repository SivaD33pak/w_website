"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Music2, Music } from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import { playMusic, useMusicPlayer } from "@/lib/use-music-player";

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

      {/* Bottom-center: Tap To Open */}
      <motion.button
        type="button"
        className="welcome-open-btn"
        onClick={handleOpen}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        aria-label="Tap to open the wedding invitation"
      >
        <span className="welcome-open-text">TAP TO OPEN</span>
        <span className="welcome-open-line" aria-hidden="true" />
      </motion.button>

      {/* Bottom-left: music toggle, default on (started on open) */}
      <button
        type="button"
        className={`welcome-music-btn${
          isPlaying ? " is-playing" : ""
        }`}
        onClick={toggle}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
        title={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Music size={18} strokeWidth={1.7} color="#D8B26E" className="nav-music-icon" />
        ) : (
          <Music2 size={18} strokeWidth={1.7} color="#D8B26E" className="nav-music-icon" />
        )}
      </button>
    </motion.div>
  );
}
