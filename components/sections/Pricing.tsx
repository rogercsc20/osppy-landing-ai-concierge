import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Check, ArrowRight } from "lucide-react";

/**
 * Custom-pricing section (2026-08-04, operator decision): the dead
 * $49/$149/$249 tier cards are retired — pricing is bespoke per hotel and the
 * page never quotes a number (hq pricing rule: the fair-use structure is
 * discussed in the demo, "no flat quotes ever"). One elevated panel — the
 * page's signature dark monolith with the rotating beam ring — states the
 * shape of the deal (flat monthly fee, no per-booking commissions, clear
 * proposal after the demo) and routes to #demo.
 */
export function Pricing() {
  const t = useTranslations();

  const points = [t("pricing.f1"), t("pricing.f2"), t("pricing.f3")];

  return (
    <section id="pricing" className="bg-sand py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-16 max-w-3xl lg:mb-20">
          <p className="eyebrow mb-4">{t("pricing.eyebrow")}</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold text-ink leading-[1.08] tracking-[-0.01em]">
            {t("pricing.headline")}
          </h2>
        </AnimatedSection>

        {/* The one dark, elevated object on the page — ringed by the
            rotating teal beam (same treatment the Growth card carried). */}
        <AnimatedSection className="mx-auto max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl p-px shadow-[0_0_90px_-18px_rgba(34,196,217,0.45)]">
            <div aria-hidden="true" className="beam-ring absolute inset-0" />
            <div className="relative flex flex-col rounded-[calc(1.5rem-1px)] bg-ink p-8 text-canvas lg:p-12">
              <p className="mb-8 text-base leading-relaxed text-canvas/75 lg:text-lg">
                {t("pricing.body")}
              </p>

              <ul className="mb-10 flex flex-col gap-4 border-t border-canvas/10 pt-8">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-turquoise-deep"
                      strokeWidth={2}
                    />
                    <span className="text-sm leading-snug text-canvas/85 lg:text-base">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#demo"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-turquoise-deep py-3.5 text-sm font-semibold text-white transition-colors hover:bg-turquoise sm:mx-auto sm:w-auto sm:px-10"
              >
                {t("pricing.cta")}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </AnimatedSection>

        {/* ROI comparison — the OTA-commission contrast, no price quoted */}
        <AnimatedSection delay={0.25} className="mt-14 text-center">
          <p className="mx-auto max-w-xl border-t border-line pt-8 text-sm leading-relaxed text-ink/60">
            {t("pricing.comparison")}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
