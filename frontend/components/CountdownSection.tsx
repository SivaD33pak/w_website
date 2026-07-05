"use client";

import { useState, useEffect, useRef } from "react";
import { weddingDate } from "@/lib/wedding-content";
import { motion } from "framer-motion";
import { fadeInUp, digitFlip } from "@/lib/animations";
import { generateParticles } from "@/lib/particles";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function HeartSVG({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 11" fill="#C98FA2">
      <path d="M6 10.5C6 10.5 0.5 6.5 0.5 3.5C0.5 1.8 1.8 0.5 3.5 0.5C4.5 0.5 5.3 1 6 1.8C6.7 1 7.5 0.5 8.5 0.5C10.2 0.5 11.5 1.8 11.5 3.5C11.5 6.5 6 10.5 6 10.5Z" />
    </svg>
  );
}

/* ── Golden Border Ornament Components ──────────────────── */

/** Ornate corner ornament: large cross with rays, layered scrollwork,
 *  fleur-de-lis, gem diamonds, and beaded accents. */
function GoldenCorner({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const flips =
    position === "top-right"
      ? "scaleX(-1)"
      : position === "bottom-left"
        ? "scaleY(-1)"
        : position === "bottom-right"
          ? "scale(-1)"
          : "none";

  return (
    <svg
      className="golden-corner"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flips }}
    >
      {/* Radiating halo behind the cross */}
      <circle cx="22" cy="22" r="20" fill="none" stroke="#D8B26E" strokeWidth="0.6" opacity="0.25" />
      <circle cx="22" cy="22" r="14" fill="none" stroke="#D8B26E" strokeWidth="0.5" opacity="0.35" />

      {/* Cross rays (subtle spiritual light) */}
      <g opacity="0.4" stroke="#D8B26E" strokeWidth="0.5" strokeLinecap="round">
        <line x1="22" y1="2" x2="22" y2="8" />
        <line x1="22" y1="36" x2="22" y2="42" />
        <line x1="2" y1="22" x2="8" y2="22" />
        <line x1="36" y1="22" x2="42" y2="22" />
      </g>

      {/* Main cross — bolder */}
      <line x1="22" y1="6" x2="22" y2="40" stroke="#D8B26E" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="10" y1="20" x2="34" y2="20" stroke="#D8B26E" strokeWidth="2.4" strokeLinecap="round" />
      {/* Cross base accent */}
      <line x1="14" y1="28" x2="30" y2="28" stroke="#D8B26E" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

      {/* Outer scrollwork arm (large flourish) */}
      <path
        d="M40,6 C50,2 64,2 76,6 C84,9 90,14 94,22"
        fill="none"
        stroke="#D8B26E"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M6,40 C2,50 2,64 6,76 C9,84 14,90 22,94"
        fill="none"
        stroke="#D8B26E"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Mid scrollwork — secondary flourish */}
      <path
        d="M44,14 C52,12 60,14 68,18 C72,20 75,23 76,27"
        fill="none"
        stroke="#D8B26E"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M14,44 C12,52 14,60 18,68 C20,72 23,75 27,76"
        fill="none"
        stroke="#D8B26E"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.65"
      />

      {/* Inner delicate filigree */}
      <path
        d="M48,24 C54,22 58,25 62,28 C64,29 65,31 65,33"
        fill="none"
        stroke="#D8B26E"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M24,48 C22,54 25,58 28,62 C29,64 31,65 33,65"
        fill="none"
        stroke="#D8B26E"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Fleur-de-lis accent gems (filled) */}
      <circle cx="94" cy="22" r="3" fill="#D8B26E" opacity="0.8" />
      <circle cx="94" cy="22" r="1.2" fill="#F6F0E8" opacity="0.9" />
      <circle cx="22" cy="94" r="3" fill="#D8B26E" opacity="0.8" />
      <circle cx="22" cy="94" r="1.2" fill="#F6F0E8" opacity="0.9" />

      {/* Smaller bead accents along scrollwork */}
      <circle cx="76" cy="6" r="1.5" fill="#D8B26E" opacity="0.7" />
      <circle cx="6" cy="76" r="1.5" fill="#D8B26E" opacity="0.7" />

      {/* Diamond gem accents (rotated squares) */}
      <rect x="58" y="0" width="4" height="4" rx="0.6" transform="rotate(45 60 2)" fill="#D8B26E" opacity="0.6" />
      <rect x="0" y="58" width="4" height="4" rx="0.6" transform="rotate(45 2 60)" fill="#D8B26E" opacity="0.6" />

      {/* Beaded row near the edges */}
      <g fill="#D8B26E" opacity="0.55">
        <circle cx="50" cy="3" r="0.8" />
        <circle cx="54" cy="2.5" r="0.7" />
        <circle cx="62" cy="2.5" r="0.7" />
        <circle cx="66" cy="3" r="0.8" />
        <circle cx="3" cy="50" r="0.8" />
        <circle cx="2.5" cy="54" r="0.7" />
        <circle cx="2.5" cy="62" r="0.7" />
        <circle cx="3" cy="66" r="0.8" />
      </g>
    </svg>
  );
}

