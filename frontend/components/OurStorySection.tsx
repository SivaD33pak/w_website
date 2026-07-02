"use client";

import { useRef } from "react";
import Image from "next/image";
import { storyLines, images } from "@/lib/wedding-content";
import { motion } from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";
import { useParallax } from "@/lib/use-parallax";

function HeartSVG({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 11" fill="#C98FA2">
      <path d="M6 10.5C6 10.5 0.5 6.5 0.5 3.5C0.5 1.8 1.8 0.5 3.5 0.5C4.5 0.5 5.3 1 6 1.8C6.7 1 7.5 0.5 8.5 0.5C10.2 0.5 11.5 1.8 11.5 3.5C11.5 6.5 6 10.5 6 10.5Z" />
    </svg>
  );
}

function StoryCrossIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 24 30" fill="none">
      <line x1="12" y1="0" x2="12" y2="30" stroke="#D8B26E" strokeWidth="2" />
      <line x1="3" y1="9" x2="21" y2="9" stroke="#D8B26E" strokeWidth="2" />
    </svg>
  );
}

const portrait = images.find((img) => img.id === "story-couple-portrait");

export default function OurStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  // Subtle cursor/gyro parallax on the couple portrait
  useParallax(sectionRef, [{ ref: portraitRef, speedX: -10, speedY: -8 }], {
    smoothing: 0.06,
  });

  return (
    <section ref={sectionRef} id="our-story" className="section-paper relative w-full overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 w-full h-full opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='60' fill='none' stroke='%23C98FA2' stroke-width='1'/%3E%3Ccircle cx='100' cy='100' r='40' fill='none' stroke='%23D8B26E' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 300px",
        }}
      />

      <div className="relative flex max-w-5xl mx-auto flex-col items-center gap-10 px-6 md:flex-row md:items-center md:justify-between md:gap-8 md:px-16">
        {/* Story text */}
        <motion.div
          className="flex flex-1 flex-col items-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <p className="section-eyebrow font-body text-xs tracking-widest uppercase mb-2">
            A LOVE STORY
          </p>
          <h2 className="section-title font-headings text-cream-foreground mb-2">
            Our Story
          </h2>
          <div className="divider-row mb-6">
            <div className="gold-divider" />
            <HeartSVG />
            <div className="gold-divider" />
          </div>
          <p className="story-copy font-headings leading-loose">
            {storyLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < storyLines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </motion.div>

        {/* Portrait */}
        <motion.div
          ref={portraitRef}
          className="flex-shrink-0 flex flex-col items-center relative"
          /* Wider on mobile (full-width column), tighter side-by-side on desktop */
          style={{ width: "clamp(200px, 40vw, 360px)" }}
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="mb-4">
            <StoryCrossIcon />
          </div>
          <div
            className="relative overflow-hidden"
            style={{
              width: "clamp(160px, 20vw, 280px)",
              height: "clamp(210px, 26vw, 360px)",
              borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
              border: "3px solid #d8b26e",
              boxShadow:
                "0 0 0 8px rgba(216, 178, 110, 0.12), 0 8px 40px rgba(201, 143, 162, 0.3)",
            }}
          >
            {portrait && (
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 200px, 280px"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
