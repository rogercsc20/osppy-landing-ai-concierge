"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion as useReducedMotionRaw } from "motion/react";

/** Nothing to subscribe to: the value differs only between server and client. */
const noSubscribe = () => () => {};

/**
 * False on the server and on the first client render, true after hydration.
 * Written with useSyncExternalStore rather than a state-setting effect: React
 * does the server/client split itself.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
}

/**
 * prefers-reduced-motion, safe to branch on during render.
 *
 * motion's own useReducedMotion reads matchMedia, so it answers `null` on the
 * server and `true` on the very first client render of a reader who asked for
 * less motion. Any component that picks a tree, a variant or an inline style
 * from it then hydrates something the server never sent — React tears the
 * whole subtree down and rebuilds it (hydration error #418), which is exactly
 * how the reduced-motion pass of scripts/capture.mjs caught it.
 *
 * This wrapper reports `false` until hydration is done, so both renders agree,
 * and the calm version takes over one frame later. Import THIS one anywhere
 * the answer reaches the DOM; motion's own is fine inside effects and event
 * handlers, which never run on the server.
 */
export function useReducedMotion(): boolean {
  const mounted = useMounted();
  const reduce = useReducedMotionRaw();
  return mounted && !!reduce;
}

/**
 * True only when motion is welcome AND there is a real pointer to track: the
 * gate for spotlight, magnetic, tilt and hover-glow effects. Entrance and
 * scroll motion use useReducedMotion directly — they are useful on touch too.
 */
export function useMotionOK(): boolean {
  const reduce = useReducedMotion();
  const fine = useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(pointer: fine)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
  return !reduce && fine;
}
