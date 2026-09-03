"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { FxLayer } from "@/components/fx/FxLayer";

/* Three rows in the owner's own words (source of truth §4.3): ghost
   numerals drift behind each row; no statistics, no competitor by name. */
function Row({ index, title, body }: { index: number; title: string; body: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // function-form mapping: numeric ranges compile to native ScrollTimeline
  // animations, which misbehave around sticky ancestors
  const y = useTransform(scrollYProgress, (v) => (reduce ? 0 : (0.5 - v) * 90));

  return (
    <div ref={ref} className="relative border-b border-line">
      <motion.span
        aria-hidden="true"
        style={{ y }}
        data-num={`0${index + 1}`}
        className="pointer-events-none absolute -top-10 right-0 select-none font-display text-[clamp(9rem,22vw,18rem)] font-semibold leading-none text-text/[0.045] after:content-[attr(data-num)] lg:-top-16 lg:right-8"
      />
      <Reveal className="relative z-10 grid gap-3 py-16 sm:grid-cols-12 sm:gap-8 lg:py-24">
        <span className="font-display text-xl font-semibold text-accent-text/70 sm:col-span-1">0{index + 1}</span>
        <h3 className="font-display text-2xl font-semibold leading-snug text-text sm:col-span-5 lg:text-3xl">{title}</h3>
        <p className="max-w-md text-base leading-relaxed text-text-2 sm:col-span-6 lg:text-lg">{body}</p>
      </Reveal>
    </div>
  );
}

export function Problema() {
  const t = useTranslations("hoteles.problema");
  const items = (["r1", "r2", "r3"] as const).map((k) => ({ title: t(`${k}.titulo`), body: t(`${k}.body`) }));

  return (
    <section className="relative px-4 py-section sm:px-6">
      {/* faint warm heat low in the scene, free to bleed into the next one */}
      <FxLayer>
        <div className="absolute -bottom-56 left-1/4 h-[28rem] w-[28rem] rounded-full bg-warm/10 blur-3xl" />
      </FxLayer>
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mb-20 max-w-3xl lg:mb-28">
          <p className="eyebrow mb-5">{t("kicker")}</p>
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-text">
            <SplitText text={t("headline")} />
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-text-2">{t("body")}</p>
        </Reveal>
        <div className="border-t border-line">
          {items.map((item, i) => (
            <Row key={item.title} index={i} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
