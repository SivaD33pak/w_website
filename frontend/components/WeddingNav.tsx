"use client";

import { couple } from "@/lib/wedding-content";

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

function MusicIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D8B26E"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export default function WeddingNav() {
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

      {/* Music button (fixed, always visible) */}
      <button className="nav-button relative flex items-center justify-center rounded-full">
        <div className="nav-button-ring absolute inset-0 rounded-full" />
        <MusicIcon />
      </button>
    </nav>
  );
}
