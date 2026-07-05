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

/** Corner ornament with a cross and scrollwork */
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
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flips }}
    >
      {/* Cross */}
      <line x1="16" y1="4" x2="16" y2="28" stroke="#D8B26E" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8" y1="14" x2="24" y2="14" stroke="#D8B26E" strokeWidth="1.8" strokeLinecap="round" />

      {/* Outer scrollwork arm */}
      <path
        d="M28,4 C32,2 40,2 48,4 C52,5 56,8 58,12"
        fill="none"
        stroke="#D8B26E"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M4,28 C2,32 2,40 4,48 C5,52 8,56 12,58"
        fill="none"
        stroke="#D8B26E"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Inner scrollwork accent */}
      <path
        d="M28,12 C34,10 38,12 44,14 C46,14 48,16 48,18"
        fill="none"
        stroke="#D8B26E"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M12,28 C10,34 12,38 14,44 C14,46 16,48 18,48"
        fill="none"
        stroke="#D8B26E"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Fleur-de-lis accent */}
      <circle cx="58" cy="12" r="2" fill="#D8B26E" opacity="0.7" />
      <circle cx="12" cy="58" r="2" fill="#D8B26E" opacity="0.7" />

      {/* Diamond dots */}
      <rect x="38" y="0" width="3" height="3" rx="0.5" transform="rotate(45 39.5 1.5)" fill="#D8B26E" opacity="0.5" />
      <rect x="0" y="38" width="3" height="3" rx="0.5" transform="rotate(45 1.5 39.5)" fill="#D8B26E" opacity="0.5" />
    </svg>
  );
}

/** Side divider with cross and laurel details */
function GoldenSideDivider({ side }: { side: "top" | "bottom" | "left" | "right" }) {
  if (side === "left" || side === "right") {
    const isRight = side === "right";
    return (
      <div className={`golden-side-v ${isRight ? "golden-side-v-right" : "golden-side-v-left"}`}>
        <div className="golden-side-v-line" />
        <svg viewBox="0 0 16 40" className="golden-side-v-cross" xmlns="http://www.w3.org/2000/svg">
          <line x1="8" y1="4" x2="8" y2="36" stroke="#D8B26E" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="4" y1="14" x2="12" y2="14" stroke="#D8B26E" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="5" y1="26" x2="11" y2="26" stroke="#D8B26E" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
        <div className="golden-side-v-line" />
      </div>
    );
  }

  const isBottom = side === "bottom";
  return (
    <div className={`golden-side-h ${isBottom ? "golden-side-h-bottom" : "golden-side-h-top"}`}>
      <div className="golden-side-h-line" />
      <svg viewBox="0 0 40 16" className="golden-side-h-cross" xmlns="http://www.w3.org/2000/svg">
        <line x1="4" y1="8" x2="36" y2="8" stroke="#D8B26E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="14" y1="4" x2="14" y2="12" stroke="#D8B26E" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="26" y1="5" x2="26" y2="11" stroke="#D8B26E" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
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
