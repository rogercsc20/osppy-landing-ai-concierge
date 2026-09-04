"use client";

import { useEffect, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import { ScrollTrigger } from "@/lib/gsap-init";

/**
 * The bridge between Lenis and ScrollTrigger.
 *
 * Registration is NOT here — it is at module scope in lib/gsap-init.ts,
 * because effects run child-before-parent and a provider can never register
 * early enough for its own children's layout effects. That comment lives
 * there with the failure it describes.
 *
 * Every scroll-driven effect on the site runs on ScrollTrigger (landing v2
 * §3, amended 2026-09-03 by operator directive). `motion` keeps everything
 * that is NOT scroll: pointer effects, AnimatePresence, layoutId, route
 * transitions, NumberFlow. The split is by AXIS, not by section, so a reader
 * of any component can tell which engine owns it from the imports alone.
 *
 * Why the bridge is needed: Lenis does not move the scrollbar on the browser's
 * schedule, it interpolates toward a target and writes the scroll position
 * from its own rAF. ScrollTrigger listens for native scroll events, which
 * arrive after Lenis has already painted, so without being told, its start
 * and end math runs a frame behind what the reader sees — pins drift and
 * scrubs stutter. `lenis.on("scroll", ScrollTrigger.update)` is the
 * documented fix.
 *
 * Under `prefers-reduced-motion` there IS no Lenis (providers/Lenis.tsx
 * returns its children unwrapped), `useLenis()` answers `undefined`, and
 * ScrollTrigger reads native scroll with nothing to reconcile. That is why
 * the hook result is guarded rather than asserted.
 */
export function Gsap({ children }: { children: ReactNode }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    lenis.on("scroll", ScrollTrigger.update);
    // Lenis measures the page when it starts; ScrollTrigger measured it
    // before that. One refresh once both are alive keeps the two agreeing
    // about where the bottom is.
    ScrollTrigger.refresh();
    return () => {
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  return <>{children}</>;
}
