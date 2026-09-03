"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

/* Track record: counters that count up when they enter the viewport
   (HQA-D30 figures + structural facts). Non-numeric values ("24/7") stay
   static; reduced motion shows every final value immediately. */

function Counter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^(\+?)(\d+)$/);
  // Server and client must render the same initial string (no hydration
  // mismatch); reduced-motion users get the final value from the effect.
  const [display, setDisplay] = useState(match ? `${match[1]}0` : value);

  useEffect(() => {
    if (!match || reduce || !inView) {
      setDisplay(value);
      return;
    }
    const prefix = match[1];
    const target = Number(match[2]);
    const controls = animate(0, target, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(`${prefix}${Math.round(v)}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <span
        ref={ref}
        className="font-display block text-4xl font-extrabold tabular-nums tracking-tight text-text"
      >
        {display}
      </span>
      <span className="mt-2 block text-sm leading-snug text-text-2">
        {label}
      </span>
    </div>
  );
}

export function Trayectoria() {
  const t = useTranslations("home.trayectoria");
  const counters = (["c1", "c2", "c3", "c4", "c5", "c6"] as const).map(
    (k) => ({ value: t(`${k}Valor`), label: t(`${k}Label`) }),
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="eyebrow">{t("kicker")}</p>
      <h2 className="font-display mt-4 max-w-xl text-3xl font-bold tracking-tight text-text sm:text-4xl">
        {t("headline")}
      </h2>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        {counters.map((c) => (
          <Counter key={c.label} value={c.value} label={c.label} />
        ))}
      </div>
      <p className="mt-8 max-w-2xl leading-relaxed text-text">{t("agentes")}</p>
      <p className="mt-3 max-w-2xl text-xs text-text-2">{t("nota")}</p>
    </section>
  );
}
