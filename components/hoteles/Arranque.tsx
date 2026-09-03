"use client";

import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { useTranslations } from "next-intl";
import { FileText, ShieldCheck, LayoutDashboard, Clock } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { EASE_LUXE } from "@/lib/motion";

/* Getting started (source of truth §4.9): three steps lit by a traveling
   beam; the callout says what sets the clock — Meta's verification, not
   the setup work — instead of promising minutes (trap 6). */
const IGNITE_BASE = 0.2;
const IGNITE_GAP = 0.32;

const circleVariants = (i: number): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren: IGNITE_BASE + i * IGNITE_GAP } },
});

const igniteVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: EASE_LUXE } },
};

export function Arranque() {
  const t = useTranslations("hoteles.arranque");
  const reduce = useReducedMotion();

  const steps = [
    { number: "01", icon: FileText, label: t("p1") },
    { number: "02", icon: ShieldCheck, label: t("p2") },
    { number: "03", icon: LayoutDashboard, label: t("p3") },
  ];

  return (
    <section className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-20 text-center lg:mb-28">
          <p className="eyebrow mb-5">{t("kicker")}</p>
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-text">
            <SplitText text={t("headline")} />
          </h2>
        </Reveal>

        <motion.div
          className="relative"
          initial={reduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <div className="absolute left-[16.5%] right-[16.5%] top-[2.25rem] hidden h-px overflow-hidden lg:block">
            <div className="absolute inset-0 bg-line" />
            <motion.div
              className="absolute inset-0 origin-left bg-gradient-to-r from-accent-text/0 via-accent-text to-accent-text/40"
              variants={{
                hidden: { scaleX: 0 },
                visible: { scaleX: 1, transition: { duration: reduce ? 0 : 1.2, ease: "easeInOut", delay: 0.2 } },
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
                {i < steps.length - 1 && (
                  <div className="absolute left-[1.35rem] top-[4.75rem] bottom-[-2rem] w-px bg-line lg:hidden" />
                )}
                <motion.div variants={igniteVariants} className="relative flex-shrink-0">
                  <div
                    className="glass flex h-11 w-11 items-center justify-center rounded-full border-accent-text/40 lg:h-[4.5rem] lg:w-[4.5rem]"
                    style={{ boxShadow: "0 0 28px -4px color-mix(in srgb, var(--accent-text) 45%, transparent)" }}
                  >
                    <Icon className="h-4 w-4 text-accent-text lg:h-6 lg:w-6" strokeWidth={1.5} />
                  </div>
                  <span className="absolute -right-1 -top-2 font-display text-xs font-semibold text-accent-text lg:-right-2">
                    {number}
                  </span>
                </motion.div>
                <motion.p variants={igniteVariants} className="max-w-[300px] pt-2 leading-relaxed text-text/85 lg:pt-0 lg:text-[17px]">
                  {label}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Reveal delay={0.3} className="mt-20 text-center">
          <span className="inline-flex max-w-2xl items-start gap-2.5 rounded-2xl glass px-5 py-3 text-left text-sm leading-relaxed text-text-2 sm:items-center sm:rounded-full">
            <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-text sm:mt-0" aria-hidden="true" />
            {t("nota")}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
