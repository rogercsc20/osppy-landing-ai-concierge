"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Tilt } from "@/components/fx/Tilt";
import { Magnetic } from "@/components/fx/Magnetic";
import { whatsappHref } from "@/lib/site";
import { HeroChat } from "./HeroChat";

/* The hotel hero (L5, HQA-D27/D31): the product's Obsidian world as an
   object — always dark, its teal glow, no grid and no aurora (trap 4) —
   with the real interactive chat as the hero image. */
export function Hero() {
  const t = useTranslations("hoteles.hero");
  const reduce = useReducedMotion();

  // CSS-driven entrances: the h1 is the LCP element (see globals.css).
  const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-bg pt-16">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 70% -10%, color-mix(in srgb, var(--accent) 34%, transparent), transparent 60%), radial-gradient(80% 60% at 15% 0%, color-mix(in srgb, var(--accent-text) 12%, transparent), transparent 55%)",
        }}
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-7 lg:col-span-7">
            <div className="animate-fade-rise flex flex-wrap items-center gap-3" style={rise(0.1)}>
              <span className="eyebrow">{t("kicker")}</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-text/40 bg-accent-text/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-accent-text">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-text" />
                {t("estado")}
              </span>
            </div>

            <h1
              className="animate-rise-only font-display text-[clamp(2.4rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-text"
              style={rise(0.1)}
            >
              {t("headline")}
            </h1>

            <p className="animate-fade-rise max-w-xl text-lg leading-relaxed text-text-2 sm:text-xl" style={rise(0.3)}>
              {t("sub")}
            </p>

            <div className="animate-fade-rise flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8" style={rise(0.45)}>
              <Magnetic>
                <a
                  href={whatsappHref(t("ctaMessage"))}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-accent-text hover:text-bg"
                  style={{ boxShadow: "0 0 40px -8px color-mix(in srgb, var(--accent) 70%, transparent)" }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  {t("cta")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Magnetic>
              <a
                href="#circuito"
                className="group inline-flex items-center justify-center gap-2 text-base font-medium text-text-2 transition-colors hover:text-accent-text"
              >
                {t("secundario")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <p className="animate-fade-rise text-xs text-text-2" style={rise(0.6)}>
              {t("nota")}
            </p>
          </div>

          <div className="animate-phone-in flex flex-col items-center gap-5 lg:col-span-5 lg:items-end">
            <Tilt max={reduce ? 0 : 7} className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-10 -z-10 rounded-[5rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(closest-side, color-mix(in srgb, var(--accent-text) 28%, transparent), color-mix(in srgb, var(--warm) 8%, transparent), transparent)",
                }}
              />
              <HeroChat />
            </Tilt>
            <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-text-2">
              {t("demoEtiqueta")}
            </span>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown className="h-5 w-5 text-text/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
