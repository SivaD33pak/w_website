"use client";

import Image from "next/image";
import { couple } from "@/lib/wedding-content";
import { heroData } from "@/lib/wedding-data";
import { motion } from "framer-motion";

function ScrollIndicator() {
  return (
    <motion.div
      className="hero-scroll-indicator flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 2.2 }}
    >
      <span className="hero-scroll-label">
        Scroll
      </span>
      <motion.div
        className="text-hero-secondary"
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

      {/* Subtle radial dark overlay behind the text only — improves
          readability without tinting the whole background image. */}
      <div className="hero-text-glow" />

      {/* Content */}
      <div className="hero-content relative flex flex-col items-center text-center">
        {/* Top caption — "TOGETHER WITH THEIR FAMILIES" */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="hero-caption font-hero-caption text-hero-secondary">
            {heroData.kicker}
          </p>
          <div className="hero-caption-divider" />
        </motion.div>

        {/* Bride name */}
        <motion.h1
          className="hero-name font-hero text-hero-primary"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {couple.brideFullName}
        </motion.h1>

        {/* Script "and" — generous spacing around it for editorial breathing room */}
        <motion.div
          className="my-7 flex items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="hero-name-line" />
          <span className="hero-and-script font-hero-script text-gold">and</span>
          <div className="hero-name-line" />
        </motion.div>

        {/* Groom name */}
        <motion.h1
          className="hero-name font-hero text-hero-primary"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95 }}
        >
          {couple.groomFullName}
        </motion.h1>

        {/* Bible verse — extra top margin for luxury separation */}
        <motion.div
          className="mt-16 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          <p className="hero-verse-quote font-hero italic text-hero-verse">
            {heroData.quote}
          </p>
          <p className="hero-verse-ref font-hero-caption text-gold mt-5">
            {heroData.quoteRef}
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator at bottom center */}
      <ScrollIndicator />
    </section>
  );
}
