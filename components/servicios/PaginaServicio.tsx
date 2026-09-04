import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { FxLayer } from "@/components/fx/FxLayer";
import { ShineButton } from "@/components/ui/ShineButton";
import { whatsappHref } from "@/lib/site";

/** The three service lines, keyed by their app-folder slug (HQA-D88). */
export type ServicioSlug = "capacitacion" | "asesoria" | "implementacion";

/**
 * The shared HERO of the three service pages: kicker, headline, one line, one
 * CTA. It is the only thing the three share above the fold, and since E5c it
 * is the only thing they share at all above blocks 7 to 9 — each page's body
 * lives in its own component, because three identical pages with different
 * text is the trap the v3 plan named.
 *
 * It renders a bare <section> and NOT a <main>: the page component owns the
 * landmark, so every block it composes sits inside it. Wrapping here would
 * have left blocks 2 onward outside the main landmark, which no gate checks
 * and a screen reader would announce wrongly.
 *
 * The height lives on the inner wrapper and never on the <section>:
 * check-sections.mjs fails on `min-h-screen` in a section, and has since V2.
 */
export async function PaginaServicio({
  slug,
  locale,
}: {
  slug: ServicioSlug;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: `servicios.${slug}` });

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center pt-16">
      <FxLayer>
        <div
          className="absolute inset-x-0 -top-16 bottom-[-30%]"
          style={{
            background:
              "radial-gradient(110% 80% at 50% -10%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 60%)",
          }}
        />
      </FxLayer>

      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6">
        {/* The h1 is the LCP element, so its entrance never starts at
              opacity 0 (globals.css since V3). */}
        <p className="eyebrow animate-fade-rise">{t("kicker")}</p>
        <h1 className="font-display animate-rise-only mt-5 text-h1 font-extrabold text-balance text-text xl:text-display">
          {t("headline")}
        </h1>
        <p className="animate-fade-rise mt-7 text-lg leading-relaxed text-text-2">
          {t("body")}
        </p>
        <div className="animate-fade-rise mt-10 flex justify-center">
          <ShineButton href={whatsappHref(t("ctaMessage"))}>
            {t("cta")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ShineButton>
        </div>
      </div>
    </section>
  );
}
