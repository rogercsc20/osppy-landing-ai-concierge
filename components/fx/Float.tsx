"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "./motion-hooks";
import { cn } from "@/lib/utils";

/**
 * An object that breathes in place — used on the hero's diagram pieces so
 * the scene is never completely still. Continuous motion: paused, not
 * restyled, under reduced motion.
 */
export function Float({
  children,
  distance = 10,
  duration = 6,
  delay = 0,
  className,
}: {
  children: ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      animate={reduce ? undefined : { y: [0, -distance, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
