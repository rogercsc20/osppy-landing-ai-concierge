"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { GlowCard } from "@/components/ui/GlowCard";
import { AREAS } from "@/lib/areas";

/* WHAT, first beat — the eight office areas (HQA-D37): the section that
   answers "¿en qué áreas?".
   Every card carries a badge, and the badge is truth, not decoration: today
   all eight read «Se ofrece» because nothing in the repo attests delivered
   work BY AREA (HQA-D44; source of truth §11.12). The note under the grid
   says that out loud instead of letting the badge imply otherwise, and
   scripts/check-copy.mjs fails on any entry of data/areas.json that claims
   «hecho» without a dated source. */
export function Areas() {
  const t = useTranslations("home.areas");

  return (
    <section id="areas" className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("kicker")}</p>
          <h2 className="font-display mt-5 max-w-4xl text-h2 font-semibold text-text">
            <SplitText text={t("headline")} />
          </h2>
          <p className="mt-6 max-w-2xl text-lead text-text-2">{t("body")}</p>
        </Reveal>

        <Stagger
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variant="fade-up"
          itemClassName="h-full"
        >
          {AREAS.map((area) => (
            <GlowCard key={area.slug} className="flex flex-col justify-between p-7">
              <div>
                <span className="inline-flex items-center rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-text-2">
                  {t("insignia")}
                </span>
                <h3 className="font-display mt-5 text-h3 font-semibold leading-tight text-text">
                  {t(`${area.key}.nombre`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-2">
                  {t(`${area.key}.tarea`)}
                </p>
              </div>
              {/* The diagnosis takes the area as its entry hint (?area=…) and
                  ships in V5; until then the card points at the one place
                  that can answer today — a conversation. */}
              <a
                href="#demo"
                className="link-underline mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent-text"
              >
                {t("cardCta")}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </GlowCard>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-10">
          <p className="max-w-3xl border-t border-line pt-6 text-sm leading-relaxed text-text-2">
            {t("nota")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
