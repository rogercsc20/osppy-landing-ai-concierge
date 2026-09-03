"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "./motion-hooks";
import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion";

/**
 * Content that drifts against the page as it crosses the viewport.
 * `distance` is the total travel in pixels, centred on the crossing: 60 means
 * +30 on the way in and -30 on the way out. Static under reduced motion.
 */
export function Parallax({
  children,
  distance = 60,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // function-form mapping: numeric ranges compile to native ScrollTimeline
  // animations, which misbehave around sticky ancestors
  const raw = useTransform(scrollYProgress, (v) =>
    reduce ? 0 : (0.5 - v) * distance,
  );
  const y = useSpring(raw, SPRING.soft);

  return (
    <motion.div ref={ref} style={{ y }} className={cn(className)}>
      {children}
    </motion.div>
  );
}
