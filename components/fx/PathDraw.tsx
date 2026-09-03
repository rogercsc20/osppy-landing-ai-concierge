"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "./motion-hooks";
import { cn } from "@/lib/utils";
import { DUR, EASE_EXPO, VIEWPORT } from "@/lib/motion";

/**
 * An SVG stroke that draws itself when the diagram arrives. Renders a <g>
 * inside an <svg>; every <motion.path> under it carries drawVariants() and
 * inherits the timing through this group. Drawn instantly under reduced
 * motion — the diagram is information, not decoration.
 */
export function PathDraw({
  children,
  className,
  stagger = 0.18,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.g
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduce ? 0 : stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.g>
  );
}

/** The variants a path inside <PathDraw> should carry. */
export const drawVariants = (duration = DUR.slow) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration, ease: EASE_EXPO }, opacity: { duration: 0.1 } },
  },
});
