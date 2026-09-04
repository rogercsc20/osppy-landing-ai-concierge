"use client";

import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { FxLayer } from "@/components/fx/FxLayer";
import { Photo } from "@/components/media/Photo";

/* WHY, second beat (HQA-D39): the sentence every leadership meeting has
   already said, and the silence after it.

   Redesigned in tanda D (D5, gate D0-6 — the operator confirmed superseding
   the earlier «almost empty on purpose» intent, recorded 2026-09-03). The
   CONCEPT survives the redesign: this section's job is still recognition,
   and its one idea is still the silence, so the silence is now DRAWN
   instead of described — an empty answer line under the headline where a
   caret blinks and never writes. That is the section feeling something
   rather than saying it, which is what the operator asked the page to do.

   What grew around it: the paragraph the hero gave up in D3 (what Osppy is
   and for whom — this is the section where explaining is the job), and one
   human photo from the licensed bank, veiled, below the fold where a face
   carries weight and costs no LCP. The two stock portraits the operator
   attached stay out: guide §8.10 bans posed stock by name, and they are not
   in the licensed bank (HQA-D31 untouched — the hero got the panel).

   The copper aura is UNCHANGED and still the only place on the home where
   copper leads: spreading it through the new elements would stop it meaning
   anything (guide §8.4). The closing line keeps the one copper border. */
export function Porque() {
  const t = useTranslations("home.porque");
  const locale = useLocale();

  return (
    <section className="relative px-4 py-section sm:px-6">
      <FxLayer>
        <div className="absolute left-[10%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-warm/10 blur-3xl" />
      </FxLayer>

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("kicker")}</p>
        </Reveal>

        <h2 className="font-display mt-5 max-w-3xl text-h2 font-semibold text-text">
          <SplitText text={t("headline")} />
        </h2>

        {/* The silence, drawn: an answer line that never gets its answer.
            Decorative — the headline already says «Y después, silencio», so
            the line is aria-hidden and adds no text, only the feeling. The
            caret stands still under reduced motion (globals.css). */}
        <Reveal delay={0.2} className="mt-10">
          <div aria-hidden="true" className="flex h-16 max-w-2xl items-center border-l-2 border-line pl-6">
            <span className="caret-blink h-6 w-[2px] bg-text-2" />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            {/* The paragraph the hero gave up (D-3): what Osppy is, said
                where explaining is this page's job. */}
            <Reveal variant="blur-in">
              <p className="max-w-2xl text-lead text-text">{t("quienes")}</p>
            </Reveal>

            <Reveal variant="blur-in" delay={0.1} className="mt-8 space-y-6">
              <p className="max-w-2xl text-lead text-text-2">{t("p1")}</p>
              <p className="max-w-2xl text-lead text-text-2">{t("p2")}</p>
              <p className="max-w-2xl text-lead text-text-2">{t("p3")}</p>
            </Reveal>

            <Reveal variant="clip-up" delay={0.2} className="mt-12">
              <p className="border-l-2 border-warm pl-6 font-display text-h3 font-semibold text-text">
                {t("cierre")}
              </p>
            </Reveal>
          </div>

          {/* The human face of the same conversation, veiled so it sits in
              the atmosphere instead of on top of it. */}
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
