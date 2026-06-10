import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
  nameKey: string;
  priceKey: string;
  periodKey: string;
  features: string[];
  highlighted?: boolean;
}

export function Pricing() {
  const t = useTranslations();

  const tiers: PricingTier[] = [
    {
      nameKey: "pricing.starter.name",
      priceKey: "pricing.starter.price",
      periodKey: "pricing.starter.period",
      features: [t("pricing.starter.f1"), t("pricing.starter.f2"), t("pricing.starter.f3")],
    },
    {
      nameKey: "pricing.growth.name",
      priceKey: "pricing.growth.price",
      periodKey: "pricing.growth.period",
      features: [
        t("pricing.growth.f1"),
        t("pricing.growth.f2"),
        t("pricing.growth.f3"),
        t("pricing.growth.f4"),
      ],
      highlighted: true,
    },
    {
      nameKey: "pricing.pro.name",
      priceKey: "pricing.pro.price",
      periodKey: "pricing.pro.period",
      features: [
        t("pricing.pro.f1"),
        t("pricing.pro.f2"),
        t("pricing.pro.f3"),
        t("pricing.pro.f4"),
      ],
    },
  ];

  return (
    <section id="pricing" className="bg-sand py-32 lg:py-40 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16 lg:mb-20">
          <p className="eyebrow mb-4">{t("pricing.eyebrow")}</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold text-ink leading-[1.08] tracking-[-0.01em]">
            {t("pricing.headline")}
          </h2>
        </AnimatedSection>

        {/* The Growth tier is the page's one dark, elevated object — taller
            than its hairline neighbors, lit by a soft turquoise halo.
            AnimatedSection is the grid child so order-* works (a wrapper div
            between the grid and the card would swallow it). */}
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-6 items-stretch max-w-5xl mx-auto">
          {tiers.map((tier, i) => {
            const highlighted = tier.highlighted;
            return (
              <AnimatedSection
                key={tier.nameKey}
                delay={i * 0.1}
                className={cn(
                  "relative flex flex-col",
                  highlighted
                    ? "order-first lg:order-none rounded-3xl bg-ink text-canvas p-8 lg:p-10 shadow-[0_0_90px_-18px_rgba(34,196,217,0.45)]"
                    : "rounded-2xl border border-line bg-canvas p-8 lg:my-7 transition-colors hover:border-ink/20"
                )}
              >
                <div className="mb-7 flex items-start justify-between gap-3">
                  {/* .eyebrow is un-layered CSS and would beat a text-* override,
                      so the dark card spells the style out */}
                  <p
                    className={cn(
                      highlighted
                        ? "text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-canvas/60"
                        : "eyebrow"
                    )}
                  >
                    {t(tier.nameKey)}
                  </p>
                  {highlighted && (
                    <span className="rounded-full border border-turquoise-deep/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-turquoise-deep">
                      {t("pricing.recommended")}
                    </span>
                  )}
                </div>

                <div className="mb-8 flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-display font-semibold tracking-tight",
                      highlighted ? "text-6xl" : "text-5xl"
                    )}
                  >
                    {t(tier.priceKey)}
                  </span>
                  <span className={cn("text-sm", highlighted ? "text-canvas/60" : "text-ink/50")}>
                    {t(tier.periodKey)}
                  </span>
                </div>

                <ul
                  className={cn(
                    "flex flex-col gap-3.5 flex-1 border-t pt-7 mb-9",
                    highlighted ? "border-canvas/10" : "border-line"
                  )}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={cn(
                          "w-4 h-4 flex-shrink-0 mt-0.5",
                          highlighted ? "text-turquoise-deep" : "text-ink/40"
                        )}
                        strokeWidth={2}
                      />
                      <span
                        className={cn(
                          "text-sm leading-snug",
                          highlighted ? "text-canvas/85" : "text-ink/70"
                        )}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#demo"
                  className={cn(
                    "flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-sm transition-colors",
                    highlighted
                      ? "bg-turquoise-deep text-white hover:bg-turquoise"
                      : "border border-ink/20 text-ink hover:border-ink/50"
                  )}
                >
                  {t("pricing.cta")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </AnimatedSection>
            );
          })}
        </div>

        {/* ROI comparison */}
        <AnimatedSection delay={0.25} className="mt-14 text-center">
          <p className="mx-auto max-w-xl border-t border-line pt-8 text-sm leading-relaxed text-ink/60">
            {t("pricing.comparison")}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
