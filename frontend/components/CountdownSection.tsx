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
      <div className="flex flex-col items-center px-6 md:px-14">
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

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-countdown relative w-full overflow-hidden"
    >
      {/* Star particles (decorative dots) */}
      <div className="absolute inset-0">
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
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(68, 53, 91, 0.6) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="relative flex flex-col items-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <p className="section-eyebrow-muted section-eyebrow font-body text-foreground text-xs tracking-widest uppercase mb-2">
          COUNTING DOWN TO OUR BIG DAY
        </p>

        <div className="flex items-center gap-3 mb-12">
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

        <div className="flex items-center gap-0" suppressHydrationWarning>
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
    </section>
  );
}
