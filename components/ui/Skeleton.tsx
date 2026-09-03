import { cn } from "@/lib/utils";

/**
 * Loading placeholder block. The pulse lives in globals.css
 * (.animate-skeleton) and is disabled under prefers-reduced-motion there.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-skeleton rounded-2xl bg-line/60", className)}
    />
  );
}
