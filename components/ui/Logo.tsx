import { cn } from "@/lib/utils";

/**
 * Osppy logomark glyph: an "O" ring with a chat dot. Inherits currentColor
 * so it works white-on-tile or ink-on-canvas.
 */
export function LogoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <circle cx="14.5" cy="13.5" r="8" stroke="currentColor" strokeWidth="4.5" />
      <circle cx="26" cy="26" r="3.5" fill="currentColor" />
    </svg>
  );
}

/**
 * The glyph on a brand tile. Size, radius, and surface come from className
 * (e.g. "h-8 w-8", "rounded-xl", "bg-turquoise-glow" for dark contexts).
 */
export function Logomark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-lg bg-turquoise-deep text-white",
        className,
      )}
    >
      <LogoGlyph className="h-[62%] w-[62%]" />
    </span>
  );
}