/** Small sparkle/star accent for magical glow along the frame */
function GoldenSparkle({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6,0 L7,5 L12,6 L7,7 L6,12 L5,7 L0,6 L5,5 Z"
        fill="#D8B26E"
        opacity="0.8"
      />
    </svg>
  );
}

/** Side divider with cross, laurel details, and central gem */
function GoldenSideDivider({ side }: { side: "top" | "bottom" | "left" | "right" }) {
  if (side === "left" || side === "right") {
    const isRight = side === "right";
    return (
      <div className={`golden-side-v ${isRight ? "golden-side-v-right" : "golden-side-v-left"}`}>
        <div className="golden-side-v-line" />
        <svg viewBox="0 0 24 60" className="golden-side-v-cross" xmlns="http://www.w3.org/2000/svg">
          {/* Laurel leaves flanking the cross */}
          <path d="M4,20 Q8,24 12,22" fill="none" stroke="#D8B26E" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
          <path d="M20,20 Q16,24 12,22" fill="none" stroke="#D8B26E" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
          <path d="M4,40 Q8,36 12,38" fill="none" stroke="#D8B26E" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
          <path d="M20,40 Q16,36 12,38" fill="none" stroke="#D8B26E" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
          {/* Cross */}
          <line x1="12" y1="8" x2="12" y2="52" stroke="#D8B26E" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="6" y1="22" x2="18" y2="22" stroke="#D8B26E" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="8" y1="36" x2="16" y2="36" stroke="#D8B26E" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          {/* Central gem */}
          <circle cx="12" cy="29" r="2" fill="#D8B26E" opacity="0.85" />
          <circle cx="12" cy="29" r="0.8" fill="#F6F0E8" opacity="0.9" />
        </svg>
        <div className="golden-side-v-line" />
      </div>
    );
  }

  const isBottom = side === "bottom";
  return (
    <div className={`golden-side-h ${isBottom ? "golden-side-h-bottom" : "golden-side-h-top"}`}>
      <div className="golden-side-h-line" />
      <svg viewBox="0 0 60 24" className="golden-side-h-cross" xmlns="http://www.w3.org/2000/svg">
        {/* Laurel leaves */}
        <path d="M20,4 Q24,8 22,12" fill="none" stroke="#D8B26E" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
        <path d="M20,20 Q24,16 22,12" fill="none" stroke="#D8B26E" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
        <path d="M40,4 Q36,8 38,12" fill="none" stroke="#D8B26E" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
        <path d="M40,20 Q36,16 38,12" fill="none" stroke="#D8B26E" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
        {/* Cross */}
        <line x1="8" y1="12" x2="52" y2="12" stroke="#D8B26E" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="22" y1="6" x2="22" y2="18" stroke="#D8B26E" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="36" y1="7" x2="36" y2="17" stroke="#D8B26E" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        {/* Central gem */}
        <circle cx="29" cy="12" r="2" fill="#D8B26E" opacity="0.85" />
        <circle cx="29" cy="12" r="0.8" fill="#F6F0E8" opacity="0.9" />
      </svg>
      <div className="golden-side-h-line" />
    </div>
  );
}

function getTargetDate(): Date {
  return new Date(`${weddingDate.isoDate}T00:00:00+05:30`);
}

