"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { images } from "@/lib/wedding-content";
import { getEnrichedGallery, type LocalImage } from "@/lib/api-data";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const localGallery = images.filter((img) => img.role === "gallery");

function HeartSVG({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 11" fill="#C98FA2">
      <path d="M6 10.5C6 10.5 0.5 6.5 0.5 3.5C0.5 1.8 1.8 0.5 3.5 0.5C4.5 0.5 5.3 1 6 1.8C6.7 1 7.5 0.5 8.5 0.5C10.2 0.5 11.5 1.8 11.5 3.5C11.5 6.5 6 10.5 6 10.5Z" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D8B26E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

export default function GallerySection() {
  // Seed with local data so SSR + first paint render immediately, then swap in
  // the API-merged data when NEXT_PUBLIC_USE_API_DATA is enabled.
  const [gallery, setGallery] = useState<LocalImage[]>([...localGallery]);

  useEffect(() => {
    let active = true;
    getEnrichedGallery().then((data) => {
      if (active) setGallery(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="gallery"
      className="section-paper relative w-full overflow-hidden"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0" style={{ pointerEvents: "none", zIndex: 0 }}>
        <div
          className="w-full h-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(216,178,110,0.02) 0%, rgba(201,143,162,0.04) 50%, rgba(216,178,110,0.02) 100%)",
          }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="relative flex flex-col items-center mb-12"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <p className="section-eyebrow font-body text-xs tracking-widest uppercase mb-2">
          PRECIOUS MEMORIES
        </p>
        <h2 className="section-title font-headings text-cream-foreground mb-2">
          Gallery
        </h2>
        <div className="divider-row">
          <div className="gold-divider" />
          <HeartSVG />
          <div className="gold-divider" />
        </div>
      </motion.div>

      {/* Masonry grid — 1 column on mobile, 2 on tablet, 3 on desktop */}
      <motion.div
        className="relative px-4 sm:px-6 md:px-16 columns-1 sm:columns-2 lg:columns-3"
        style={{ columnGap: "16px" }}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {gallery.map((img) => (
          <motion.div
            key={img.id}
            className="gallery-tile mb-4 overflow-hidden rounded-lg relative"
            variants={staggerItem}
          >
            <div
              className={
                img.aspectRatio === "3:4"
                  ? "gallery-aspect-3-4 w-full"
                  : "gallery-aspect-4-3 w-full"
              }
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={400}
                height={img.aspectRatio === "3:4" ? 533 : 300}
                className="w-full object-cover"
                sizes="(max-width: 639px) 90vw, (max-width: 1023px) 48vw, 31vw"
              />
            </div>
            <div className="gallery-overlay absolute inset-0 flex items-center justify-center">
              <div className="gallery-zoom w-8 h-8 rounded-full flex items-center justify-center">
                <ZoomIcon />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
