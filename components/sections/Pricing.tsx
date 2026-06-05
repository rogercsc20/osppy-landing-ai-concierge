"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection, AnimatedGroup } from "@/components/ui/AnimatedSection";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
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
    <section id="pricing" className="bg-sand py-24 lg:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-4">
            {t("pricing.headline")}
          </h2>
        </AnimatedSection>

        {/* Pricing cards — stack on mobile, Growth on top */}
        <AnimatedGroup className="grid lg:grid-cols-3 gap-4 lg:gap-6 items-start lg:items-stretch">
          {tiers.map((tier) => {
            const highlighted = tier.highlighted;
            return (
              <motion.div
                key={tier.nameKey}
                whileHover={{ scale: highlighted ? 1.02 : 1.01 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "relative rounded-2xl p-6 lg:p-8 flex flex-col",
                  highlighted
                    ? "bg-turquoise-deep text-white shadow-xl shadow-turquoise/25 order-first lg:order-none"
                    : "border border-ink/10 bg-white text-ink shadow-sm shadow-ink/5"
                )}
              >
                {highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-coral text-white text-xs font-bold">
                      {t("pricing.recommended")}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p className={cn("text-sm font-medium mb-2", highlighted ? "text-white/70" : "text-ink/55")}>
                    {t(tier.nameKey)}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold">{t(tier.priceKey)}</span>
                    <span className={cn("text-sm mb-1", highlighted ? "text-white/70" : "text-ink/45")}>
                      {t(tier.periodKey)}
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className={cn("w-4 h-4 flex-shrink-0 mt-0.5", highlighted ? "text-white" : "text-turquoise-deep")} />
                      <span className={cn("text-sm leading-snug", highlighted ? "text-white/85" : "text-ink/70")}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#demo"
                  className={cn(
                    "flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold text-sm transition-all",
                    highlighted
                      ? "bg-white text-turquoise-deep hover:bg-white/90"
                      : "border border-ink/20 text-ink hover:border-turquoise hover:text-turquoise-deep"
                  )}
                >
                  {t("pricing.cta")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            );
          })}
        </AnimatedGroup>

        {/* ROI comparison */}
        <AnimatedSection delay={0.3} className="mt-10 text-center">
          <p className="text-ink/55 text-sm max-w-xl mx-auto">
            {t("pricing.comparison")}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
