"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { Band } from "@/components/ui/Band";

/* WHAT — "¿cuánto cuesta?", answered with structure and not one figure.
   The three lines and the closing sentence are business/pricing.md §6 word
   for word (HQA-D43): no starting price, no range, no hourly rate. The day
   the operator writes a range THERE, it may be printed here — not before.

   The block is a <Band>: a surface with a field of its own whose edges
   dissolve, so it reads as a panel without cutting the atmosphere in two. */
export function Cuanto() {
  const t = useTranslations("home.cuanto");
  const points = (["p1", "p2", "p3"] as const).map((k) => t(k));

  return (
    <section className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="eyebrow">{t("kicker")}</p>
          <h2 className="font-display mt-5 text-h2 font-semibold text-text">
            <SplitText text={t("headline")} />
          </h2>
          <p className="mt-6 max-w-2xl text-lead text-text-2">{t("body")}</p>
        </Reveal>

        <Reveal variant="scale-in" delay={0.1} className="mt-12">
          <Band className="px-7 py-12 sm:px-12 sm:py-14">
            <ul className="mx-auto max-w-2xl space-y-7">
              {points.map((point, i) => (
                <li key={point} className="flex gap-5">
                  <span className="font-display text-sm font-semibold tabular-nums text-accent-text">
                    {`0${i + 1}`}
                  </span>
                  <span className="text-lead text-text">{point}</span>
                </li>
              ))}
            </ul>
            <p className="font-display mx-auto mt-12 max-w-2xl border-t border-line pt-8 text-h3 font-semibold text-text">
              {t("cierre")}
            </p>
          </Band>
        </Reveal>

        <Reveal delay={0.15} className="mt-8">
          <p className="max-w-2xl text-sm leading-relaxed text-text-2">{t("nota")}</p>
        </Reveal>
      </div>
    </section>
  );
}
