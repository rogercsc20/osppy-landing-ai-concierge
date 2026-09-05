"use client";

import { useTranslations } from "next-intl";
import ParticleButton from "@/components/kokonutui/particle-button";
import { Band } from "@/components/ui/Band";
import { FxLayer } from "@/components/fx/FxLayer";
import { CONTACT_EMAIL, whatsappHref } from "@/lib/site";

/* The close (kit §10, HQA-D29), and since E3c the ONLY close: HQA-D94 killed
   the price section and merged it here, by the operator's own words — "se
   fusionan en un solo cierre grande en donde sigue la frase, Cuentanos con
   que area quieres empezar, y el boton de contacta un asesor".

   The headline survived that merge and the paragraph did not: "sin
   párrafos". What is left is the headline, one button, the mail link and one
   line of microcopy; the eyebrow above the headline went with the house's
   other eight kickers in v5 T1 (D-5). The price RULE did not die with the
   section: no figure is published, structure only (pricing.md §6), and the
   sentences that carried it moved to the three service pages.

   One CTA — the Kokonut particle button as a link (WhatsApp when the number
   exists, prefilled mail until then) plus the plain email. The dark slab is
   gone: it painted a ground over the atmosphere. What holds the block is a
   <Band>, whose edges dissolve. */
export function Cta() {
  const t = useTranslations("home.cta");

  return (
    <section id="demo" className="relative px-4 py-section sm:px-6">
      <FxLayer>
        <div
          className="absolute inset-x-0 -top-24 bottom-[-20%]"
          style={{
            background:
              "radial-gradient(55% 60% at 50% 20%, color-mix(in srgb, var(--glow-2) 22%, transparent), transparent 65%)",
          }}
        />
      </FxLayer>
      <Band className="mx-auto max-w-4xl px-6 py-16 text-center sm:px-12 sm:py-20">
        <h2 className="font-display mx-auto max-w-2xl text-h2 font-semibold text-text">
          {t("headline")}
        </h2>
        <div className="mt-10 flex flex-col items-center gap-4">
          <ParticleButton
            asChild
            size="lg"
            className="rounded-full bg-accent px-8 font-semibold text-primary-foreground hover:opacity-90"
          >
            <a href={whatsappHref(t("ctaMessage"))}>{t("button")}</a>
          </ParticleButton>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="link-underline text-sm font-medium text-accent-text"
          >
            {t("mailLabel")}
          </a>
          <p className="text-xs text-text-2">{t("microcopy")}</p>
        </div>
      </Band>
    </section>
  );
}
