"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useMotionOK, useReducedMotion } from "@/components/fx/motion-hooks";
import { Reveal, Stagger } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { EASE_EXPO } from "@/lib/motion";

/* HOW, second beat — the brand guide's §7.1 translation table, six rows,
   none added.
   The plain sentence is the FRONT of every card and the credential is the
   back: "el concepto en claro va primero" (guide §6.6) is a rule about
   order, and a card whose front reads "MLOps" would break it while quoting
   the section that forbids it. Hover flips on a real pointer; tap flips on
   touch; under reduced motion nothing flips and both sides are stacked. */

const ROWS = ["t1", "t2", "t3", "t4", "t5", "t6"] as const;

function Card({ operacion, tecnico }: { operacion: string; tecnico: string }) {
  const ok = useMotionOK();
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);

  if (reduce) {
    return (
      <div className="glass h-full rounded-2xl p-7">
        <p className="text-h3 font-medium leading-snug text-text">{operacion}</p>
        <p className="mt-5 border-t border-line pt-4 text-xs uppercase tracking-[0.14em] text-text-2">
          {tecnico}
        </p>
      </div>
    );
  }

  return (
    <div
      className="h-full [perspective:1200px]"
      onPointerEnter={ok ? () => setFlipped(true) : undefined}
      onPointerLeave={ok ? () => setFlipped(false) : undefined}
    >
      <motion.button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-label={flipped ? operacion : tecnico}
        className="relative block h-full w-full text-left [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: EASE_EXPO }}
      >
        {/* The FRONT sits in normal flow so the sentence sizes the card; the
            back is the one that floats. Both absolute and the longest line
            spills past the glass — the capture gate caught exactly that. */}
        <span className="glass flex h-full min-h-[13rem] flex-col justify-between rounded-2xl p-7 [backface-visibility:hidden]">
          <span className="text-h3 font-medium leading-snug text-text">{operacion}</span>
          <span aria-hidden="true" className="mt-6 text-base text-text-2/60">
            &#8635;
          </span>
        </span>
        <span className="glass absolute inset-0 flex flex-col justify-center rounded-2xl border-accent-text/30 p-7 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="text-sm uppercase tracking-[0.14em] text-accent-text">
            {tecnico}
          </span>
        </span>
      </motion.button>
    </div>
  );
}

export function Jerga() {
  const t = useTranslations("home.jerga");
  const rows = ROWS.map((k) => ({
    operacion: t(`${k}Operacion`),
    tecnico: t(`${k}Tecnico`),
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
          className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variant="scale-in"
          itemClassName="h-full"
        >
          {rows.map((row) => (
            <Card key={row.tecnico} {...row} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
