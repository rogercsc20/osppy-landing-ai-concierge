"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { Check } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { AppWindow } from "@/components/device/AppWindow";
import { Tilt } from "@/components/fx/Tilt";
import { DUR, EASE_EXPO } from "@/lib/motion";

/* HOW, third beat — "so what does it actually look like". A quote assembling
   itself line by line inside an app window, with the demonstration-data label
   attached to the object and not hidden in a footnote (HQA-D34: no charts
   here; charts belong to real product screens).
   Every value is invented for the demo and says so. */

const LINES = ["campo1", "campo2", "campo3"] as const;

function Documento() {
  const t = useTranslations("home.seve.demo");
  const ts = useTranslations("home.seve");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const rows = LINES.map((k, i) => ({
    label: t(k),
    value: t(`valor${i + 1}`),
  }));

  return (
    <div ref={ref} className="@container p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
        <span className="font-display text-lg font-semibold text-text">
          {t("titulo")}
        </span>
        <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-text-2">
          {ts("etiqueta")}
        </span>
      </div>

      <dl className="mt-2">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            className="grid grid-cols-1 gap-1 border-b border-line py-4 @md:grid-cols-[10rem_1fr] @md:gap-6"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: DUR.fast, ease: EASE_EXPO, delay: 0.35 + i * 0.45 }}
          >
            <dt className="text-sm font-medium text-text-2">{row.label}</dt>
            <dd className="text-sm leading-relaxed text-text">{row.value}</dd>
          </motion.div>
        ))}
      </dl>

      <motion.p
        className="mt-5 flex items-center gap-2 text-sm text-accent-text"
        initial={reduce ? false : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: DUR.fast, delay: 0.35 + rows.length * 0.45 }}
      >
        <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        {t("pie")}
      </motion.p>
    </div>
  );
}

export function SeVe() {
  const t = useTranslations("home.seve");
  const demos = (["d1", "d2"] as const).map((k) => ({
    titulo: t(`${k}Titulo`),
    body: t(`${k}Body`),
  }));

  return (
    <section className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("kicker")}</p>
          <h2 className="font-display mt-5 max-w-3xl text-h2 font-semibold text-text">
            <SplitText text={t("headline")} />
          </h2>
          <p className="mt-6 max-w-2xl text-lead text-text-2">{t("body")}</p>
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal variant="scale-in" className="min-w-0">
            <Tilt max={4}>
              <AppWindow>
                <Documento />
              </AppWindow>
            </Tilt>
          </Reveal>

          <Reveal delay={0.15} className="space-y-10">
            {demos.map((demo) => (
              <div key={demo.titulo}>
                <h3 className="font-display text-h3 font-semibold text-text">
                  {demo.titulo}
                </h3>
                <p className="mt-3 leading-relaxed text-text-2">{demo.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
