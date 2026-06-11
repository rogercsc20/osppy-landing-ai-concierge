"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SplitWords } from "@/components/fx/SplitWords";

function ProblemRow({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // function-form mapping: numeric ranges get compiled to native
  // ScrollTimeline animations, which misbehave around sticky ancestors
  const y = useTransform(scrollYProgress, (v) => (reduce ? 0 : (0.5 - v) * 90));

  return (
    <div ref={ref} className="relative border-b border-line">
      {/* ghost numeral, parallax-drifting behind the row — rendered as
          pseudo-element content (not a text node) so contrast audits
          correctly treat it as decoration */}
      <motion.span
        aria-hidden="true"
        style={{ y }}
        data-num={`0${index + 1}`}
        className="pointer-events-none absolute -top-10 right-0 select-none font-display text-[clamp(9rem,22vw,18rem)] font-semibold leading-none text-white/[0.045] after:content-[attr(data-num)] lg:-top-16 lg:right-8"
      />

      <AnimatedSection className="relative z-10 grid gap-3 py-16 sm:grid-cols-12 sm:gap-8 lg:py-24">
        <span className="font-display text-xl font-semibold text-turquoise-ink/70 sm:col-span-1">
          0{index + 1}
        </span>
        <h3 className="font-display text-2xl font-semibold leading-snug text-ink sm:col-span-5 lg:text-3xl">
          {title}
        </h3>
        <p className="max-w-md text-base leading-relaxed text-ink/70 sm:col-span-6 lg:text-lg">
          {body}
        </p>
      </AnimatedSection>
    </div>
  );
}

export function Problem() {
  const t = useTranslations();

  const items = [
    { title: t("problem.card1.title"), body: t("problem.card1.body") },
    { title: t("problem.card2.title"), body: t("problem.card2.body") },
    { title: t("problem.card3.title"), body: t("problem.card3.body") },
  ];

  return (
    <section className="relative overflow-hidden bg-sand px-4 py-32 sm:px-6 lg:py-36">
      {/* faint ember heat low in the scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 left-1/4 h-[28rem] w-[28rem] rounded-full bg-ember blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        <AnimatedSection className="mb-20 max-w-3xl lg:mb-28">
          <p className="eyebrow mb-5">{t("problem.eyebrow")}</p>
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-ink">
            <SplitWords text={t("problem.headline")} />
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink/70">
            {t("problem.body")}
          </p>
        </AnimatedSection>

        <div className="border-t border-line">
          {items.map((item, i) => (
            <ProblemRow key={item.title} index={i} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
