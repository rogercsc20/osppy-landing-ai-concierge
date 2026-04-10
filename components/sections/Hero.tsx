"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { useTranslations } from "next-intl";
import { WhatsAppMockup } from "@/components/ui/WhatsAppMockup";
import { ArrowRight, ChevronDown } from "lucide-react";

export function Hero() {
  const t = useTranslations();
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: "easeOut" } as Transition,
  });

  return (
    <section className="relative min-h-screen flex items-center bg-grid-pattern bg-[#080e1a] pt-16 overflow-hidden">
      {/* Radial glow behind content */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4a90e2]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: copy */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Badge */}
            <motion.div {...fadeUp(0.1)}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4a90e2]/30 bg-[#4a90e2]/10 text-[#4a90e2] text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25d366] animate-pulse" />
                Activo en +15 hoteles en México
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.2)}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white"
              style={{ fontFamily: "var(--font-geist), sans-serif" }}
            >
              {t("hero.headline")}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              {...fadeUp(0.35)}
              className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-xl"
            >
              {t("hero.subheadline")}
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.5)} className="flex flex-col sm:flex-row gap-3">
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#4a90e2] text-[#0a1628] font-semibold text-base hover:scale-[1.02] transition-transform"
              >
                {t("hero.cta.primary")}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-white font-medium text-base hover:border-white/40 transition-colors"
              >
                {t("hero.cta.secondary")}
                <ChevronDown className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Trust micro-copy */}
            <motion.p {...fadeUp(0.65)} className="text-xs text-white/30">
              Sin tarjeta de crédito · Demo en 20 minutos · Cancelación libre
            </motion.p>
          </div>

          {/* Right: WhatsApp mockup */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <WhatsAppMockup variant="animated" />
          </motion.div>
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
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-5 h-5 text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}
