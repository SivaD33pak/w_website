"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, Music } from "lucide-react";
import { couple } from "@/lib/wedding-content";

// Background track lives in /public/music and is served from /music/...
// Drop your file at frontend/public/music/song.mp3 (or update MUSIC_SRC below).
const MUSIC_SRC = "/music/song.mp3";

function CrossIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 20 26"
      fill="none"
    >
      <line x1="10" y1="0" x2="10" y2="26" stroke="#D8B26E" strokeWidth="1.8" />
      <line x1="3" y1="7" x2="17" y2="7" stroke="#D8B26E" strokeWidth="1.8" />
    </svg>
  );
}

export default function WeddingNav() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Autoplay the moment the user first interacts. Browsers block sound
  // before interaction, so we try once on mount and, if blocked, wait for
  // the first click / tap / scroll / keydown on the page to start playback.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let interactionHandlers: Array<{
      event: string;
      handler: (e: Event) => void;
    }> = [];

    const clearInteractionListeners = () => {
      interactionHandlers.forEach(({ event, handler }) => {
        window.removeEventListener(event, handler);
      });
      interactionHandlers = [];
    };

    const startPlayback = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          clearInteractionListeners();
        })
        .catch(() => {
          // Autoplay blocked — keep silent until the user interacts.
          setIsPlaying(false);
        });
    };

    // First interaction: kick off audio then detach all listeners.
    const onFirstInteraction = () => {
      startPlayback();
      clearInteractionListeners();
    };

    // Try immediately; if the browser refuses, fall back to first gesture.
    startPlayback();

    if (!isPlaying) {
      const events = ["click", "touchstart", "keydown", "scroll", "wheel"];
      events.forEach((event) => {
        window.addEventListener(event, onFirstInteraction, { once: true, passive: true });
        interactionHandlers.push({ event, handler: onFirstInteraction });
      });
    }

    return clearInteractionListeners;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Keep state in sync if the browser or media controls change playback
  // (e.g. iOS media overlay, other tabs pausing, etc.).
  const syncFromAudio = () => {
    const audio = audioRef.current;
    if (audio) setIsPlaying(!audio.paused && !audio.ended);
  };

  return (
    <nav className="site-nav fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 md:px-14">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="nav-badge relative flex items-center justify-center">
          <div className="nav-badge-ring absolute inset-0 rounded-full" />
          <CrossIcon />
          <div className="nav-badge-dot-gold absolute" />
          <div className="nav-badge-dot-rose absolute" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="nav-brand-name font-headings text-gold">
            {couple.displayName}
          </span>
          <span className="nav-brand-subtitle font-body text-foreground">
            WEDDING 2026
          </span>
        </div>
      </div>

      {/* Hidden but functional audio element */}
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        preload="auto"
        onPlay={syncFromAudio}
        onPause={syncFromAudio}
      />

      {/* Music toggle button */}
      <button
        type="button"
        className={`nav-button relative flex items-center justify-center rounded-full${
          isPlaying ? " is-playing" : ""
        }`}
        onClick={togglePlay}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
        title={isPlaying ? "Pause music" : "Play music"}
      >
        <div className="nav-button-ring absolute inset-0 rounded-full" />
        {isPlaying ? (
          <Music
            size={18}
            strokeWidth={1.7}
            color="#D8B26E"
            className="nav-music-icon"
          />
        ) : (
          <Music2
            size={18}
            strokeWidth={1.7}
            color="#D8B26E"
            className="nav-music-icon"
          />
        )}
      </button>
    </nav>
  );
}
