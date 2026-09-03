"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMotionOK } from "@/components/fx/motion-hooks";

/**
 * A glass card whose border lights where the cursor is. The light is painted
 * by a border-sized gradient behind the content, so the card keeps its
 * hairline in both modes and needs no extra element in the flow.
 */
export function GlowCard({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const ok = useMotionOK();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Tag
      ref={ref as never}
      onPointerMove={
        ok
          ? (e: React.PointerEvent) => {
              const el = ref.current;
              if (!el) return;
              const r = el.getBoundingClientRect();
              el.style.setProperty("--mx", `${e.clientX - r.left}px`);
              el.style.setProperty("--my", `${e.clientY - r.top}px`);
            }
          : undefined
      }
      className={cn(
        "group glass relative isolate h-full overflow-hidden rounded-2xl transition-colors duration-300",
        ok && "hover:border-accent-text/30",
        className,
      )}
    >
      {ok && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--accent-text) 10%, transparent), transparent 70%)",
          }}
        />
      )}
      {children}
    </Tag>
  );
}
