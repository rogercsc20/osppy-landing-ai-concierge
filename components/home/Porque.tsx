"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { FxLayer } from "@/components/fx/FxLayer";

/* WHY, second beat (HQA-D39): the sentence every leadership meeting has
   already said, and the silence after it. Editorial and almost empty on
   purpose — this section's job is recognition, not information. The warm
   aura underneath is the only place on the home where copper leads. */
export function Porque() {
  const t = useTranslations("home.porque");

  return (
    <section className="relative px-4 py-section sm:px-6">
      <FxLayer>
        <div className="absolute left-[10%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-warm/10 blur-3xl" />
      </FxLayer>

      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="eyebrow">{t("kicker")}</p>
        </Reveal>

        <h2 className="font-display mt-5 text-h2 font-semibold text-text">
          <SplitText text={t("headline")} />
        </h2>

        <Reveal variant="blur-in" delay={0.1} className="mt-10 space-y-6">
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
    </section>
  );
}
