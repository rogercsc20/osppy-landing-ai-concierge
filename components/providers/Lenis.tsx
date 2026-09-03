"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";

/**
 * Site-wide inertial scrolling (replaces providers/SmoothScroll.tsx, which
 * drove its own rAF loop). `root` makes it the window scroller, so sticky
 * positioning, anchors and the scroll-linked motion primitives all keep
 * working. Skipped entirely under prefers-reduced-motion — native scrolling
 * is the fallback, not a slower version of this one.
 */
export function Lenis({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.12, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
