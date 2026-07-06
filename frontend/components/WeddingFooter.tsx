"use client";

import { useMemo } from "react";
import { couple, weddingDate, bibleVerse } from "@/lib/wedding-content";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { generateStars, generateSparkles } from "@/lib/stars";

function CrossIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.28} viewBox="0 0 28 36" fill="none">
      <line x1="14" y1="0" x2="14" y2="36" stroke="#D8B26E" strokeWidth="2.5" />
      <line x1="4" y1="10" x2="24" y2="10" stroke="#D8B26E" strokeWidth="2.5" />
    </svg>
  );
}

function HeartSVG({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 11" fill="#C98FA2">
      <path d="M6 10.5C6 10.5 0.5 6.5 0.5 3.5C0.5 1.8 1.8 0.5 3.5 0.5C4.5 0.5 5.3 1 6 1.8C6.7 1 7.5 0.5 8.5 0.5C10.2 0.5 11.5 1.8 11.5 3.5C11.5 6.5 6 10.5 6 10.5Z" />
    </svg>
  );
}

/** A 4-point sparkle star for the background field. */
function FieldSparkle({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6,0 L7,5 L12,6 L7,7 L6,12 L5,7 L0,6 L5,5 Z"
        fill="#D8B26E"
      />
    </svg>
  );
}

export default function WeddingFooter() {
  const stars = useMemo(() => generateStars(40, 77), []);
  const sparkles = useMemo(() => generateSparkles(4, 91), []);

  return (
    <footer className="section-footer w-full relative overflow-hidden">
      {/* Nebula glows for depth */}
      <div
        className="events-nebula"
        style={{
          top: "20%",
          left: "15%",
          width: "30vw",
          height: "30vw",
          maxWidth: 300,
          maxHeight: 300,
          background:
            "radial-gradient(circle, rgba(216,178,110,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="events-nebula"
        style={{
          bottom: "15%",
          right: "12%",
          width: "28vw",
          height: "28vw",
          maxWidth: 280,
          maxHeight: 280,
          background:
            "radial-gradient(circle, rgba(201,143,162,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Twinkling star field */}
      <div className="events-stars">
        {stars.map((s, i) => (
          <div
            key={`footer-star-${i}`}
            className={`events-star${s.tier >= 2 ? " gold" : ""}`}
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
        {sparkles.map((sp, i) => (
          <div
            key={`footer-sparkle-${i}`}
            className="events-sparkle"
            style={{
              top: `${sp.top}%`,
              left: `${sp.left}%`,
              animationDuration: `${sp.duration}s`,
              animationDelay: `${sp.delay}s`,
            }}
          >
            <FieldSparkle size={sp.size} />
          </div>
        ))}
      </div>

      <motion.div
        className="flex flex-col items-center gap-4 relative"
        style={{ zIndex: 2 }}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Divider */}
        <div className="w-full flex justify-center mb-10">
          <div className="footer-divider" />
        </div>

        {/* Cross */}
        <CrossIcon />

        {/* Names */}
        <h3 className="footer-title font-headings text-foreground">
          {couple.brideFirstName}
          <span className="footer-ampersand"> &amp; </span>
          {couple.groomFirstName}
        </h3>

        {/* Date */}
        <p className="footer-date font-body text-xs tracking-widest uppercase">
          {weddingDate.footerDisplay}
        </p>

        {/* Verse — same styling as the original BibleVerseSection */}
        <div className="mt-8 text-center max-w-2xl px-8">
          <p
            className="font-headings text-foreground leading-loose mb-6"
            style={{
              fontSize: "clamp(20px, 3vw, 28px)",
              fontStyle: "italic",
              fontWeight: 400,
              lineHeight: 1.7,
              textShadow: "0 0 30px rgba(216, 178, 110, 0.2)",
            }}
          >
            I have found the one whom <span className="text-gold">my soul loves</span>.
          </p>
          <div className="flex items-center justify-center gap-4 mb-2">
            <div
              style={{
                width: 60,
                height: 1,
                background: "rgba(216, 178, 110, 0.5)",
              }}
            />
            <HeartSVG />
            <div
              style={{
                width: 60,
                height: 1,
                background: "rgba(216, 178, 110, 0.5)",
              }}
            />
          </div>
          <cite className="font-body text-gold text-sm tracking-widest not-italic" style={{ opacity: 0.9 }}>
            – {bibleVerse.reference}
          </cite>
        </div>
      </motion.div>
    </footer>
  );
}
