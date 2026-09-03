"use client";

import { useTranslations } from "next-intl";
import ParticleButton from "@/components/kokonutui/particle-button";
import { CONTACT_EMAIL, whatsappHref } from "@/lib/site";

/* The close (kit §10, HQA-D29): one CTA — the Kokonut particle button as a
   link (WhatsApp when the number exists, prefilled mail until then) plus
   the plain email. Dark green block: the dark is an object, not a mode. */
export function Cta() {
  const t = useTranslations("home.cta");

  return (
    <section id="demo" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="rounded-3xl bg-pizarra px-6 py-16 text-center sm:px-12 sm:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-verde-claro/80">
          {t("kicker")}
        </p>
        <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t("headline")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-verde-claro/90">
          {t("body")}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <ParticleButton
            asChild
            size="lg"
            className="rounded-full bg-verde-claro px-7 font-semibold text-pizarra hover:bg-white"
          >
            <a href={whatsappHref(t("ctaMessage"))}>{t("button")}</a>
          </ParticleButton>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-sm font-medium text-verde-claro underline-offset-4 hover:underline"
          >
            {t("mailLabel")}
          </a>
          <p className="text-xs text-verde-claro/70">{t("microcopy")}</p>
        </div>
      </div>
    </section>
  );
}
