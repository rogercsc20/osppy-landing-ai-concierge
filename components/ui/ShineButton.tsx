"use client";

import type { ReactNode } from "react";
import { Magnetic } from "@/components/fx/Magnetic";
import { cn } from "@/lib/utils";

/**
 * The primary action: an accent pill with a sweep across its face and a
 * magnetic pull toward the cursor. Both are pointer effects — Magnetic drops
 * to a plain wrapper under reduced motion, and the sweep is stopped by the
 * reduced-motion block in app/globals.css.
 *
 * Renders an <a>: every CTA on this site is a link (no forms, HQA-D25).
 */
export function ShineButton({
  href,
  children,
  className,
  magnetic = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  magnetic?: boolean;
}) {
  const button = (
    <a
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-4 text-base font-semibold text-primary-foreground transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="animate-shine pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </a>
  );

  return magnetic ? <Magnetic>{button}</Magnetic> : button;
}
