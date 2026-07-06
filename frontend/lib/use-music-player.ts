"use client";

import { useEffect, useState } from "react";

// Background track — served from /public/music.
// Drop your file at frontend/public/music/song.mp3 (or update MUSIC_SRC).
const MUSIC_SRC = "/music/song.mp3";

type Listener = () => void;

/**
 * Singleton audio player shared across the whole app.
 *
 * One <audio> element is created lazily on the client and reused by every
 * component that calls `useMusicPlayer()`. This prevents double-buffering
 * the song when multiple toggles (welcome screen + nav) need to control the
 * same playback, and keeps their icons in sync via a tiny pub/sub layer.
 *
 * Why a module-level singleton rather than React context?
 *  - The audio element must outlive any single component's lifecycle (the
 *    welcome screen unmounts on open; music must keep playing).
 *  - It avoids wrapping the tree in a provider and re-renders are scoped to
 *    subscribed components only.
 */

let audioEl: HTMLAudioElement | null = null;
let listeners: Listener[] = [];
let playingState = false;

function getAudio(): HTMLAudioElement {
  if (typeof window === "undefined") {
    // Should never be reached — hook is client-only. Defensive guard.
    throw new Error("useMusicPlayer used outside the browser");
  }
  if (!audioEl) {
    const el = new Audio(MUSIC_SRC);
    el.loop = true;
    el.preload = "auto";

    const emit = () => {
      playingState = !el.paused && !el.ended;
      listeners.forEach((l) => l());
    };

    el.addEventListener("play", emit);
    el.addEventListener("playing", emit);
    el.addEventListener("pause", emit);
    el.addEventListener("ended", emit);

    audioEl = el;
  }
  return audioEl;
}

function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function playMusic() {
  const el = getAudio();
  // .play() returns a promise that rejects if blocked by autoplay policy.
  // Callers that need a guaranteed user-gesture (e.g. the welcome "open"
  // button) call this from within a click handler.
  el.play().catch(() => {
    // Autoplay blocked — state stays false, listener not updated.
  });
}

export function pauseMusic() {
  const el = getAudio();
  el.pause();
}

export function toggleMusic() {
  const el = getAudio();
  if (el.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
}

export interface MusicPlayer {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

/**
 * Subscribe a component to the shared music player's playing state.
 * Returns controls that all drive the same underlying <audio>.
 */
export function useMusicPlayer(): MusicPlayer {
  const [isPlaying, setIsPlaying] = useState(playingState);

  useEffect(() => {
    // Eagerly create the audio element so it begins preloading on first use.
    getAudio();
    const unsubscribe = subscribe(() => setIsPlaying(playingState));
    // Sync local state in case it was set before this component mounted.
    setIsPlaying(playingState);
    return unsubscribe;
  }, []);

  return {
    isPlaying,
    play: playMusic,
    pause: pauseMusic,
    toggle: toggleMusic,
  };
}
