"use client";

import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SplitWords } from "@/components/fx/SplitWords";
import ParticleButton from "@/components/kokonutui/particle-button";
import { CONTACT_EMAIL, whatsappHref } from "@/lib/site";

/* One CTA (HQA-D29, kit §10): «Agenda una demostración» with its prefilled
   message — WhatsApp when the number exists, a prefilled email until then —
   plus the plain address. No form (HQA-D25). */
export function Cta() {
  const t = useTranslations("hoteles.cta");

  return (
    <section id="demo" className="relative overflow-hidden bg-bg px-4 py-24 sm:px-6 sm:py-32 lg:py-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(55% 60% at 50% -10%, color-mix(in srgb, var(--accent) 30%, transparent), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-2xl text-center">
        <AnimatedSection className="mb-12">
          <p className="eyebrow mb-4">{t("kicker")}</p>
          <h2 className="mb-5 font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-text">
            <SplitWords text={t("headline")} />
          </h2>
          <p className="text-lg leading-relaxed text-text-2">{t("body")}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="flex flex-col items-center gap-4">
          <ParticleButton
            asChild
            size="lg"
            className="rounded-full bg-accent px-8 font-semibold text-white hover:bg-accent-text hover:text-bg"
          >
            <a href={whatsappHref(t("ctaMessage"))}>{t("button")}</a>
          </ParticleButton>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-2 text-sm text-text-2 transition-colors hover:text-text"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {t("mailLabel")}
          </a>
          <p className="mt-3 text-xs text-text-2">{t("microcopy")}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
