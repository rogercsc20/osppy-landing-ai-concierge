"use client";

import { useTranslations } from "next-intl";
import { Reveal, Stagger } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { GlowCard } from "@/components/ui/GlowCard";

/* WHY, third beat: the conviction, stated as three conditions rather than
   three adjectives. The third card and the closing line are the mandatory
   framings of brand guide §6.7 (AI errors, and replacing people) — they are
   not marketing copy and they do not get rewritten to sound better. */
export function Creemos() {
  const t = useTranslations("home.creemos");
  const cards = (["c1", "c2", "c3"] as const).map((k) => ({
    titulo: t(`${k}Titulo`),
    body: t(`${k}Body`),
  }));

  return (
    <section className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("kicker")}</p>
        </Reveal>
        <h2 className="font-display mt-5 max-w-4xl text-h2 font-semibold text-text">
          <SplitText text={t("headline")} />
        </h2>

        <Stagger className="mt-14 grid gap-4 lg:grid-cols-3" variant="fade-up">
          {cards.map((card, i) => (
            <GlowCard key={card.titulo} className="p-8">
              <span className="font-display text-sm font-semibold tabular-nums text-accent-text">
                {`0${i + 1}`}
              </span>
              <h3 className="font-display mt-4 text-h3 font-semibold text-text">
                {card.titulo}
              </h3>
              <p className="mt-3 leading-relaxed text-text-2">{card.body}</p>
            </GlowCard>
          ))}
        </Stagger>

        <Reveal delay={0.15} className="mt-10">
          <p className="max-w-3xl text-sm leading-relaxed text-text-2">
            {t("nota")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
