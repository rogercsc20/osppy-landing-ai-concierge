"use client";

import { useTranslations } from "next-intl";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SplitWords } from "@/components/fx/SplitWords";
import { ArrowRight, Mail } from "lucide-react";
import { whatsappHref, CONTACT_EMAIL } from "@/lib/site";

// HQA-D25: the lead form is retired — the site collects no personal data
// while the privacy notice is incomplete. Primary CTA goes to WhatsApp when
// WHATSAPP_NUMBER exists, to a prefilled email until then (HQA-D29).
export function FinalCTA() {
  const t = useTranslations();

  return (
    <section id="demo" className="relative overflow-hidden bg-canvas py-32 lg:py-44 px-4 sm:px-6">
      {/* spotlight falling from above */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 60% at 50% -10%, rgba(18,157,181,0.28), transparent 65%)",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-grid-pattern mask-radial-fade" />

      <div className="relative max-w-2xl mx-auto text-center">
        <AnimatedSection className="mb-12">
          <p className="eyebrow mb-4">{t("cta.eyebrow")}</p>
          <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold text-ink leading-[1.05] tracking-[-0.015em] mb-5">
            <SplitWords text={t("cta.headline")} />
          </h2>
          <p className="text-lg text-ink/70 leading-relaxed">{t("cta.body")}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="flex flex-col items-center gap-4">
          <a
            href={whatsappHref(t("cta.button"))}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-turquoise-deep text-white font-semibold text-base hover:bg-turquoise transition-colors"
          >
            {t("cta.button")}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-2 text-ink/70 hover:text-ink text-sm transition-colors"
          >
            <Mail className="w-4 h-4" />
            {CONTACT_EMAIL}
          </a>
          <p className="text-xs text-ink/70 mt-3">{t("cta.microcopy")}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
