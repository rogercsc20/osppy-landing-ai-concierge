import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * macOS-style app window — frames the dashboard as "the real product,
 * running" (replaces the CSS MacBook). Traffic lights, a quiet URL pill,
 * glass border, deep layered shadow.
 *
 * `invert` stamps `data-panel="invert"` on the wrapper, which re-points the
 * surface palette inside this subtree to the opposite mode (globals.css,
 * HQA-D91). The chrome below had to stop hard-coding white for that to mean
 * anything: `border-white/10` is invisible on an ivory panel and
 * `bg-white/[0.03]` does nothing there, so the frame read as broken while
 * the body read as inverted. It uses the tokens now, which follow the
 * attribute, so ONE prop flips the whole window and not just its contents.
 */
export function AppWindow({
  children,
  className,
  /** fixed 16:10 body that scrolls internally (mobile fallback) */
  compact = false,
  /** wear the opposite mode's surface palette (HQA-D91) */
  invert = false,
}: {
  children: ReactNode;
  className?: string;
  compact?: boolean;
  invert?: boolean;
}) {
  return (
    <div className={cn("relative", className)} data-panel={invert ? "invert" : undefined}>
      {/* under-glow seats the window on the stage */}
      <div
        aria-hidden="true"
        className="absolute inset-x-6 bottom-0 top-1/3 -z-10 rounded-[3rem] bg-accent/10 blur-3xl"
      />

      <div className="relative overflow-hidden rounded-xl border border-line bg-surface shadow-[0_60px_120px_-32px_rgba(0,0,0,0.45)]">
        {/* top edge catch-light */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-px bg-text/10" />

        {/* title bar */}
        <div
          aria-hidden="true"
          className="flex h-11 flex-shrink-0 items-center border-b border-line bg-text/[0.03] px-4"
        >
          <div className="flex w-[52px] items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-inset ring-black/20" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-inset ring-black/20" />
            <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-inset ring-black/20" />
          </div>

          <div className="mx-auto flex items-center gap-1.5 rounded-md bg-text/10 px-3 py-1 text-[11px] text-text-2">
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-current">
              <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 116 0v3H9z" />
            </svg>
            app.osppy.com
          </div>

          {/* balances the traffic-light cluster so the pill stays centered */}
          <div className="w-[52px]" />
        </div>

        {/* body */}
        <div
          className={cn(
            compact &&
              "aspect-[16/10] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
