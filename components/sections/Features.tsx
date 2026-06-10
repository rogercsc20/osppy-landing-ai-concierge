"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SplitWords } from "@/components/fx/SplitWords";
import { cn } from "@/lib/utils";

/* ── Bento card with a cursor-tracking spotlight ─────────────────────── */

function BentoCard({
  title,
  body,
  span,
  children,
}: {
  title: string;
  body: string;
  span: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        ref.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-7 transition-colors hover:border-turquoise-ink/25",
        span,
      )}
    >
      {/* cursor spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(47,196,217,0.08), transparent 70%)",
        }}
      />
      {children && (
        <div aria-hidden="true" className="relative mb-7">
          {children}
        </div>
      )}
      <div className="relative">
        <h3 className="mb-1.5 font-semibold text-ink">{title}</h3>
        <p className="text-sm leading-relaxed text-ink/70">{body}</p>
      </div>
    </div>
  );
}

/* ── Micro-widgets (decorative, aria-hidden via BentoCard) ───────────── */

function ChatStripWidget() {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-fit max-w-[75%] rounded-2xl rounded-bl-md bg-wa-bubble px-3.5 py-2 text-[12px] text-white/90">
        ¿Tienen alberca? 🏊
      </div>
      <div className="flex w-fit items-center gap-1.5 self-end rounded-2xl rounded-br-md bg-wa-green px-3.5 py-2.5">
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[#072018]/70" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[#072018]/70" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[#072018]/70" />
      </div>
    </div>
  );
}

function ClockWidget() {
  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <div className="absolute inset-0 rounded-full border border-line" />
      <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full [background:conic-gradient(from_0deg,rgba(47,196,217,0.5),transparent_25%)] [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),black_calc(100%-1px))]" />
      <span className="font-display text-lg font-semibold text-ink">24/7</span>
    </div>
  );
}

const GREETINGS = ["Hola", "Hello", "Olá"];

function LanguageWidget() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % GREETINGS.length), 1800);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="flex h-20 items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={GREETINGS[i]}
          initial={reduce ? false : { y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? undefined : { y: -18, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="font-display text-4xl font-semibold text-turquoise-ink"
        >
          {GREETINGS[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function EscalationWidget({ ai, you }: { ai: string; you: string }) {
  return (
    <div className="flex h-20 items-center gap-3">
      <span className="rounded-full bg-turquoise-ink/15 px-3 py-1.5 text-xs font-medium text-turquoise-ink">
        {ai}
      </span>
      <div className="relative h-px flex-1 overflow-hidden bg-line">
        <span className="absolute top-1/2 h-[3px] w-10 -translate-y-1/2 animate-[beam-travel_2.2s_ease-in-out_infinite] rounded-full bg-turquoise-ink/80 blur-[1px]" />
      </div>
      <span className="rounded-full bg-coral/15 px-3 py-1.5 text-xs font-medium text-coral">
        {you}
      </span>
    </div>
  );
}

function SetupArcWidget() {
  const reduce = useReducedMotion();
  const C = 2 * Math.PI * 30;
  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg viewBox="0 0 68 68" className="absolute inset-0 -rotate-90">
        <circle cx="34" cy="34" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <motion.circle
          cx="34" cy="34" r="30" fill="none"
          stroke="#2fc4d9" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={C}
          initial={reduce ? { strokeDashoffset: C * 0.18 } : { strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: C * 0.18 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <span className="font-display text-base font-semibold text-ink">30m</span>
    </div>
  );
}

function ZeroFeeWidget({ otaLabel }: { otaLabel: string }) {
  return (
    <div className="flex h-20 items-baseline gap-4">
      <span className="font-display text-5xl font-semibold text-ink">0%</span>
      <span className="text-sm text-ink/50 line-through decoration-coral/70">{otaLabel}</span>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────── */

export function Features() {
  const t = useTranslations();

  return (
    <section className="relative bg-canvas px-4 py-32 sm:px-6 lg:py-44">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="mb-16 text-center lg:mb-20">
          <p className="eyebrow mb-5">{t("features.eyebrow")}</p>
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-ink">
            <SplitWords text={t("features.headline")} />
          </h2>
        </AnimatedSection>

        {/* AnimatedSection is the grid child so col-span applies (a wrapper
            between the grid and the card would swallow it) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {(
            [
              ["f1", "lg:col-span-4", <ChatStripWidget key="w" />],
              ["f2", "lg:col-span-2", <ClockWidget key="w" />],
              ["f3", "lg:col-span-2", <LanguageWidget key="w" />],
              ["f5", "lg:col-span-4", <EscalationWidget key="w" ai={t("dashboard.statusAI")} you={t("dashboard.statusYou")} />],
              ["f4", "lg:col-span-3", <SetupArcWidget key="w" />],
              ["f6", "lg:col-span-3", <ZeroFeeWidget key="w" otaLabel="OTA 20%" />],
            ] as const
          ).map(([key, span, widget], i) => (
            <AnimatedSection key={key} delay={i * 0.07} className={span}>
              <BentoCard
                title={t(`features.${key}.title`)}
                body={t(`features.${key}.body`)}
                span="h-full"
              >
                {widget}
              </BentoCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
