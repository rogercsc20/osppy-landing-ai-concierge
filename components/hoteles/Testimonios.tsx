"use client";

import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SplitWords } from "@/components/fx/SplitWords";

/* Illustrative voices (HQA-D28, kit §5): the three quotes of the house,
   anonymized — no name, no property, no stars — each visibly labeled. A
   marquee in motion, a calm grid under reduced motion. */
function QuoteCard({ quote, label }: { quote: string; label: string }) {
  return (
    <figure className="flex h-full w-[440px] max-w-[85vw] flex-shrink-0 flex-col gap-5 rounded-2xl border border-line bg-white/[0.02] p-7">
      <span className="w-fit rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-text-2">
        {label}
      </span>
      <blockquote className="flex-1 font-display text-lg leading-normal text-text/90">&ldquo;{quote}&rdquo;</blockquote>
    </figure>
  );
}

export function Testimonios() {
  const t = useTranslations("hoteles.testimonios");
  const reduce = useReducedMotion();
  const quotes = (["q1", "q2", "q3"] as const).map((k) => t(k));
  const label = t("etiqueta");

  return (
    <section className="relative overflow-hidden border-y border-line bg-bg py-24 sm:py-32 lg:py-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AnimatedSection className="mb-16 text-center lg:mb-20">
          <p className="eyebrow mb-5">{t("kicker")}</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-text">
            <SplitWords text={t("headline")} />
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-text-2">{t("nota")}</p>
        </AnimatedSection>
      </div>

      {reduce ? (
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-3">
          {quotes.map((q) => (
            <QuoteCard key={q} quote={q} label={label} />
          ))}
        </div>
      ) : (
        <AnimatedSection className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-bg to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-bg to-transparent" />
          <div className="marquee-track flex w-max items-stretch gap-4 pr-4">
            {[...quotes, ...quotes].map((q, i) => (
              <div key={i} aria-hidden={i >= quotes.length || undefined}>
                <QuoteCard quote={q} label={label} />
              </div>
            ))}
          </div>
        </AnimatedSection>
      )}
    </section>
  );
}
