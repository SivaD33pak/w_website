"use client";

import { useState, useEffect } from "react";
import { couple, navigationItems } from "@/lib/wedding-content";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map((item) =>
        document.getElementById(item.sectionId)
      );
      const scrollY = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollY) {
          setActiveSection(navigationItems[i].sectionId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      {/* Desktop links */}
      <div className="nav-links hidden items-center md:flex">
        {navigationItems.map((item) => (
          <a
            key={item.sectionId}
            href={item.href}
            className={`nav-link relative font-body ${
              activeSection === item.sectionId ? "nav-link-active" : ""
            }`}
          >
            {item.label}
            {activeSection === item.sectionId && (
              <div className="nav-link-underline absolute bottom-0 left-0 right-0" />
            )}
          </a>
        ))}
      </div>

      {/* Music button (desktop) */}
      <button className="nav-button relative hidden items-center justify-center rounded-full md:flex">
        <div className="nav-button-ring absolute inset-0 rounded-full" />
        <MusicIcon />
      </button>

      {/* Mobile hamburger */}
      <button
        className="flex items-center justify-center md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D8B26E"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {mobileOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 flex w-full flex-col items-center gap-4 bg-[#0e102a]/95 py-6 backdrop-blur-xl md:hidden"
          >
            {navigationItems.map((item) => (
              <a
                key={item.sectionId}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-link font-body text-sm ${
                  activeSection === item.sectionId ? "nav-link-active" : ""
                }`}
              >
                {item.label}
              </a>
            ))}
            <button className="nav-button relative mt-2 flex items-center justify-center rounded-full">
              <div className="nav-button-ring absolute inset-0 rounded-full" />
              <MusicIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
