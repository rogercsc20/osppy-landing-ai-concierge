"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { useTranslations } from "next-intl";
import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { GlowCard } from "@/components/ui/GlowCard";

/* ── Bento card with a cursor-tracking spotlight ─────────────────────── */

function BentoCard({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <GlowCard className="flex flex-col justify-between p-7">
      {children && (
        <div aria-hidden="true" className="relative mb-7">
          {children}
        </div>
      )}
      <div className="relative">
        <h3 className="mb-1.5 font-semibold text-text">{title}</h3>
        <p className="text-sm leading-relaxed text-text-2">{body}</p>
      </div>
    </GlowCard>
  );
}

/* ── Micro-widgets (decorative, aria-hidden via BentoCard) ───────────── */

function ChatStripWidget({ q1, a1, q2 }: { q1: string; a1: string; q2: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-fit max-w-[75%] rounded-2xl rounded-bl-md bg-wa-bubble px-3.5 py-2 text-[12px] text-white/90">{q1}</div>
      <div className="w-fit max-w-[80%] self-end rounded-2xl rounded-br-md bg-wa-green px-3.5 py-2 text-[12px] text-[#072018]">{a1}</div>
      <div className="w-fit max-w-[75%] rounded-2xl rounded-bl-md bg-wa-bubble px-3.5 py-2 text-[12px] text-white/90">{q2}</div>
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
      <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full [background:conic-gradient(from_0deg,color-mix(in_srgb,var(--accent-text)_50%,transparent),transparent_25%)] [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),black_calc(100%-1px))]" />
      <span className="font-display text-lg font-semibold text-text">24/7</span>
    </div>
  );
}

function LanguageWidget({ words }: { words: string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 1800);
    return () => clearInterval(id);
  }, [reduce, words.length]);

  return (
    <div className="flex h-20 items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          initial={reduce ? false : { y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? undefined : { y: -18, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="font-display text-4xl font-semibold text-accent-text"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function ApprovalWidget({ title, approve, decline }: { title: string; approve: string; decline: string }) {
  return (
    <div className="flex h-20 items-center">
      <div className="w-full max-w-[280px] overflow-hidden rounded-2xl rounded-bl-md bg-wa-bubble text-[12px] text-white/90">
        <p className="px-3.5 pt-2.5 pb-2 font-medium">{title}</p>
        <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10">
          <span className="relative py-2 text-center font-medium text-accent-text">
            {approve}
            <span className="absolute inset-0 -z-10 animate-pulse bg-accent-text/10" />
          </span>
          <span className="py-2 text-center text-white/60">{decline}</span>
        </div>
      </div>
    </div>
  );
}

function EscalationWidget({ ai, you }: { ai: string; you: string }) {
  return (
    <div className="flex h-20 items-center gap-3">
      <span className="rounded-full bg-accent-text/15 px-3 py-1.5 text-xs font-medium text-accent-text">{ai}</span>
      <div className="relative h-px flex-1 overflow-hidden bg-line">
        <span className="absolute top-1/2 h-[3px] w-10 -translate-y-1/2 animate-[beam-travel_2.2s_ease-in-out_infinite] rounded-full bg-accent-text/80 blur-[1px]" />
      </div>
      <span className="rounded-full bg-warm/15 px-3 py-1.5 text-xs font-medium text-warm">{you}</span>
    </div>
  );
}

function ChecklistWidget({ items }: { items: string[] }) {
  return (
    <ul className="flex h-20 flex-col justify-center gap-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2 text-[12px] text-text-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-text/15 text-accent-text">
            <Check className="h-2.5 w-2.5" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── Section ─────────────────────────────────────────────────────────── */

export function Funciones() {
  const t = useTranslations("hoteles.funciones");
  const w = (k: string) => t(`widgets.${k}`);

  const cards = [
    ["f1", "lg:col-span-4", <ChatStripWidget key="w" q1={w("chatQ1")} a1={w("chatA1")} q2={w("chatQ2")} />],
    ["f2", "lg:col-span-2", <ClockWidget key="w" />],
    ["f3", "lg:col-span-2", <LanguageWidget key="w" words={[w("hola"), w("hello")]} />],
    ["f4", "lg:col-span-4", <ApprovalWidget key="w" title={w("reserva")} approve={w("aprobar")} decline={w("rechazar")} />],
    ["f5", "lg:col-span-3", <EscalationWidget key="w" ai={w("diana")} you={w("tu")} />],
    ["f6", "lg:col-span-3", <ChecklistWidget key="w" items={[w("check1"), w("check2"), w("check3")]} />],
  ] as const;

  const nos = (["n1", "n2", "n3", "n4"] as const).map((k) => t(`no.${k}`));

  return (
    <section className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 text-center lg:mb-20">
          <p className="eyebrow mb-5">{t("kicker")}</p>
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-text">
            <SplitText text={t("headline")} />
          </h2>
        </Reveal>

        {/* Reveal is the grid child so col-span applies */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {cards.map(([key, span, widget], i) => (
            <Reveal key={key} delay={i * 0.07} className={span}>
              <BentoCard title={t(`${key}.titulo`)} body={t(`${key}.body`)}>
                {widget}
              </BentoCard>
            </Reveal>
          ))}
        </div>

        {/* What it deliberately does not do (source of truth §4.6) */}
        <Reveal delay={0.2} className="mx-auto mt-16 max-w-4xl">
          <h3 className="eyebrow mb-5">{t("no.titulo")}</h3>
          <ul className="grid gap-x-10 gap-y-3 border-t border-line pt-6 sm:grid-cols-2">
            {nos.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-text-2">
                <Minus className="mt-[7px] h-3.5 w-3.5 flex-shrink-0 text-warm" strokeWidth={2.5} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
