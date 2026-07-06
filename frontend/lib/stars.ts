/* Deterministic pseudo-random star fields for SSR-safe rendering.
   Mirrors the mulberry32 PRNG pattern from particles.ts so server and
   client render identical stars — no hydration mismatch. */

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Star {
  top: number;
  left: number;
  size: number;
  opacity: number;
  /** twinkle animation duration (s) */
  duration: number;
  /** twinkle animation delay (s) */
  delay: number;
  /** size tier — 0 = dust, 1 = small, 2 = medium, 3 = large gem */
  tier: 0 | 1 | 2 | 3;
}

export interface Sparkle {
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

/** Generate a layered field of twinkling stars spread across size tiers. */
export function generateStars(count: number, seed = 7): Star[] {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const roll = rng();
    let tier: Star["tier"];
    let size: number;
    if (roll < 0.55) {
      tier = 0; // fine dust
      size = 1 + rng() * 0.8;
    } else if (roll < 0.85) {
      tier = 1; // small star
      size = 1.6 + rng() * 1.2;
    } else if (roll < 0.97) {
      tier = 2; // medium star
      size = 2.4 + rng() * 1.4;
    } else {
      tier = 3; // rare large gem
      size = 3.4 + rng() * 1.8;
    }
    return {
      top: rng() * 100,
      left: rng() * 100,
      size,
      opacity: tier === 0 ? 0.2 + rng() * 0.3 : 0.4 + rng() * 0.5,
      duration: 2.5 + rng() * 4,
      delay: rng() * 5,
      tier,
    };
  });
}

/** Generate a few larger 4-point sparkle stars (rendered as SVG). */
export function generateSparkles(count: number, seed = 19): Sparkle[] {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    top: 6 + rng() * 88,
    left: 4 + rng() * 92,
    size: 10 + rng() * 12,
    duration: 3 + rng() * 3,
    delay: rng() * 4,
  }));
}
