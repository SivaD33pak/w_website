/* Deterministic pseudo-random particles for SSR-safe rendering */
/* Simple mulberry32 PRNG — gives identical output for the same seed */

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateParticles(count: number, seed = 42) {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    width: 1 + rng() * 1.5,
    height: 1 + rng() * 1.5,
    top: rng() * 100,
    left: rng() * 100,
    opacity: 0.1 + rng() * 0.5,
  }));
}
