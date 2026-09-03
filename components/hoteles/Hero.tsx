"use client";

import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Tilt } from "@/components/fx/Tilt";
import { FxLayer } from "@/components/fx/FxLayer";
import { ShineButton } from "@/components/ui/ShineButton";
import { whatsappHref } from "@/lib/site";
import { HeroChat } from "./HeroChat";

/* The hotel hero (HQA-D38, D31): the product's teal accent over whichever
   ground the reader chose — no clipping, no band, no aurora (trap 4) — with
   the real interactive chat as the hero image. The hero's own light sits in
   an FxLayer so it bleeds into the section below instead of ending on an
   edge, and the section is one viewport minus the bar, in svh so a phone's
   collapsing browser chrome does not cut it. */
export function Hero() {
  const t = useTranslations("hoteles.hero");
  const reduce = useReducedMotion();

  // CSS-driven entrances: the h1 is the LCP element (see globals.css).
  const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center pt-16">
      <FxLayer>
        <div
          className="absolute inset-x-0 -top-16 bottom-[-30%]"
          style={{
            background:
              "radial-gradient(120% 90% at 70% -10%, color-mix(in srgb, var(--accent) 30%, transparent), transparent 60%), radial-gradient(80% 60% at 15% 0%, color-mix(in srgb, var(--accent-text) 12%, transparent), transparent 55%)",
          }}
        />
      </FxLayer>

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
              <ShineButton
                href={whatsappHref(t("ctaMessage"))}
                className="shadow-[0_0_40px_-8px_color-mix(in_srgb,var(--accent)_70%,transparent)]"
              >
                {t("cta")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </ShineButton>
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
