"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { InteractiveChat } from "@/components/ui/chat/InteractiveChat";
import { Tilt } from "@/components/fx/Tilt";
import { Magnetic } from "@/components/fx/Magnetic";
import { ArrowRight, ChevronDown } from "lucide-react";

// WebGL loads after hydration; the CSS gradient beneath covers first paint.
const Aurora = dynamic(() => import("@/components/fx/Aurora"), { ssr: false });

export function Hero() {
  const t = useTranslations();
  const shouldReduceMotion = useReducedMotion();

  // CSS-driven entrances: the headline is the LCP element and must paint
  // before hydration (see globals.css).
  const rise = (delay: number) =>
    ({ "--rise-delay": `${delay}s` }) as React.CSSProperties;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-canvas pt-16">
      {/* ── Scene backdrop: gradient base → WebGL aurora → grid → fade ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 70% -10%, rgba(13, 127, 149, 0.32), transparent 60%), radial-gradient(80% 60% at 15% 0%, rgba(34, 196, 217, 0.12), transparent 55%)",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 opacity-40 mix-blend-screen sm:opacity-60">
        <Aurora className="absolute inset-0" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-grid-pattern mask-radial-fade" />
      {/* fade the scene into the page canvas */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-canvas"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* ── Left: copy ── */}
          <div className="flex flex-col gap-7 lg:col-span-7">
            <div className="animate-fade-rise" style={rise(0.1)}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink/80 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wa-green opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-wa-green" />
                </span>
                {t("hero.badge")}
              </span>
            </div>

            {/* Headline — rise without fade: it's the LCP element */}
            <h1
              className="animate-rise-only font-display text-[clamp(3.5rem,7.5vw,6.5rem)] font-semibold leading-[0.98] tracking-[-0.025em] text-ink"
              style={rise(0.1)}
            >
              {t("hero.headline")}
            </h1>

            <p
              className="animate-fade-rise max-w-xl text-lg leading-relaxed text-ink/70 sm:text-xl"
              style={rise(0.3)}
            >
              {t("hero.subheadline")}
            </p>

            <div
              className="animate-fade-rise flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8"
              style={rise(0.45)}
            >
              <Magnetic>
                <a
                  href="#demo"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-turquoise-deep px-8 py-4 text-base font-semibold text-white shadow-[0_0_40px_-8px_rgba(18,157,181,0.7)] transition-colors hover:bg-turquoise"
                >
                  {/* sheen sweep */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                  />
                  {t("hero.cta.primary")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Magnetic>
              <a
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-2 text-base font-medium text-ink/80 transition-colors hover:text-turquoise-ink"
              >
                {t("hero.cta.secondary")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <p className="animate-fade-rise text-xs text-ink/60" style={rise(0.6)}>
              {t("hero.trust")}
            </p>
          </div>

          {/* ── Right: the live chat, pointer-tracked in 3D ── */}
          <div className="animate-phone-in flex justify-center lg:col-span-5 lg:justify-end">
            <Tilt max={shouldReduceMotion ? 0 : 7} className="relative">
              {/* halo behind the device */}
              <div
                aria-hidden="true"
                className="absolute -inset-10 -z-10 rounded-[5rem] bg-[radial-gradient(closest-side,rgba(34,196,217,0.28),rgba(255,107,74,0.08),transparent)] blur-2xl"
              />
              <InteractiveChat />
            </Tilt>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="h-5 w-5 text-ink/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
