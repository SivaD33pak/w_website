"use client";

import { venue } from "@/lib/wedding-content";
import { contactData } from "@/lib/wedding-data";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

function HeartSVG({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 11" fill="#C98FA2">
      <path d="M6 10.5C6 10.5 0.5 6.5 0.5 3.5C0.5 1.8 1.8 0.5 3.5 0.5C4.5 0.5 5.3 1 6 1.8C6.7 1 7.5 0.5 8.5 0.5C10.2 0.5 11.5 1.8 11.5 3.5C11.5 6.5 6 10.5 6 10.5Z" />
    </svg>
  );
}

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f8eee7 0%, #181b3a 100%)",
        paddingTop: "clamp(48px, 8vw, 80px)",
        paddingBottom: "clamp(48px, 8vw, 80px)",
      }}
    >
      <motion.div
        className="flex flex-col items-center max-w-xl mx-auto px-6 text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <p className="section-eyebrow font-body text-xs tracking-widest uppercase mb-2">
          FIND US HERE
        </p>
        <h2 className="section-title font-headings text-cream-foreground mb-2">
          Contact
        </h2>
        <div className="divider-row mb-10">
          <div className="gold-divider" />
          <HeartSVG />
          <div className="gold-divider" />
        </div>

        {/* Venue card */}
        <div className="section-card w-full p-8 md:p-10">
          <div className="flex items-center justify-center mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D8B26E"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h3 className="font-headings text-cream-foreground text-xl mb-2">
            {contactData.venue.name}
          </h3>
          <p className="font-body text-cream-foreground text-sm opacity-70 leading-relaxed mb-6">
            {contactData.venue.address}
          </p>

          <a
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-gold transition-colors hover:text-foreground"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            OPEN IN GOOGLE MAPS
          </a>
        </div>

        {/* Email */}
        <a
          href={`mailto:${contactData.email}`}
          className="mt-6 inline-flex items-center gap-2 font-body text-sm text-foreground/70 transition-colors hover:text-gold"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          {contactData.email}
        </a>
      </motion.div>
    </section>
  );
}
