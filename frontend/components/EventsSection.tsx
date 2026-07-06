"use client";

import { useEffect, useMemo, useState } from "react";
import { events as localEvents } from "@/lib/wedding-content";
import { getEnrichedEvents, type LocalEvent } from "@/lib/api-data";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { generateStars, generateSparkles } from "@/lib/stars";
import Image from "next/image";

function HeartSVG({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 11" fill="#C98FA2">
      <path d="M6 10.5C6 10.5 0.5 6.5 0.5 3.5C0.5 1.8 1.8 0.5 3.5 0.5C4.5 0.5 5.3 1 6 1.8C6.7 1 7.5 0.5 8.5 0.5C10.2 0.5 11.5 1.8 11.5 3.5C11.5 6.5 6 10.5 6 10.5Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D8B26E"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M9 16l2 2 4-4" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D8B26E"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="9" r="3" />
      <circle cx="15" cy="9" r="3" />
      <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
      <path d="M12 12v9" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D8B26E"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 22V12M16 22V12M12 2l1.5 4.5h4.7L14.7 9l1.5 4.5L12 11l-4.2 2.5L9.3 9 5.8 6.5h4.7L12 2z" />
    </svg>
  );
}

const icons = [CalendarIcon, PeopleIcon, StarIcon];

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

export default function EventsSection() {
  // Seed with local data so SSR + first paint render immediately, then swap in
  // the API-merged data when NEXT_PUBLIC_USE_API_DATA is enabled.
  const [events, setEvents] = useState<LocalEvent[]>([...localEvents]);

  // Deterministic star field — memoized so it is stable across re-renders and
  // renders identically on server and client (no hydration mismatch).
  const stars = useMemo(() => generateStars(60, 7), []);
  const sparkles = useMemo(() => generateSparkles(6, 19), []);

  useEffect(() => {
    let active = true;
    getEnrichedEvents().then((data) => {
      if (active) setEvents(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="events"
      className="section-events relative w-full overflow-hidden"
    >
      {/* ── Magical night-sky background ── */}
      {/* Nebula glows for depth */}
      <div
        className="events-nebula"
        style={{
          top: "10%",
          left: "12%",
          width: "40vw",
          height: "40vw",
          maxWidth: 420,
          maxHeight: 420,
          background:
            "radial-gradient(circle, rgba(216,178,110,0.16) 0%, transparent 70%)",
        }}
      />
      <div
        className="events-nebula"
        style={{
          bottom: "8%",
          right: "10%",
          width: "38vw",
          height: "38vw",
          maxWidth: 380,
          maxHeight: 380,
          background:
            "radial-gradient(circle, rgba(201,143,162,0.14) 0%, transparent 70%)",
        }}
      />

      {/* Twinkling star field */}
      <div className="events-stars">
        {stars.map((s, i) => (
          <div
            key={`star-${i}`}
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

        {/* Larger 4-point sparkle stars */}
        {sparkles.map((sp, i) => (
          <div
            key={`sparkle-${i}`}
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
        className="relative flex flex-col items-center"
        style={{ zIndex: 2 }}
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <p className="section-eyebrow font-body text-xs tracking-widest uppercase mb-2">
          JOIN US FOR
        </p>
        <h2 className="section-title font-headings mb-2" style={{ color: "#f6f0e8" }}>
          Events
        </h2>
        <div className="divider-row mb-12">
          <div className="gold-divider" />
          <HeartSVG />
          <div className="gold-divider" />
        </div>

        <motion.div
          className="flex flex-wrap items-stretch justify-center gap-6 relative px-4 md:px-20 md:gap-0"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Timeline line */}
          <div
            className="absolute top-1/2 left-4 right-4 hidden md:block"
            style={{
              height: 1,
              background:
                "linear-gradient(to right, transparent, #d8b26e 20%, #d8b26e 80%, transparent)",
              zIndex: 0,
            }}
          />

          {events.map((event, i) => {
            const Icon = icons[i] || CalendarIcon;
            return (
              <motion.div
                key={event.id}
                className="flex items-center"
                style={{ zIndex: 1 }}
                variants={staggerItem}
              >
                <div className="event-card-dark flex flex-col items-center p-6 md:p-8">
                  <div className="mb-4">
                    <Icon />
                  </div>
                  <h3 className="event-card-title-dark font-body font-semibold text-sm tracking-widest text-center uppercase">
                    {event.title}
                  </h3>
                  <div className="event-divider" />
                  <p className="font-body text-xs text-center tracking-wider mb-1 font-medium" style={{ color: "#f6f0e8" }}>
                    {event.date}
                  </p>
                  <p className="event-date font-body text-xs text-center tracking-wider mb-4" style={{ color: "rgba(246,240,232,0.7)" }}>
                    {event.time}
                  </p>
                  <p className="event-venue-dark font-body text-xs text-center font-semibold mb-1">
                    {event.venue}
                  </p>
                  <p className="event-location-dark font-body text-center">
                    {event.location}
                  </p>
                </div>

                {/* Timeline dot between cards (desktop horizontal layout only) */}
                {i < events.length - 1 && (
                  <div className="flex items-center mx-4 hidden md:flex" style={{ zIndex: 2 }}>
                    <div className="event-dot rounded-full flex items-center justify-center">
                      <div className="event-dot-inner rounded-full" style={{ background: "#2c1e3a" }} />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
