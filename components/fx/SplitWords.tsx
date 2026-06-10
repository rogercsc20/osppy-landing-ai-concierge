"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { DUR_REVEAL, EASE_LUXE } from "@/lib/motion";

const wordVariants: Variants = {
  hidden: { y: "115%" },
  visible: {
    y: 0,
    transition: { duration: DUR_REVEAL, ease: EASE_LUXE },
  },
};

/**
 * Word-by-word masked rise on scroll into view. The IntersectionObserver
 * watches the (unclipped) parent — observing the translated words themselves
 * would never fire, since they start fully clipped. Screen readers get the
 * intact string; the animated copy is aria-hidden.
 */
export function SplitWords({
  text,
  className,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {text.split(" ").map((word, i) => (
          <Fragment key={i}>
            {/* the space lives BETWEEN the inline-block wrappers — inside
                them it would collapse and the words would run together */}
            {i > 0 && " "}
            <span className="-mb-[0.08em] inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span className="inline-block" variants={wordVariants}>
                {word}
              </motion.span>
            </span>
          </Fragment>
        ))}
      </motion.span>
    </span>
  );
}
