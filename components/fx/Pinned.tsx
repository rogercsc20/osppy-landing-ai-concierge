"use client";

import { useRef, type ReactNode } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { useReducedMotion } from "./motion-hooks";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Sticky storytelling, used once per page (landing v2 §3): the chapter holds
 * still while the scroll advances its step. Below `lg` and under reduced
 * motion the steps simply stack, which is why `render` receives the step
 * index and `steps` the total — the caller draws both shapes from one source.
 */
export function Pinned({
  steps,
  children,
  className,
  stickyClassName,
  stepVh = 100,
}: {
  steps: number;
  children: (step: number, stacked: boolean) => ReactNode;
  className?: string;
  stickyClassName?: string;
  /**
   * Viewport heights of scroll per step, and therefore how long the chapter
   * holds. At 100 the last step still has a full viewport of scroll behind
   * it before the block releases and another full viewport to travel off
   * screen — the empty stretch the operator saw after "Operación" (C1). The
   * block itself is `min-h-[68svh]`, not a full viewport, for the same
   * reason: a short step centred in 100svh is mostly air.
   */
  stepVh?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(steps - 1, Math.max(0, Math.floor(v * steps)));
    setStep(next);
  });

  return (
    <>
      {/* stacked: every step drawn in order, no pinning */}
      <div className={cn("lg:hidden", className)}>
        {Array.from({ length: steps }, (_, i) => (
          <div key={i}>{children(i, true)}</div>
        ))}
      </div>

      {/* pinned: `stepVh` of scroll per step, the chapter stays put */}
      <div
        ref={ref}
        className={cn("hidden lg:block", className)}
        style={{ height: reduce ? undefined : `${steps * stepVh}vh` }}
      >
        <div
          className={cn(
            reduce ? undefined : "sticky top-[16vh] flex min-h-[68svh] items-center",
            stickyClassName,
          )}
        >
          {reduce
            ? Array.from({ length: steps }, (_, i) => (
                <div key={i}>{children(i, true)}</div>
              ))
            : children(step, false)}
        </div>
      </div>
    </>
  );
}
