import type { Variants } from "framer-motion";

/* ── Section reveal ─────────────────────────────────────── */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

/* ── Staggered children ─────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/* ── Scale in (cards / images) ──────────────────────────── */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/* ── Fade in only ───────────────────────────────────────── */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/* ── Countdown digit flip ────────────────────────────────── */
export const digitFlip: Variants = {
  initial: { rotateX: -90, opacity: 0 },
  animate: {
    rotateX: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};
