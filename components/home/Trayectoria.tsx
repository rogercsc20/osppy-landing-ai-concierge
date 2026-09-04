"use client";

import { useTranslations } from "next-intl";
import { Reveal, Stagger } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { Counter } from "@/components/fx/Counter";

/* WHAT — the track record. Three figures since E3c, not four.

   **Three, and composed for three.** 24/7 came out by the operator's
   instruction ("esa de 24/7 hay que quitarla"): it was product language on
   the home page of a consultancy whose products left the site (HQA-D88).
   The fourth slot is deliberately EMPTY and stays open with owner O
   (HQA-D95) — a four-column grid with a hole would read as a layout bug, so
   the grid is three.

   Every figure is attested and nothing else is: +100 and +50 by the operator
   (FDV §11.11), and **+20 giros** by the twenty sectors of §11.10 (it was
   +10; the conservative reading stopped being necessary once twenty were
   attested). scripts/check-copy.mjs FAILS on any other digit and reads
   scripts/copy-allow.json by key, which moved with the figure.

   What also left: the paragraph about naming no client, the line about
   autonomous agents, and the ten kinds of work, which moved to the three
   service pages. What stayed is the industries line, under a new heading the
   operator wrote — "Experiencia y conocimiento de la industria" — which
   guide §7.3 backs BETTER than the old one did: until documented cases
   exist, we speak of experience, not of results, and "industrias a las que
   ayudamos" claimed a present relationship with each one. No client is
   named, here or anywhere (FDV §11.1). */

const COUNTERS = ["c1", "c2", "c3"] as const;

/** "+100" → the prefix and the number; "24/7" stays a string. */
function Figura({ value }: { value: string }) {
  const m = value.match(/^(\+?)(\d+)$/);
  if (!m) return <>{value}</>;
  return <Counter value={Number(m[2])} prefix={m[1]} />;
}

export function Trayectoria() {
  const t = useTranslations("home.trayectoria");

  const counters = COUNTERS.map((k) => ({
    value: t(`${k}Valor`),
    label: t(`${k}Label`),
  }));

  return (
    <section className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("kicker")}</p>
          <h2 className="font-display mt-5 max-w-3xl text-h2 font-semibold text-text">
            <SplitText text={t("headline")} />
          </h2>
        </Reveal>

        <Stagger
          className="mt-14 grid gap-4 sm:grid-cols-3"
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

        <Reveal delay={0.1} className="mt-10">
          <p className="max-w-3xl border-t border-line pt-6 text-sm leading-relaxed text-text-2">
            {t("giros")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
