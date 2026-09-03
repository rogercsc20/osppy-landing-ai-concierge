import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Where a section's local decoration lives (landing v2 §2). A <section> never
 * clips (see scripts/check-sections.mjs): its glows sit in this layer, which
 * is deliberately overflow-visible so a blob can bleed into the neighbouring
 * section instead of ending on a hard edge. The only horizontal guard is
 * body { overflow-x: clip }.
 */
export function FxLayer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-visible",
        className,
      )}
    >
      {children}
    </div>
  );
}
