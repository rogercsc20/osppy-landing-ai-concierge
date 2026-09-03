"use client";

import { Fragment } from "react";
import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "./motion-hooks";
import { cn } from "@/lib/utils";
import { DUR, EASE_EXPO, STAGGER, VIEWPORT } from "@/lib/motion";

type Unit = "words" | "chars" | "lines";

/** Masked rise: the piece travels inside a clipped box, so it slides up from
    behind the line above instead of fading in place. */
const maskVariants: Variants = {
  hidden: { y: "115%" },
  visible: { y: 0, transition: { duration: DUR.reveal, ease: EASE_EXPO } },
};

/** Reduced motion: the same tree, standing still — the pieces are always
    rendered, only their variants change. */
const stillVariants: Variants = { hidden: {}, visible: {} };

/** Blur-in: for lines, where a mask would need a box per line anyway. */
const blurVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DUR.reveal, ease: EASE_EXPO },
  },
};

/**
 * Text that arrives piece by piece (landing v2 §3), replacing SplitWords.
 * Screen readers get the intact string; the animated copy is aria-hidden.
 *
 * The h1 of a hero is the LCP element and must NOT start invisible: it keeps
 * the CSS .animate-rise-only entrance. SplitText starts at h2.
 */
export function SplitText({
  text,
  unit = "words",
  className,
  delay = 0,
  stagger,
  blur = false,
}: {
  text: string;
  unit?: Unit;
  className?: string;
  delay?: number;
  stagger?: number;
  /** blur-in instead of the masked rise (the default for `lines`) */
  blur?: boolean;
}) {
  const reduce = useReducedMotion();

  const pieces =
    unit === "chars"
      ? [...text]
      : unit === "lines"
        ? text.split("\n")
        : text.split(" ");

  const step =
    stagger ??
    (unit === "chars"
      ? STAGGER.chars
      : unit === "lines"
        ? STAGGER.words * 2
        : STAGGER.words);

  const masked = !blur && unit !== "lines";
  const variants = reduce
    ? stillVariants
    : masked
      ? maskVariants
      : blurVariants;

  return (
    <span className={cn(className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: VIEWPORT.amount }}
        transition={{ staggerChildren: step, delayChildren: delay }}
        className={unit === "lines" ? "flex flex-col" : undefined}
      >
        {pieces.map((piece, i) => (
          <Fragment key={i}>
            {/* the space lives BETWEEN the inline-block wrappers — inside
                them it would collapse and the words would run together */}
            {unit === "words" && i > 0 && " "}
            {masked ? (
              <span className="-mb-[0.08em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span className="inline-block" variants={variants}>
                  {piece === " " ? " " : piece}
                </motion.span>
              </span>
            ) : (
              <motion.span
                className={unit === "lines" ? "block" : "inline-block"}
                variants={variants}
              >
                {piece}
              </motion.span>
            )}
          </Fragment>
        ))}
      </motion.span>
    </span>
  );
}
