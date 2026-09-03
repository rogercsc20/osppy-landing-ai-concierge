import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A surface with a field of its own — the price block, a pinned chapter —
 * whose top and bottom edges dissolve into the page (`.band-mask`), so it
 * never cuts the atmosphere behind it into two halves. This is the shape a
 * section band used to have; sections themselves are transparent now
 * (scripts/check-sections.mjs).
 */
export function Band({
  children,
  className,
  glass = true,
}: {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}) {
  return (
    <div className={cn("band-mask rounded-[2.5rem]", glass && "glass", className)}>
      {children}
    </div>
  );
}
