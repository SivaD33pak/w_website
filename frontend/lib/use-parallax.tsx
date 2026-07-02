/**
 * use-parallax.ts — cursor-following (desktop) and gyroscope-following (mobile)
 * parallax hook, plus a small GyroPermissionButton for iOS 13+.
 *
 * No new dependencies — uses native browser events and GSAP (already installed).
 * Designed to compose alongside existing scroll-based GSAP ScrollTrigger
 * parallax without conflict: this hook drives `x`/`y` (pixel translate) while
 * scroll parallax typically drives `yPercent`. GSAP tracks these independently
 * in its transform string.
 *
 * ## Usage
 *
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const layerRef = useRef<HTMLDivElement>(null);
 *
 * const { needsPermission, requestGyroPermission } = useParallax(containerRef, [
 *   { ref: layerRef, speedX: -20, speedY: -15 },
 * ]);
 *
 * return (
 *   <div ref={containerRef}>
 *     {needsPermission && <GyroPermissionButton onRequest={requestGyroPermission} />}
 *     <div ref={layerRef}>…</div>
 *   </div>
 * );
 * ```
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type RefObject,
} from "react";
import gsap from "gsap";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A target element and how much it should move per unit of input. */
export interface ParallaxTarget {
  ref: RefObject<HTMLElement | null>;
  /** Horizontal pixels per normalized input unit (negative = parallax depth). */
  speedX: number;
  /** Vertical pixels per normalized input unit. */
  speedY: number;
}

/** Options for the hook. */
export interface UseParallaxOptions {
  /** Lerp factor for smoothing (0.01 = very slow, 0.2 = snappy). Default 0.08. */
  smoothing?: number;
}

