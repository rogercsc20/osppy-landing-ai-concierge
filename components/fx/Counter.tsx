"use client";

import { useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "./motion-hooks";

/**
 * A figure that counts up once, when it arrives. Under reduced motion the
 * final value is rendered directly — a counter that never runs must still
 * read as the number it claims.
 *
 * Every figure on the site is a claim: the caller passes a value that exists
 * in a cited source (check-copy.mjs holds the per-key allow list).
 */
export function Counter({
  value,
  prefix,
  suffix,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  // NumberFlow renders a different tree than a bare number: the hook only
  // reports reduced motion after hydration, so both renders agree.
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [start] = useState(0);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {reduce ? (
        value
      ) : (
        <NumberFlow value={inView ? value : start} willChange />
      )}
      {suffix}
    </span>
  );
}
