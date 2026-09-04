"use client";

import { Children, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-init";
import { cn } from "@/lib/utils";
import { DUR, STAGGER, VIEWPORT, VIEWPORT_WIDE } from "@/lib/motion";
import { GSAP_EASE_LUXE, MOTION_OK, startAtAmount } from "@/lib/gsap-motion";

export type RevealVariant = "fade-up" | "blur-in" | "clip-up" | "scale-in";

/**
 * The hidden state of each variant, as GSAP `from` vars. Same numbers the
 * `motion` variants carried; only the spelling changed (`clipPath` stays
 * `clipPath`, `filter` stays `filter`, `y` is still pixels).
 */
const FROM: Record<RevealVariant, gsap.TweenVars> = {
  "fade-up": { opacity: 0, y: 26 },
  "blur-in": { opacity: 0, y: 14, filter: "blur(10px)" },
  "clip-up": { opacity: 0, clipPath: "inset(100% 0 0 0)", y: 18 },
  "scale-in": { opacity: 0, scale: 0.94 },
};

/**
 * The site's single entrance (landing v2 §3), on ScrollTrigger since
 * 2026-09-03.
 *
 * Under reduced motion nothing runs at all: `gsap.matchMedia` only invokes
 * the setup for the "no-preference" query, so the element keeps exactly the
 * markup the server sent and is visible from the first paint. There is no
 * second "still" variant to keep in sync, and no way for a reader who asked
 * for less motion to be left looking at an element stuck at opacity 0 —
 * the failure the capture gate exists to catch.
 *
 * `once: true` rather than toggleActions: an entrance is a one-time event,
 * and re-playing it when the reader scrolls back up reads as a glitch.
 */
export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = DUR.reveal,
  amount,
  className,
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  /** override the viewport trigger; defaults to VIEWPORT.amount */
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current, {
          ...FROM[variant],
          duration,
          delay,
          ease: GSAP_EASE_LUXE,
          scrollTrigger: {
            trigger: ref.current,
            start: startAtAmount(amount ?? VIEWPORT.amount),
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { dependencies: [variant, delay, duration, amount], scope: ref },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

/**
 * A list or grid whose children arrive one after the other. Each child is
 * wrapped in its own element, so `className` carries the grid and the
 * children keep their span classes.
 *
 * The stagger is one tween over all the items rather than one ScrollTrigger
 * per item: the whole group is a single arrival, and per-item triggers would
 * make the last card of a row wait for its own scroll position and break the
 * cascade the stagger exists to draw.
 */
export function Stagger({
  children,
  variant = "fade-up",
  stagger = STAGGER.cards,
  delay = 0,
  className,
  itemClassName,
}: {
  children: ReactNode;
  variant?: RevealVariant;
  stagger?: number;
  delay?: number;
  className?: string;
  itemClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(gsap.utils.toArray<HTMLElement>("[data-stagger-item]"), {
          ...FROM[variant],
          duration: DUR.reveal,
          delay,
          stagger,
          ease: GSAP_EASE_LUXE,
          scrollTrigger: {
            trigger: ref.current,
            start: startAtAmount(VIEWPORT_WIDE.amount),
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { dependencies: [variant, stagger, delay], scope: ref },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {Children.map(children, (child, i) => (
        <div key={i} data-stagger-item className={itemClassName}>
          {child}
        </div>
      ))}
    </div>
  );
}
