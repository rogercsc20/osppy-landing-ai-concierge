"use client";

import { useTranslations } from "next-intl";
import { Reveal, Stagger } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { Counter } from "@/components/fx/Counter";
import { GlowCard } from "@/components/ui/GlowCard";

/* WHAT — the track record, and the section that absorbed the old "Casos":
   they were saying the same thing twice, one with numbers and one with
   kinds of work.

   **Four figures, and no note under them** (tanda C, HQA-D60). It was six.
   «2 productos en producción» came out because the operator asked for that
   tile to change, «+20 soluciones implementadas» did not go in because it
   would have sat next to «+50» saying almost the same thing with a different
   number, and «3 líneas de trabajo» is taxonomy, not track record. The
   estimate note is gone too, and NOT for design reasons: asked whether it
   came off because the figures are firm or because it was in the way, the
   operator answered «firmas las sostengo … ninguna frase ni disclaimer».
   They stopped being estimates; where they are published they go alone.

   Every figure is still attested and nothing else is: +100 and +50 by the
   operator (FDV §11.11), «+10 giros» by the twenty sectors of §11.10, 24/7 by
   the product. scripts/check-copy.mjs FAILS on any other digit, and its
   global whitelist lost 3, 9 and 2 with the tiles that used them. No client
   is named, here or anywhere (source of truth §11.1). */

const COUNTERS = ["c1", "c2", "c3", "c4"] as const;
/* The order is the operator's, dictated on 2026-09-03: Claude Enterprise
   first, the two documentary ones last. It is not alphabetical and it is not
   the order they were built in — it is the order he wants read. */
const TIPOS = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10"] as const;

/** "+100" → the prefix and the number; "24/7" stays a string. */
function Figura({ value }: { value: string }) {
  const m = value.match(/^(\+?)(\d+)$/);
  if (!m) return <>{value}</>;
  return <Counter value={Number(m[2])} prefix={m[1]} />;
}

export function Trayectoria() {
  const t = useTranslations("home.trayectoria");
  const tc = useTranslations("home.casos");

  const counters = COUNTERS.map((k) => ({
    value: t(`${k}Valor`),
    label: t(`${k}Label`),
  }));
  const tipos = TIPOS.map((k) => ({
    titulo: tc(`${k}Titulo`),
    body: tc(`${k}Body`),
  }));

  return (
    <section className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("kicker")}</p>
          <h2 className="font-display mt-5 max-w-3xl text-h2 font-semibold text-text">
            <SplitText text={t("headline")} />
          </h2>
          <p className="mt-6 max-w-2xl text-lead text-text-2">{t("body")}</p>
        </Reveal>

        <Stagger
          className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4"
          variant="scale-in"
          itemClassName="h-full"
        >
          {counters.map((c) => (
            <div key={c.label} className="glass h-full rounded-2xl p-7">
              <span className="font-display block text-h2 font-extrabold leading-none tracking-tight text-text">
                <Figura value={c.value} />
              </span>
              <span className="mt-4 block text-sm leading-snug text-text-2">
                {c.label}
              </span>
            </div>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-8">
          <p className="max-w-2xl leading-relaxed text-text">{t("agentes")}</p>
        </Reveal>

        <Reveal className="mt-16">
          <p className="text-sm font-semibold text-text">{tc("tiposTitulo")}</p>
        </Reveal>
        <Stagger
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
          variant="fade-up"
          itemClassName="h-full"
        >
          {tipos.map((tipo) => (
            <GlowCard key={tipo.titulo} className="p-6">
              <h3 className="font-display font-semibold text-text">{tipo.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-2">{tipo.body}</p>
            </GlowCard>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-10">
          <p className="max-w-3xl border-t border-line pt-6 text-sm leading-relaxed text-text-2">
            {tc("giros")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
