"use client";

import type { ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { useMotionOK } from "./motion-hooks";

/**
 * A soft light that follows the cursor across a surface. Pointer effect: off
 * under reduced motion and on touch (useMotionOK), where it would either
 * never move or stick where a finger last was.
 *
 * The light layer is `fixed inset-0`, not `absolute inset-0` (C1): a
 * gradient painted inside a `max-w-6xl` box is cut at that box's edges, so
 * a light near the container's left border draws a hard vertical line down
 * the page — the one bounded gradient in a design whose whole rule is that
 * no glow is ever clipped (landing v2 §2). Anchored to the viewport it has
 * no edge to be cut by; the coordinates are therefore client coordinates,
 * and it only lights while the pointer is inside `children`.
 */
export function Spotlight({
  children,
  className,
  size = 420,
  strength = 10,
  color = "var(--accent-text)",
}: {
  children: ReactNode;
  className?: string;
  /** diameter of the light, in px */
  size?: number;
  /** percent of the color mixed in at the centre */
  strength?: number;
  color?: string;
}) {
  const ok = useMotionOK();
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, color-mix(in srgb, ${color} ${strength}%, transparent), transparent 70%)`;

  return (
    <div
      className={cn("relative", className)}
      onPointerMove={
        ok
          ? (e) => {
              x.set(e.clientX);
              y.set(e.clientY);
            }
          : undefined
      }
      onPointerLeave={
        ok
          ? () => {
              x.set(-9999);
              y.set(-9999);
            }
          : undefined
      }
    >
      {ok && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10"
          style={{ background }}
        />
      )}
      {children}
    </div>
  );
}
