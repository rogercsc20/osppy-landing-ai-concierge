"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "./motion-hooks";
import { SPRING } from "@/lib/motion";

/**
 * A hairline of accent across the top of the page that fills as you read.
 * Sits above the navbar's border, decorative and aria-hidden.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, SPRING.soft);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-accent-text"
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
    />
  );
}
