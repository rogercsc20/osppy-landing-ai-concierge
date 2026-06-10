"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SplitWords } from "@/components/fx/SplitWords";
import { MessageSquare, Database, Sparkles } from "lucide-react";
import { EASE_LUXE } from "@/lib/motion";

const IGNITE_BASE = 0.35; // beam reaches step i at roughly BASE + i * GAP
const IGNITE_GAP = 0.55;

const circleVariants = (i: number): Variants => ({
  hidden: {},
  visible: {
    transition: { delayChildren: IGNITE_BASE + i * IGNITE_GAP },
  },
});

// hidden must be opacity 0 (not dimmed): a dimmed pre-state is what
// contrast audits see for below-the-fold content
const igniteVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_LUXE },
  },
};

export function HowItWorks() {
  const t = useTranslations();
  const reduce = useReducedMotion() ?? false;

  const steps = [
    { number: "01", icon: MessageSquare, label: t("how.step1") },
    { number: "02", icon: Database, label: t("how.step2") },
    { number: "03", icon: Sparkles, label: t("how.step3") },
  ];

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-sand px-4 py-32 sm:px-6 lg:py-44">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="mb-20 text-center lg:mb-28">
          <p className="eyebrow mb-5">{t("how.eyebrow")}</p>
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-ink">
            <SplitWords text={t("how.headline")} />
          </h2>
        </AnimatedSection>

        <motion.div
          className="relative"
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {/* The beam: draws across the rail, igniting each step it reaches */}
          <div className="absolute left-[16.5%] right-[16.5%] top-[2.25rem] hidden h-px overflow-hidden lg:block">
            <div className="absolute inset-0 bg-line" />
            <motion.div
              className="absolute inset-0 origin-left bg-gradient-to-r from-turquoise-ink/0 via-turquoise-ink to-turquoise-ink/40"
              variants={{
                hidden: { scaleX: 0 },
                visible: {
                  scaleX: 1,
                  transition: { duration: reduce ? 0 : 1.7, ease: "easeInOut", delay: 0.2 },
                },
              }}
            />
          </div>

          <div className="relative grid gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map(({ number, icon: Icon, label }, i) => (
              <motion.div
                key={number}
                variants={circleVariants(i)}
                className="relative flex items-start gap-5 lg:flex-col lg:items-center lg:gap-5 lg:text-center"
              >
                {/* mobile rail */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[1.35rem] top-[4.75rem] bottom-[-2rem] w-px bg-line lg:hidden" />
                )}

                <motion.div variants={igniteVariants} className="relative flex-shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-turquoise-ink/40 bg-canvas shadow-[0_0_28px_-4px_rgba(47,196,217,0.45)] lg:h-[4.5rem] lg:w-[4.5rem]">
                    <Icon className="h-4 w-4 text-turquoise-ink lg:h-6 lg:w-6" strokeWidth={1.5} />
                  </div>
                  <span className="absolute -right-1 -top-2 bg-sand px-1 font-display text-xs font-semibold text-turquoise-ink lg:-right-2">
                    {number}
                  </span>
                </motion.div>

                <motion.p
                  variants={igniteVariants}
                  className="max-w-[260px] pt-2 font-medium leading-snug text-ink/85 lg:pt-0 lg:text-lg"
                >
                  {label}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Time callout */}
        <AnimatedSection delay={0.3} className="mt-20 text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-ink/80">
            <span className="h-2 w-2 animate-pulse rounded-full bg-wa-green" />
            {t("how.callout")}
          </span>
        </AnimatedSection>
      </div>
    </section>
  );
}
