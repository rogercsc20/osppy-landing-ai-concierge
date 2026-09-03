"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";

/* Illustrative voices — NOT testimonials (HQA-D40).
   The three quotes were written by us. Presenting them as real testimonials
   would be misleading advertising (LFPC art. 32 / PROFECO; source of truth
   §1 rule 2 and §9). Offered three paths on 2026-09-03, the operator chose
   the redesign with a discreet disclosure (HQA-D63): no names, no companies,
   no stars, no per-card chip, and ONE caption-sized line under the headline
   — the size of a photo credit, not of a legal notice, which is the whole
   difference between honest and apologetic. The quotes are set in italics
   between curly quotation marks; guillemets read as decoration and the
   operator rejected them.

   `[EVIDENCIA]`: three REAL anonymized quotes would replace these, need no
   written permission and no disclosure line at all, because they would not
   assert anything false (brand guide §5.7). That door is the cheapest fix
   available and it stays open. */
export function Voces() {
  const t = useTranslations("home.voces");
  const quotes = (["q1", "q2", "q3"] as const).map((k) => t(k));

  return (
    <section className="relative border-y border-line px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("kicker")}</p>
          <h2 className="font-display mt-5 max-w-3xl text-h2 font-semibold text-text">
            <SplitText text={t("headline")} />
          </h2>
          <p className="mt-4 max-w-2xl text-xs leading-relaxed text-text-2/80">
            {t("divulgacion")}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-10 gap-y-14 lg:grid-cols-3">
          {quotes.map((quote, i) => (
            <Reveal key={quote} variant="blur-in" delay={i * 0.12}>
              <figure>
                {/* The quote is set in italics between curly quotation marks
                    (C1). Guillemets read as decoration at this size and the
                    operator rejected them; an oversized opening mark on its
                    own line was the same decoration, larger. */}
                <blockquote className="font-editorial text-lead italic leading-relaxed text-text">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
