"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, type Transition } from "framer-motion";
import { Check } from "lucide-react";
import { LogoGlyph } from "@/components/ui/Logo";

export interface ChatMessage {
  id: number | string;
  text: string;
  sender: "guest" | "osppy";
  time: string;
  /** render with no entrance animation (e.g. server-seeded first message) */
  instant?: boolean;
}

// Premium, springy bubble entrance — replaces the old linear slide.
const bubbleSpring: Transition = {
  type: "spring",
  stiffness: 460,
  damping: 34,
  mass: 0.7,
};

/**
 * A single chat bubble. `outgoing` = right side, WhatsApp green (the account
 * holder). `!outgoing` = left side, dark incoming bubble.
 */
export function MessageBubble({
  text,
  time,
  outgoing,
  showTicks = false,
  reduce = false,
}: {
  text: string;
  time: string;
  outgoing: boolean;
  showTicks?: boolean;
  reduce?: boolean;
}) {
  return (
    <motion.div
      className={`flex max-w-[82%] ${outgoing ? "self-end" : "self-start"}`}
      initial={reduce ? false : { opacity: 0, scale: 0.9, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : bubbleSpring}
    >
      <div
        className={`rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed shadow-md shadow-black/20 ${
          outgoing
            ? "bg-[#25d366] text-[#072018] rounded-br-md"
            : "bg-[#1e2d3d] text-white rounded-bl-md"
        }`}
        style={{ whiteSpace: "pre-line" }}
      >
        {text}
        <span
          className={`float-right ml-2 mt-1 inline-flex translate-y-0.5 items-center gap-0.5 text-[10px] ${
            outgoing ? "text-[#072018]/55" : "text-white/40"
          }`}
        >
          {time}
          {outgoing && showTicks && (
            <span className="inline-flex">
              <Check className="-mr-1.5 h-3 w-3 text-sky-300" />
              <Check className="h-3 w-3 text-sky-300" />
            </span>
          )}
        </span>
      </div>
    </motion.div>
  );
}

/** Incoming "…typing" bubble with bouncing dots. */
export function TypingIndicator({ reduce = false }: { reduce?: boolean }) {
  return (
    <motion.div
      className="flex self-start"
      initial={reduce ? false : { opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={reduce ? { duration: 0 } : bubbleSpring}
    >
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#1e2d3d] px-4 py-3">
        <span className="typing-dot inline-block h-2 w-2 rounded-full bg-white/50" />
        <span className="typing-dot inline-block h-2 w-2 rounded-full bg-white/50" />
        <span className="typing-dot inline-block h-2 w-2 rounded-full bg-white/50" />
      </div>
    </motion.div>
  );
}

/** Auto-scrolls to the bottom whenever its dependency list changes. */
export function ChatViewport({
  children,
  scrollKey,
  className = "",
}: {
  children: ReactNode;
  scrollKey: unknown;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [scrollKey]);
  return (
    <div
      ref={ref}
      className={`flex flex-col overflow-y-auto bg-wa-dots bg-[#0b141a] px-3 py-4 ${className}`}
    >
      {/* mt-auto bottom-anchors a short conversation so it hugs the input
          instead of leaving a large empty void at the top */}
      <div className="mt-auto flex flex-col gap-2">{children}</div>
    </div>
  );
}

/**
 * WhatsApp-style phone chrome. Caller supplies the conversation (`children`)
 * and the footer (input bar or suggestion chips).
 */
export function PhoneFrame({
  title,
  subtitle,
  avatar,
  children,
  footer,
  float = false,
}: {
  title: string;
  subtitle: string;
  avatar: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  float?: boolean;
}) {
  return (
    <motion.div
      className="relative mx-auto w-[min(380px,90vw)]"
      animate={float ? { y: [0, -8, 0] } : undefined}
      transition={
        float
          ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    >
      {/* soft ambient glow */}
      <div className="absolute -inset-8 -z-10 rounded-[4rem] bg-turquoise/10 blur-3xl" />

      {/* iPhone titanium frame */}
      <div className="rounded-[3.2rem] bg-gradient-to-b from-[#2a2a2e] to-[#141416] p-[10px] shadow-2xl shadow-black/50 ring-1 ring-white/10">
        {/* screen — fixed iPhone aspect ratio, independent of content */}
        <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[2.6rem] bg-[#0b141a]">
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-[11px] z-30 h-[28px] w-[98px] -translate-x-1/2 rounded-full bg-black" />

          {/* status bar + WhatsApp header */}
          <div className="flex-shrink-0 bg-[#1f2c33] px-5 pt-3.5 pb-0">
            <div className="mb-1.5 flex items-center justify-between px-1 text-[13px] text-white">
              <span className="font-semibold tracking-tight">9:41</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-[2px]">
                  {[3, 4, 5, 6].map((h, i) => (
                    <div
                      key={i}
                      className="w-[3px] rounded-[1px] bg-white"
                      style={{ height: `${h + 2}px` }}
                    />
                  ))}
                </div>
                <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M1.5 8.5C5.9 4.1 11.9 2 17 2s11.1 2.1 15.5 6.5L30 11c-3.6-3.6-8.5-5-13-5s-9.4 1.4-13 5L1.5 8.5z" />
                </svg>
                <div className="flex h-3 w-6 items-center rounded-[3px] border border-white/80 px-[2px]">
                  <div className="h-[7px] w-full rounded-[1px] bg-white" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2.5">
              {avatar}
              <div className="flex-1">
                <p className="text-[15px] font-semibold leading-tight text-white">
                  {title}
                </p>
                <p className="text-[12px] text-[#25d366]">{subtitle}</p>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.1-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0C7.1 14.3 4 11.2 4 7.5s3.1-6.8 6.8-6.8 6.8 3.1 6.8 6.8-3.1 6.8-6.9 6.8z" />
                </svg>
                <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* chat fills the remaining space — fixed, content-independent */}
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>

          {/* footer slot */}
          <div className="flex-shrink-0 border-t border-white/5 bg-[#1f2c33] px-3 pt-3 pb-2">
            {footer}
          </div>

          {/* iOS home indicator */}
          <div className="flex flex-shrink-0 justify-center bg-[#1f2c33] pb-2 pt-1">
            <div className="h-[5px] w-[120px] rounded-full bg-white/35" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function OsppyAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  return (
    <div
      className={`flex ${dim} flex-shrink-0 items-center justify-center rounded-full bg-turquoise text-white`}
    >
      <LogoGlyph className="h-[58%] w-[58%]" />
    </div>
  );
}
