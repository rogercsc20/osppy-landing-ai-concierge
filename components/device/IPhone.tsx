"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Photoreal iPhone chassis — the single phone frame for the whole site
 * (hero chat, solution chat, the unlock act). Pure chassis: screen content
 * comes as children and fills a 9:19.5 screen; the chassis owns the
 * titanium rail, antenna lines, side buttons, Dynamic Island (with camera),
 * glass sheen, home indicator, and grounding shadows.
 *
 * Everything scales off `width` so the 380px chat phone and the 300px act
 * phone are the same component.
 */
export function IPhone({
  width = 380,
  float = false,
  className,
  children,
}: {
  width?: number;
  float?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const s = width / 380; // scale factor relative to the reference design
  const railR = Math.round(52 * s); // outer chassis radius
  const screenR = Math.round(40 * s);

  const px = (v: number) => Math.round(v * s);

  // titanium rail: light catches top + lower-right, deep shadow south
  const rail: CSSProperties = {
    borderRadius: railR,
    background:
      "conic-gradient(from 215deg, #43444a, #1b1c1f 12%, #2d2e33 26%, #131417 42%, #25262b 55%, #0e0f11 68%, #494a51 84%, #26272c 93%, #43444a)",
  };

  const button: CSSProperties = {
    background: "linear-gradient(to right, #3c3d43, #17181b)",
  };

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ width: `min(${width}px, 90vw)` }}
      animate={float ? { y: [0, -8, 0] } : undefined}
      transition={
        float ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : undefined
      }
    >
      {/* grounding: contact shadow below the device */}
      <div
        aria-hidden="true"
        className="absolute -bottom-7 left-1/2 h-7 w-[72%] -translate-x-1/2 rounded-[100%] bg-black/55 blur-xl"
      />

      {/* side buttons — slightly proud of the rail */}
      <div aria-hidden="true">
        {/* action */}
        <span
          className="absolute -left-[2px] z-0 w-[3px] rounded-l-md"
          style={{ ...button, top: "17.5%", height: px(22) }}
        />
        {/* volume up / down */}
        <span
          className="absolute -left-[2px] z-0 w-[3px] rounded-l-md"
          style={{ ...button, top: "24.5%", height: px(38) }}
        />
        <span
          className="absolute -left-[2px] z-0 w-[3px] rounded-l-md"
          style={{ ...button, top: "31.5%", height: px(38) }}
        />
        {/* power */}
        <span
          className="absolute -right-[2px] z-0 w-[3px] rounded-r-md"
          style={{
            background: "linear-gradient(to left, #3c3d43, #17181b)",
            top: "26.5%",
            height: px(60),
          }}
        />
      </div>

      {/* chassis: titanium rail */}
      <div
        className="relative z-10 p-[3px] shadow-[0_38px_80px_-24px_rgba(0,0,0,0.88)]"
        style={rail}
      >
        {/* rail edge definition */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/15"
        />

        {/* antenna lines — four subtle breaks in the metal */}
        <div aria-hidden="true">
          <span className="absolute left-[18%] top-0 h-[3px] w-px bg-black/60" />
          <span className="absolute right-[18%] top-0 h-[3px] w-px bg-black/60" />
          <span className="absolute bottom-0 left-[18%] h-[3px] w-px bg-black/60" />
          <span className="absolute bottom-0 right-[18%] h-[3px] w-px bg-black/60" />
        </div>

        {/* body bezel */}
        <div
          className="bg-[#060607] p-[7px]"
          style={{ borderRadius: railR - 3 }}
        >
          {/* screen */}
          <div
            className="relative aspect-[9/19.5] overflow-hidden bg-[#0b141a]"
            style={{ borderRadius: screenR }}
          >
            {children}

            {/* Dynamic Island with camera lens */}
            <div
              className="absolute left-1/2 z-40 -translate-x-1/2 rounded-full bg-black"
              style={{ top: px(11), width: px(98), height: px(28) }}
            >
              <span
                className="absolute top-1/2 -translate-y-1/2 rounded-full bg-[#0e1420] ring-1 ring-white/10"
                style={{ right: px(8), width: px(12), height: px(12) }}
              >
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: px(6),
                    height: px(6),
                    background:
                      "radial-gradient(circle at 35% 30%, #2c5a8f, #0a1828 65%)",
                  }}
                />
                <span
                  className="absolute rounded-full bg-white/40"
                  style={{ left: px(3), top: px(2.5), width: px(1.6), height: px(1.6) }}
                />
              </span>
            </div>

            {/* glass sheen + top edge light */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-50"
              style={{
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.02) 18%, transparent 32%)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 z-50 h-px bg-white/15"
            />

            {/* home indicator */}
            <div
              className="absolute bottom-2 left-1/2 z-40 -translate-x-1/2 rounded-full bg-white/40"
              style={{ width: px(120), height: px(5) }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
