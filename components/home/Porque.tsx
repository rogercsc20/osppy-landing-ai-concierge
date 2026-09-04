"use client";

import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/fx/Reveal";
import { FxLayer } from "@/components/fx/FxLayer";
import { Photo } from "@/components/media/Photo";

/* Section 4: what Osppy is, in one sentence, next to the one human photo of
   the house. The operator's instruction was to strip it: "le quitas el
   paréntesis" and "todo lo demás de esa página se quita", keeping the image
   because "esa imagen me gusta, pero que todo te evoque un sentimiento de
   confianza".

   So what is left is deliberately one line. The four paragraphs went: p1, p2
   and p3 die, and `cierre` ("a veces la respuesta es: todavía no") moves to
   /asesoria, which is the page where that sentence finally has a place
   instead of being the fifth paragraph of a home section. The headline moved
   the other way, up into <Silencio/>.

   The sentence names the CATEGORY and the AUDIENCE and drops the size
   segmentation, by the operator's answer at the E3a gate: "no menciones
   empresas medianas y grandes … pero sí menciona el público y categoría,
   somos consultoría". HQA-D37 does not move; the site simply stops saying
   it out loud, and "empresas" contains "empresas medianas y grandes".

   The copper aura stays and is still the only place on the home where copper
   leads (guide §8.4). */
export function Porque() {
  const t = useTranslations("home.porque");
  const locale = useLocale();

  return (
    <section className="relative px-4 py-section sm:px-6">
      <FxLayer>
        <div className="absolute left-[10%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-warm/10 blur-3xl" />
      </FxLayer>

      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow">{t("kicker")}</p>
            </Reveal>
            <Reveal variant="blur-in" delay={0.1}>
              <p className="font-display mt-6 max-w-2xl text-h2 font-semibold text-balance text-text">
                {t("quienes")}
              </p>
            </Reveal>
          </div>

          <Reveal variant="scale-in" delay={0.15} className="hidden lg:block">
            <Photo
              slug="asesoria"
              locale={locale}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-full max-h-[34rem] min-h-[24rem] rounded-2xl"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
