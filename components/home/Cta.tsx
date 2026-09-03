"use client";

import { useTranslations } from "next-intl";
import ParticleButton from "@/components/kokonutui/particle-button";
import { Band } from "@/components/ui/Band";
import { FxLayer } from "@/components/fx/FxLayer";
import { CONTACT_EMAIL, whatsappHref } from "@/lib/site";

/* The close (kit §10, HQA-D29): one CTA — the Kokonut particle button as a
   link (WhatsApp when the number exists, prefilled mail until then) plus the
   plain email. The dark slab is gone: it painted a ground over the
   atmosphere. What holds the block now is a <Band>, whose edges dissolve. */
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
        <p className="eyebrow">
          {t("kicker")}
        </p>
        <h2 className="font-display mx-auto mt-5 max-w-2xl text-h2 font-semibold text-text">
          {t("headline")}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lead text-text-2">
          {t("body")}
        </p>
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
