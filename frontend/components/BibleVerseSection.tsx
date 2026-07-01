"use client";

import Image from "next/image";
import { bibleVerse, images } from "@/lib/wedding-content";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { generateParticles } from "@/lib/particles";

function HeartSVG({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 11" fill="#C98FA2">
      <path d="M6 10.5C6 10.5 0.5 6.5 0.5 3.5C0.5 1.8 1.8 0.5 3.5 0.5C4.5 0.5 5.3 1 6 1.8C6.7 1 7.5 0.5 8.5 0.5C10.2 0.5 11.5 1.8 11.5 3.5C11.5 6.5 6 10.5 6 10.5Z" />
    </svg>
  );
}

const decorativeImages = images.filter((img) => img.role === "decorative");
const crossImg = decorativeImages.find((img) => img.id === "decorative-cross");
const candleImg = decorativeImages.find((img) => img.id === "decorative-candle");
const bibleImg = decorativeImages.find((img) => img.id === "decorative-bible");

export default function BibleVerseSection() {
  return (
    <section
      id="bible-verse"
      className="section-verse relative w-full overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Star particles */}
      <div className="absolute inset-0">
        {generateParticles(20, 99).map((p, i) => (
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

      {/* Radial glow */}
      <div
        className="absolute"
        style={{
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 300,
          background:
            "radial-gradient(ellipse, rgba(216, 178, 110, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Decorative crosses */}
      {crossImg && (
        <>
          <div className="absolute left-0 top-0 opacity-20 hidden md:block">
            <Image
              src={crossImg.src}
              alt={crossImg.alt}
              width={192}
              height={192}
              className="w-48 h-48 object-contain"
            />
          </div>
          <div
            className="absolute right-0 top-0 opacity-20 hidden md:block"
            style={{ transform: "scaleX(-1)" }}
          >
            <Image
              src={crossImg.src}
              alt={crossImg.alt}
              width={192}
              height={192}
              className="w-48 h-48 object-contain"
            />
          </div>
        </>
      )}

      {/* Candles */}
      {candleImg && (
        <>
          <div className="absolute bottom-8 left-24 opacity-50 hidden md:block">
            <Image
              src={candleImg.src}
              alt={candleImg.alt}
              width={40}
              height={128}
              className="w-10 h-32 object-contain"
            />
          </div>
          <div className="absolute bottom-8 right-24 opacity-50 hidden md:block">
            <Image
              src={candleImg.src}
              alt={candleImg.alt}
              width={40}
              height={128}
              className="w-10 h-32 object-contain"
            />
          </div>
        </>
      )}

      {/* Bible image */}
      {bibleImg && (
        <motion.div
          className="mb-8 opacity-50"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Image
            src={bibleImg.src}
            alt={bibleImg.alt}
            width={256}
            height={144}
            className="w-64 h-36 object-contain"
          />
        </motion.div>
      )}

      {/* Cross above quote */}
      <motion.div
        className="mb-6"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
          <line x1="14" y1="0" x2="14" y2="36" stroke="#D8B26E" strokeWidth="2.5" />
          <line x1="4" y1="10" x2="24" y2="10" stroke="#D8B26E" strokeWidth="2.5" />
        </svg>
      </motion.div>

      {/* Quote */}
      <motion.blockquote
        className="text-center max-w-2xl px-8"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
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
          {bibleVerse.quote}
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
      </motion.blockquote>
    </section>
  );
}
