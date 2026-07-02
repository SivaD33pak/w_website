"use client";

import { useEffect, useState } from "react";
import { events as localEvents } from "@/lib/wedding-content";
import { getEnrichedEvents, type LocalEvent } from "@/lib/api-data";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
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

export default function EventsSection() {
  // Seed with local data so SSR + first paint render immediately, then swap in
  // the API-merged data when NEXT_PUBLIC_USE_API_DATA is enabled.
  const [events, setEvents] = useState<LocalEvent[]>([...localEvents]);

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
      className="section-paper relative w-full overflow-hidden"
    >
      {/* Background pattern image */}
      <div className="absolute inset-0" style={{ pointerEvents: "none", zIndex: 0 }}>
        <div
          className="w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(216,178,110,0.03) 0%, rgba(201,143,162,0.05) 50%, rgba(216,178,110,0.03) 100%)",
          }}
        />
      </div>

      <motion.div
        className="relative flex flex-col items-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <p className="section-eyebrow font-body text-xs tracking-widest uppercase mb-2">
          JOIN US FOR
        </p>
        <h2 className="section-title font-headings text-cream-foreground mb-2">
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
                <div className="event-card flex flex-col items-center p-6 md:p-8">
                  <div className="mb-4">
                    <Icon />
                  </div>
                  <h3 className="event-card-title font-body font-semibold text-cream-foreground text-sm tracking-widest text-center uppercase">
                    {event.title}
                  </h3>
                  <div className="event-divider" />
                  <p className="font-body text-xs text-cream-foreground text-center tracking-wider mb-1 font-medium">
                    {event.date}
                  </p>
                  <p className="event-date font-body text-xs text-cream-foreground text-center tracking-wider mb-4">
                    {event.time}
                  </p>
                  <p className="event-venue font-body text-xs text-center font-semibold mb-1">
                    {event.venue}
                  </p>
                  <p className="event-location font-body text-center">
                    {event.location}
                  </p>
                </div>

                {/* Timeline dot between cards (desktop horizontal layout only) */}
                {i < events.length - 1 && (
                  <div className="flex items-center mx-4 hidden md:flex" style={{ zIndex: 2 }}>
                    <div className="event-dot rounded-full flex items-center justify-center">
                      <div className="event-dot-inner rounded-full bg-cream" />
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
