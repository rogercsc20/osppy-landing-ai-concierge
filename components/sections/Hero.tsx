"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { useTranslations } from "next-intl";
import { InteractiveChat } from "@/components/ui/chat/InteractiveChat";
import { ArrowRight, ChevronDown } from "lucide-react";
import { DUR_REVEAL, EASE_LUXE } from "@/lib/motion";

export function Hero() {
  const t = useTranslations();
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DUR_REVEAL, delay, ease: EASE_LUXE } as Transition,
  });

  return (
    <section className="relative min-h-screen flex items-center bg-grid-pattern bg-canvas pt-16 overflow-hidden">
      {/* Warm ember glow behind content */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ember rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: copy */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Eyebrow */}
            <motion.div {...fadeUp(0.1)}>
              <span className="eyebrow inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-wa-green animate-pulse" />
                {t("hero.badge")}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.2)}
              className="font-display text-[clamp(3.25rem,6.75vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink"
            >
              {t("hero.headline")}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              {...fadeUp(0.35)}
              className="text-lg sm:text-xl text-ink/70 leading-relaxed max-w-xl"
            >
              {t("hero.subheadline")}
            </motion.p>

            {/* CTAs: one turquoise button, one quiet text link */}
            <motion.div
              {...fadeUp(0.5)}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7"
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
            </motion.div>

            {/* Trust micro-copy */}
            <motion.p {...fadeUp(0.65)} className="text-xs text-ink/50">
              {t("hero.trust")}
            </motion.p>
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
