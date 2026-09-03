"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { useMotionOK } from "./motion-hooks";

/**
 * A soft light that follows the cursor across a surface. Pointer effect: off
 * under reduced motion and on touch (useMotionOK), where it would either
 * never move or stick where a finger last was.
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
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, color-mix(in srgb, ${color} ${strength}%, transparent), transparent 70%)`;

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onPointerMove={
        ok
          ? (e) => {
              const r = ref.current?.getBoundingClientRect();
              if (!r) return;
              x.set(e.clientX - r.left);
              y.set(e.clientY - r.top);
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
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background }}
        />
      )}
      {children}
    </div>
  );
}
