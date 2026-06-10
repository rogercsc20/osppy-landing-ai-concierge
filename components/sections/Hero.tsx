"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { InteractiveChat } from "@/components/ui/chat/InteractiveChat";
import { ArrowRight, ChevronDown } from "lucide-react";

export function Hero() {
  const t = useTranslations();
  const shouldReduceMotion = useReducedMotion();

  // CSS-driven entrance (not framer initial/animate): the headline is the
  // LCP element, so it must paint before hydration, like the chat phone.
  const rise = (delay: number) =>
    ({ "--rise-delay": `${delay}s` }) as React.CSSProperties;

  return (
    <section className="relative min-h-screen flex items-center bg-grid-pattern bg-canvas pt-16 overflow-hidden">
      {/* Warm ember glow behind content */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ember rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: copy */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Eyebrow */}
            <div className="animate-fade-rise" style={rise(0.1)}>
              <span className="eyebrow inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-wa-green animate-pulse" />
                {t("hero.badge")}
              </span>
            </div>

            {/* Headline — rise without fade: it's the LCP element */}
            <h1
              className="animate-rise-only font-display text-[clamp(3.25rem,6.75vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink"
              style={rise(0.1)}
            >
              {t("hero.headline")}
            </h1>

            {/* Subheadline */}
            <p
              className="animate-fade-rise text-lg sm:text-xl text-ink/70 leading-relaxed max-w-xl"
              style={rise(0.35)}
            >
              {t("hero.subheadline")}
            </p>

            {/* CTAs: one turquoise button, one quiet text link */}
            <div
              className="animate-fade-rise flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7"
              style={rise(0.5)}
            >
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-turquoise-deep text-white font-semibold text-base hover:bg-turquoise transition-colors"
              >
                {t("hero.cta.primary")}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-2 text-base font-medium text-ink hover:text-turquoise-deep transition-colors"
              >
                {t("hero.cta.secondary")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            {/* Trust micro-copy */}
            <p className="animate-fade-rise text-xs text-ink/70" style={rise(0.65)}>
              {t("hero.trust")}
            </p>
          </div>

          {/* Right: interactive chat — CSS entrance (paints immediately, no
              hydration gap), so the seeded conversation is always visible */}
          <div className="flex justify-center lg:justify-end animate-phone-in">
            <InteractiveChat />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-5 h-5 text-ink/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}
