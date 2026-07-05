"use client";

import Image from "next/image";
import { couple, weddingDate } from "@/lib/wedding-content";
import { heroData } from "@/lib/wedding-data";
import { motion } from "framer-motion";

function HeartSVG({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 11" fill="#C98FA2">
      <path d="M6 10.5C6 10.5 0.5 6.5 0.5 3.5C0.5 1.8 1.8 0.5 3.5 0.5C4.5 0.5 5.3 1 6 1.8C6.7 1 7.5 0.5 8.5 0.5C10.2 0.5 11.5 1.8 11.5 3.5C11.5 6.5 6 10.5 6 10.5Z" />
    </svg>
  );
}

function CrossIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.33} viewBox="0 0 12 16" fill="none">
      <line x1="6" y1="0" x2="6" y2="16" stroke="#D8B26E" strokeWidth="1.5" />
      <line x1="1" y1="5" x2="11" y2="5" stroke="#D8B26E" strokeWidth="1.5" />
    </svg>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      className="hero-scroll-indicator flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 2.2 }}
    >
      <span className="hero-scroll-label font-body text-foreground tracking-widest uppercase">
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-foreground"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section
      id="home"
      className="hero-shell relative w-full overflow-hidden"
    >
      {/* Single hero background image */}
      <Image
        src="/hero/hero-background.png"
        alt="Wedding hero background"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />

      {/* Raw hero background — no overlay gradient */}

      {/* Content */}
      <div className="hero-content relative flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="hero-kicker font-body uppercase text-foreground mb-3">
            {heroData.kicker}
          </p>
        </motion.div>

        <motion.div
          className="mb-5 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="hero-kicker-line hero-kicker-line-right" />
          <CrossIcon />
          <div className="hero-kicker-line hero-kicker-line-left" />
        </motion.div>

        <motion.h1
          className="hero-title font-headings text-foreground"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {couple.brideFullName}
        </motion.h1>

        <motion.div
          className="my-1 flex items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="hero-line hero-line-right" />
          <span className="hero-and font-headings text-gold">and</span>
          <div className="hero-line hero-line-left" />
        </motion.div>

        <motion.h1
          className="hero-title font-headings text-foreground"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {couple.groomFullName}
        </motion.h1>

        <motion.div
          className="mt-7 px-6"
          style={{ maxWidth: 520 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <p className="hero-quote font-headings text-foreground leading-relaxed">
            {heroData.quote}
          </p>
          <p className="hero-verse font-body text-foreground mt-2">
            {heroData.quoteRef}
          </p>
        </motion.div>

        <motion.div
          className="mt-6 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <div className="hero-heart-line" />
          <HeartSVG />
          <div className="hero-heart-line" />
        </motion.div>
      </div>

      {/* Scroll indicator at bottom center */}
      <ScrollIndicator />
    </section>
  );
}
