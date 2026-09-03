import { useTranslations } from "next-intl";
import { Check, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

/* Price in words (D-L8, pricing.md): the structure — monthly fee per
   property, plans by conversation volume, one-time setup, several
   properties, short contracts — and not one figure. The panel is the one
   light object on the dark page. */
export function Precio() {
  const t = useTranslations("hoteles.precio");
  const points = (["p1", "p2", "p3", "p4", "p5"] as const).map((k) => t(k));

  return (
    <section id="precio" className="bg-bg px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="mb-16 max-w-3xl lg:mb-20">
          <p className="eyebrow mb-4">{t("kicker")}</p>
          <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.01em] text-text">
            {t("headline")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-2">{t("body")}</p>
        </AnimatedSection>

        <AnimatedSection className="mx-auto max-w-2xl">
          <div
            className="relative overflow-hidden rounded-3xl border border-accent-text/30"
            style={{ boxShadow: "0 0 90px -18px color-mix(in srgb, var(--accent-text) 45%, transparent)" }}
          >
            <div className="relative flex flex-col bg-text p-8 text-bg lg:p-12">
              <ul className="flex flex-col gap-4">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" strokeWidth={2.5} aria-hidden="true" />
                    <span className="text-[15px] leading-snug text-bg/85 lg:text-base">{point}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-bg/10 pt-6 text-sm leading-relaxed text-bg/65">{t("nota")}</p>
              <a
                href="#demo"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-text hover:text-bg sm:mx-auto sm:w-auto sm:px-10"
              >
                {t("cta")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