/** Return value of {@link useParallax}. */
export interface UseParallaxReturn {
  /** True on iOS 13+ when gyro permission has not yet been granted. */
  needsPermission: boolean;
  /** True once permission is granted (or on non-iOS devices). */
  granted: boolean;
  /** Call this on user gesture to request gyro permission on iOS. */
  requestGyroPermission: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useParallax(
  containerRef: RefObject<HTMLElement | null>,
  targets: ParallaxTarget[],
  options: UseParallaxOptions = {},
): UseParallaxReturn {
  const smoothing = options.smoothing ?? 0.08;

  // iOS permission state
  const [needsPermission, setNeedsPermission] = useState(false);
  const [granted, setGranted] = useState(false);

  // Mutable refs that don't trigger re-renders — read inside the animation loop
  // and event handlers.
  const rafRef = useRef<number>(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const listenersAttached = useRef(false);
  const gyroPermissionRequested = useRef(false);

  // Stable reference to the latest targets array so the RAF loop always sees
  // current refs without recreating closures.
  const targetsRef = useRef(targets);
  targetsRef.current = targets;

  /**
   * Apply the lerped position to every target via `gsap.set`.
   * `gsap.set` is a one-shot property application — it does NOT create a tween
   * instance, so there's no accumulation or conflict with ScrollTrigger tweens.
   */
  const applyPosition = useCallback(() => {
    for (const { ref, speedX, speedY } of targetsRef.current) {
      const el = ref.current;
      if (!el) continue;

      if (speedX === 0 && speedY === 0) continue;

      // Use quickSetters for maximum perf — they bypass the full gsap.set
      // overhead and write directly to the inline style.
      gsap.set(el, {
        x: currentX.current * speedX,
        y: currentY.current * speedY,
      });
    }
  }, []);

  /**
   * The animation loop. Lerps current toward target each frame so the
   * movement feels smooth and organic rather than snapping.
   */
  const tick = useCallback(() => {
    currentX.current += (targetX.current - currentX.current) * smoothing;
    currentY.current += (targetY.current - currentY.current) * smoothing;

    applyPosition();

    if (listenersAttached.current) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [smoothing, applyPosition]);

  /**
   * Normalize a mouse event within the container to [-0.5, 0.5].
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      targetX.current = (e.clientX - rect.left) / rect.width - 0.5;
      targetY.current = (e.clientY - rect.top) / rect.height - 0.5;
    },
    [containerRef],
  );

  /**
   * Normalize a DeviceOrientation event to [-0.5, 0.5].
   * beta = front-back tilt (0 = flat, maps to Y)
   * gamma = left-right tilt (0 = flat, maps to X)
   */
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    // beta: -180..180, but typically -90..90 when phone is held upright
    const beta = e.beta ?? 0;
    // gamma: -90..90
    const gamma = e.gamma ?? 0;

    targetX.current = Math.max(-0.5, Math.min(0.5, gamma / 90));
    targetY.current = Math.max(-0.5, Math.min(0.5, beta / 90));
  }, []);

  /**
   * Attach the appropriate listener based on device capabilities.
   */
  const attachListeners = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    listenersAttached.current = true;

    // Fine pointer → desktop mouse
    if (window.matchMedia("(pointer: fine)").matches) {
      container.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
    } else {
      // Coarse pointer → mobile, try gyroscope
      window.addEventListener("deviceorientation", handleOrientation);
    }

    // Start the animation loop
    rafRef.current = requestAnimationFrame(tick);
  }, [containerRef, handleMouseMove, handleOrientation, tick]);

  /**
   * Detach all listeners and stop the animation loop.
   */
  const detachListeners = useCallback(() => {
    listenersAttached.current = false;
    cancelAnimationFrame(rafRef.current);

    const container = containerRef.current;
    if (container) {
      container.removeEventListener("mousemove", handleMouseMove);
    }
    window.removeEventListener("deviceorientation", handleOrientation);

    // Reset positions
    currentX.current = 0;
    currentY.current = 0;
    targetX.current = 0;
    targetY.current = 0;

    // Clear any applied transforms from gsap
    for (const { ref } of targetsRef.current) {
      const el = ref.current;
      if (el) gsap.killTweensOf(el);
    }
  }, [containerRef, handleMouseMove, handleOrientation]);

  /**
   * Request gyro permission on iOS 13+. Returns a promise that resolves to
   * 'granted' | 'denied'.
   */
  const requestGyroPermission = useCallback(async () => {
    if (gyroPermissionRequested.current) return;
    gyroPermissionRequested.current = true;

    try {
      // TypeScript doesn't know about requestPermission on
      // DeviceOrientationEvent — it's an iOS-only extension.
      const perm = await (
        DeviceOrientationEvent as unknown as {
          requestPermission: () => Promise<string>;
        }
      ).requestPermission();

      if (perm === "granted") {
        setGranted(true);
        setNeedsPermission(false);
      }
    } catch {
      // Permission denied or not available — stay in scroll-only mode.
      setNeedsPermission(false);
    }
  }, []);

  useEffect(() => {
    // Respect the user's reduced-motion preference. Disable cursor/gyro
    // parallax but leave existing scroll-based parallax untouched.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Check if this is iOS 13+ (has requestPermission) and needs explicit
    // user permission before gyro events fire.
    const isIOS =
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => void })
        .requestPermission === "function";

    if (isIOS) {
      // Don't attach gyro yet — wait for user to tap the permission button.
      setNeedsPermission(true);

      // Override requestGyroPermission to also attach listeners after grant.
      // We handle this by watching the `granted` state below.
    } else {
      // Non-iOS: just attach immediately
      setGranted(true);
      attachListeners();
    }

    return () => {
      detachListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When permission is granted on iOS, attach the gyro listener.
  useEffect(() => {
    if (granted && !listenersAttached.current) {
      attachListeners();
    }
    return () => {
      // Cleanup is handled by the main effect above
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [granted]);

  return { needsPermission, granted, requestGyroPermission };
}

// ---------------------------------------------------------------------------
// GyroPermissionButton component
// ---------------------------------------------------------------------------

interface GyroPermissionButtonProps {
  onRequest: () => Promise<void>;
}

/**
 * A small, themed button rendered inside the hero section on iOS 13+ to
 * request DeviceOrientationEvent permission. Fades out once granted.
 */
export function GyroPermissionButton({ onRequest }: GyroPermissionButtonProps) {
  const [dismissed, setDismissed] = useState(false);

  const handleClick = async () => {
    await onRequest();
    // Brief delay so the user sees the tap registered before fade-out
    setTimeout(() => setDismissed(true), 300);
  };

  if (dismissed) return null;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleClick}
      className="flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-xs tracking-wider uppercase"
      style={{
        background: "rgba(14, 16, 38, 0.6)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(216, 178, 110, 0.45)",
        color: "rgba(246, 246, 246, 0.85)",
        cursor: "pointer",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#d8b26e"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v4M6 2v4M18 2v4" />
        <circle cx="12" cy="14" r="8" />
        <path d="M9 14l2 2 4-4" />
      </svg>
      Enable motion
    </motion.button>
  );
}
