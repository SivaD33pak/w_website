"use client";

import { Music } from "lucide-react";

interface MusicToggleIconProps {
  /** When true, show a plain music note. When false, add a horizontal strike. */
  isPlaying: boolean;
  size?: number;
}

/**
 * Shared music icon for the welcome screen + nav toggles.
 * - Playing: a clean music note.
 * - Paused/off: the same note with a horizontal strike line across it,
 *   so the "off" state reads clearly at a glance.
 */
export default function MusicToggleIcon({
  isPlaying,
  size = 18,
}: MusicToggleIconProps) {
  return (
    <span className="music-toggle-icon">
      <Music
        size={size}
        strokeWidth={1.7}
        color="#D8B26E"
        className={`nav-music-icon${isPlaying ? "" : " is-muted"}`}
      />
      {!isPlaying && <span className="music-toggle-strike" aria-hidden="true" />}
    </span>
  );
}
