"use client";

import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A track that scrolls forever, holding two copies of the list so the seam
 * lands off-screen (the CSS translates by exactly -50%). The duplicate is
 * aria-hidden; hover pauses it; reduced motion stops it in place
 * (app/globals.css). CSS, not JS: it costs nothing on the main thread.
 */
export function Marquee({
  children,
  duration = 48,
  className,
  itemClassName,
}: {
  children: ReactNode;
  /** seconds for one full pass */
  duration?: number;
  className?: string;
  itemClassName?: string;
}) {
  const items = Children.toArray(children);

  return (
    // The track is twice the list wide: the marquee is a framed object and
    // clips itself, so no <section> ever has to (scripts/check-sections.mjs).
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="marquee-track flex w-max items-stretch"
        style={{ "--marquee-dur": `${duration}s` } as React.CSSProperties}
      >
        {[...items, ...items].map((child, i) => (
          <div
            key={i}
            className={itemClassName}
            aria-hidden={i >= items.length || undefined}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
