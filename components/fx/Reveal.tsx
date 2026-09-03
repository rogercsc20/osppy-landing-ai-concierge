"use client";

import { Children, type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "./motion-hooks";
import { cn } from "@/lib/utils";
import { DUR, EASE_LUXE, STAGGER, VIEWPORT, VIEWPORT_WIDE } from "@/lib/motion";

export type RevealVariant = "fade-up" | "blur-in" | "clip-up" | "scale-in";

const VARIANTS: Record<RevealVariant, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 26 },
    visible: { opacity: 1, y: 0 },
  },
  "blur-in": {
    hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "clip-up": {
    hidden: { opacity: 0, clipPath: "inset(100% 0 0 0)", y: 18 },
    visible: { opacity: 1, clipPath: "inset(0% 0 0 0)", y: 0 },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
};

const STILL: Variants = { hidden: { opacity: 1 }, visible: { opacity: 1 } };

/**
 * The site's single entrance (landing v2 §3), replacing AnimatedSection.
 * Under reduced motion the element is simply visible — never a hidden
 * element waiting for an animation that will not run.
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
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: amount ?? VIEWPORT.amount }}
      variants={reduce ? STILL : VARIANTS[variant]}
      transition={{ duration: reduce ? 0 : duration, delay, ease: EASE_LUXE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A list or grid whose children arrive one after the other. Each child is
 * wrapped in its own motion element, so `className` carries the grid and the
 * children keep their span classes.
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
  const reduce = useReducedMotion();
  const item = reduce ? STILL : VARIANTS[variant];

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_WIDE}
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
      {Children.map(children, (child, i) => (
        <motion.div
          key={i}
          className={itemClassName}
          variants={item}
          transition={{ duration: reduce ? 0 : DUR.reveal, ease: EASE_LUXE }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
