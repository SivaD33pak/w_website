"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { couple, weddingDate, venue, images } from "@/lib/wedding-content";
import { heroData } from "@/lib/wedding-data";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useParallax, GyroPermissionButton } from "@/lib/use-parallax";

gsap.registerPlugin(ScrollTrigger);

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

const heroImages = images.filter((img) => img.role === "hero");

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // Individual refs for each hero layer — used by both scroll parallax
  // (via layerRefs array) and cursor/gyro parallax (via individual refs).
  const layer0Ref = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  // Decorative corner flowers (front-most floral elements), wired into the
  // same scroll + cursor/gyro parallax as the background layers below.
  const flowerLeftRef = useRef<HTMLDivElement>(null);
  const flowerRightRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Populate the array from the individual refs for the scroll parallax loop.
    layerRefs.current = [layer0Ref.current, layer1Ref.current, layer2Ref.current];

    const layers = layerRefs.current.filter(Boolean);
    const speeds = [0, 0.22, 0.38];

    // gsap.context scopes all animations + ScrollTriggers created inside it,
    // so ctx.revert() only kills THIS section's effects.
    const ctx = gsap.context(() => {
      layers.forEach((layer, i) => {
        gsap.to(layer!, {
          yPercent: speeds[i] * 100,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Corner flowers move fastest on scroll (front-most depth layer).
      [flowerLeftRef.current, flowerRightRef.current].forEach((el) => {
        if (!el) return;
        gsap.to(el, {
          yPercent: 0.55 * 100,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cursor/gyroscope parallax: front layers (closest to viewer, higher index)
  // move fastest and decrease progressively toward the inner/deep layers,
  // creating a depth illusion. Layer 0 (sky, farthest) barely moves.
  // This composes with the scroll-based yPercent parallax above (x/y vs
  // yPercent are independent GSAP transform components — no conflict).
  const { needsPermission, requestGyroPermission } = useParallax(
    sectionRef,
    [
      { ref: layer0Ref, speedX: 0, speedY: 0 },       // sky:          fixed base
      { ref: layer1Ref, speedX: -28, speedY: -22 },   // mountain:     slow drift
      { ref: layer2Ref, speedX: -48, speedY: -36 },   // church:       moderate
      { ref: flowerLeftRef, speedX: -75, speedY: -58 },   // flowers:  fastest (front)
      { ref: flowerRightRef, speedX: -75, speedY: -58 },  // flowers:  fastest (front)
    ],
    { smoothing: 0.07 },
  );

  const allLayerRefs = [layer0Ref, layer1Ref, layer2Ref];

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero-shell relative w-full overflow-hidden"
    >
      {/* Parallax background layers.
          Each layer is intentionally oversized (negative inset) so that its
          edges stay hidden behind the viewport even at maximum parallax
          displacement. Front layers move faster (cursor/gyro up to ~38px), so
          they get a larger buffer. Percentage insets scale with viewport size
          so the buffer always covers the fixed-pixel displacement. */}
      {heroImages.map((img, i) => (
        <div
          key={img.id}
          ref={allLayerRefs[i]}
          className={`hero-layer-${i} absolute`}
          /* inset buffer per layer (must exceed max cursor/gyro offset):
             layer 0: ~0px move   → -8%
             layer 1: ~14px move  → -11%
             layer 2: ~24px move  → -14% */
          style={{ inset: `${-8 - i * 3}%` }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover object-bottom"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(24,27,58,0.4) 0%, rgba(24,27,58,0.1) 40%, rgba(24,27,58,0.5) 100%)",
        }}
      />

      {/* Decorative floral corners (front-most). The right piece mirrors the
          image via CSS so both sides stay symmetric. Drawn above the dark
          overlay so the flowers stay vivid, below the hero text content. */}
      <div ref={flowerLeftRef} className="hero-corner-flower hero-corner-flower-left">
        <Image
          src="/hero/layer-4-daisies.png"
          alt="Floral decoration"
          fill
          className="object-contain object-bottom"
          sizes="(max-width: 640px) 220px, 520px"
        />
      </div>
      <div ref={flowerRightRef} className="hero-corner-flower hero-corner-flower-right">
        <Image
          src="/hero/layer-4-daisies.png"
          alt="Floral decoration"
          fill
          className="object-contain object-bottom"
          sizes="(max-width: 640px) 220px, 520px"
        />
      </div>

      {/* Content */}
      <div className="hero-content relative flex flex-col items-center text-center">
        {/* iOS gyroscope permission prompt */}
        {needsPermission && (
          <div className="mb-6">
            <GyroPermissionButton onRequest={requestGyroPermission} />
          </div>
        )}

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
          className="mt-6 mb-7 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <div className="hero-heart-line" />
          <HeartSVG />
          <div className="hero-heart-line" />
        </motion.div>

        {/* Info card */}
        <motion.div
          className="hero-card flex items-stretch overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          {/* Date segment */}
          <div className="hero-card-segment flex flex-col items-center justify-center gap-1 px-6 py-7 md:px-11">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D8B26E"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="hero-meta-big font-headings text-foreground">
              {weddingDate.day}
            </span>
            <span className="hero-meta-label font-body text-gold">
              {weddingDate.monthYear}
            </span>
            <span className="hero-meta-day font-body text-foreground">
              {weddingDate.weekday}
            </span>
          </div>

          {/* Venue segment — clickable, opens Google Maps in a new tab */}
          <a
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-card-segment flex flex-col items-center justify-center gap-1 px-6 py-7 text-center transition-all duration-300 hover:bg-foreground/5 md:px-11"
            aria-label={`Open ${venue.name} in Google Maps`}
          >
            <svg
              width="22"
              height="22"
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
            <span className="hero-meta-venue font-body text-foreground font-semibold">
              {venue.label}
            </span>
            <span className="hero-meta-venue-muted font-body text-foreground underline decoration-gold/40 underline-offset-2">
              {venue.address}
            </span>
          </a>
        </motion.div>

        {/* RSVP CTA */}
        <motion.a
          href="#rsvp"
          className="hero-rsvp-button mt-7 flex items-center gap-3 rounded-full px-10 py-4 font-body font-medium text-foreground md:px-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
          </svg>
          RSVP
        </motion.a>
      </div>
    </section>
  );
}
