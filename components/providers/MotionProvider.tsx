"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domMax } from "motion/react";

/**
 * One motion configuration for the whole site.
 *
 * `reducedMotion="user"` is the accessibility contract: every JS animation
 * respects the OS setting without each component asking. LazyMotion loads the
 * feature bundle once, off the critical path.
 *
 * `strict` is deliberately NOT set yet: the sections written before slice V3
 * still import `motion` directly, and strict mode throws on `motion.*` inside
 * a LazyMotion tree. It goes on when the last section moves to `m` (V4).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domMax}>{children}</LazyMotion>
    </MotionConfig>
  );
}