function calcTimeLeft(target: Date) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownUnit({
  value,
  label,
  isLast,
}: {
  value: number;
  label: string;
  isLast: boolean;
}) {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center px-4 sm:px-6 md:px-14">
        <motion.span
          variants={digitFlip}
          initial="initial"
          animate="animate"
          className="font-headings text-foreground"
          style={{
            fontSize: "clamp(40px, 8vw, 80px)",
            lineHeight: 1,
            fontWeight: 300,
            textShadow: "0 0 40px rgba(216, 178, 110, 0.4)",
          }}
        >
          {String(value).padStart(2, "0")}
        </motion.span>
        <span
          className="font-body text-gold text-xs tracking-widest uppercase mt-2"
          style={{ letterSpacing: "0.2em", opacity: 0.9 }}
        >
          {label}
        </span>
      </div>
      {!isLast && (
        <div
          className="hidden md:block"
          style={{
            width: 1,
            height: 80,
            background: "rgba(216, 178, 110, 0.3)",
          }}
        />
      )}
    </div>
  );
}

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft(getTargetDate()));
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const particles = generateParticles(30, 42);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(getTargetDate()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0.8 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "center center",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    // Scoped cleanup: only reverts animations/ScrollTriggers created in this
    // context, leaving other sections' triggers intact.
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-countdown relative w-full overflow-hidden"
    >
      {/* ── Golden Ornamental Frame (fills the section edge-to-edge) ── */}
      <div className="golden-frame relative w-full">
        {/* Star particles (decorative dots) */}
        <div className="absolute inset-0 z-0">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-foreground"
              style={{
                width: `${p.width}px`,
                height: `${p.height}px`,
                top: `${p.top}%`,
                left: `${p.left}%`,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>

        {/* Bottom radial glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(68, 53, 91, 0.6) 0%, transparent 70%)",
          }}
        />

        {/* Corner ornaments — flush to the section edges */}
        <div className="golden-corner-tl"><GoldenCorner position="top-left" /></div>
        <div className="golden-corner-tr"><GoldenCorner position="top-right" /></div>
        <div className="golden-corner-bl"><GoldenCorner position="bottom-left" /></div>
        <div className="golden-corner-br"><GoldenCorner position="bottom-right" /></div>

        {/* Side dividers */}
        <GoldenSideDivider side="top" />
        <GoldenSideDivider side="bottom" />
        <GoldenSideDivider side="left" />
        <GoldenSideDivider side="right" />

        {/* Magical sparkles scattered along the frame edges */}
        <div className="golden-sparkle golden-sparkle-1"><GoldenSparkle size={10} /></div>
        <div className="golden-sparkle golden-sparkle-2"><GoldenSparkle size={7} /></div>
        <div className="golden-sparkle golden-sparkle-3"><GoldenSparkle size={9} /></div>
        <div className="golden-sparkle golden-sparkle-4"><GoldenSparkle size={7} /></div>

        {/* Inner glow */}
        <div className="golden-frame-glow" />

        {/* Content inside the frame — vertical breathing room lives here */}
        <motion.div
          className="golden-frame-content relative flex flex-col items-center w-full py-12 px-4 sm:px-8 md:py-16 md:px-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Elegant wedding date display */}
          <div className="countdown-date-display flex flex-col items-center mb-8 md:mb-10">
            <span className="countdown-date-day font-headings text-foreground">
              {weddingDate.day}
            </span>
            <div className="countdown-date-divider" />
            <span className="countdown-date-month font-body text-gold tracking-widest uppercase">
              {weddingDate.monthYear}
            </span>
            <span className="countdown-date-weekday font-body text-foreground tracking-widest uppercase">
              {weddingDate.weekday}
            </span>
          </div>

          <p className="section-eyebrow-muted section-eyebrow font-body text-foreground text-xs tracking-widest uppercase mb-2">
            COUNTING DOWN TO OUR BIG DAY
          </p>

          <div className="flex items-center gap-3 mb-8 md:mb-12">
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

          <div className="flex flex-wrap items-center justify-center gap-y-4" suppressHydrationWarning>
            <CountdownUnit value={mounted ? timeLeft.days : 0} label="DAYS" isLast={false} />
            <CountdownUnit value={mounted ? timeLeft.hours : 0} label="HOURS" isLast={false} />
            <CountdownUnit value={mounted ? timeLeft.minutes : 0} label="MINUTES" isLast={false} />
            <CountdownUnit
              value={mounted ? timeLeft.seconds : 0}
              label="SECONDS"
              isLast={true}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
