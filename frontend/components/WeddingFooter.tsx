"use client";

import { couple, weddingDate } from "@/lib/wedding-content";
import { contactData } from "@/lib/wedding-data";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

function CrossIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.33} viewBox="0 0 18 24" fill="none">
      <line x1="9" y1="0" x2="9" y2="24" stroke="#D8B26E" strokeWidth="1.5" />
      <line x1="2" y1="7" x2="16" y2="7" stroke="#D8B26E" strokeWidth="1.5" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D8B26E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D8B26E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D8B26E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export default function WeddingFooter() {
  return (
    <footer className="section-footer w-full relative overflow-hidden">
      <motion.div
        className="flex flex-col items-center gap-4 relative"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Divider */}
        <div className="w-full flex justify-center mb-10">
          <div className="footer-divider" />
        </div>

        <CrossIcon />

        <h3 className="footer-title font-headings text-foreground">
          {couple.brideFirstName}
          <span className="footer-ampersand"> &amp; </span>
          {couple.groomFirstName}
        </h3>

        <p className="footer-date font-body text-xs tracking-widest uppercase">
          {weddingDate.footerDisplay}
        </p>

        <p className="footer-subtitle font-headings text-foreground text-sm mt-2">
          {contactData.tagline}
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-6 mt-6">
          <a
            href="#"
            className="footer-social flex items-center justify-center w-10 h-10 rounded-full"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <a
            href="#"
            className="footer-social flex items-center justify-center w-10 h-10 rounded-full"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon />
          </a>
          <a
            href={`mailto:${contactData.email}`}
            className="footer-social flex items-center justify-center w-10 h-10 rounded-full"
            aria-label="Email"
          >
            <EmailIcon />
          </a>
        </div>

        <p className="footer-note font-body mt-8">
          © 2026 {couple.displayName} Wedding. All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
