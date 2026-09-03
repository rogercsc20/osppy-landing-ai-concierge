"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

/* How we work: a four-step timeline whose marker lights up as each step
   crosses the middle of the viewport. Reduced motion renders every step
   in its final, active-marker state. */

function Step({
  titulo,
  body,
  last,
}: {
  titulo: string;
  body: string;
  last: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const active = reduce || inView;

  return (
    <li ref={ref} className="relative pl-10 pb-12 last:pb-0">
      {!last && (
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-6 h-full w-px bg-line"
        />
      )}
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 transition-colors duration-300 ${
          active ? "border-accent bg-accent" : "border-line bg-surface"
        }`}
      />
      <h3
        className={`font-display text-xl font-bold transition-colors duration-300 ${
          active ? "text-text" : "text-text-2"
        }`}
      >
        {titulo}
      </h3>
      <p className="mt-2 max-w-lg leading-relaxed text-text-2">{body}</p>
    </li>
  );
}

export function Como() {
  const t = useTranslations("home.como");
  const pasos = (["p1", "p2", "p3", "p4"] as const).map((k) => ({
    titulo: t(`${k}Titulo`),
    body: t(`${k}Body`),
  }));

  return (
    <section id="como" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="eyebrow">{t("kicker")}</p>
      <h2 className="font-display mt-4 max-w-xl text-3xl font-bold tracking-tight text-text sm:text-4xl">
        {t("headline")}
      </h2>
      <ol className="mt-12 max-w-2xl">
        {pasos.map((paso, i) => (
          <Step
            key={paso.titulo}
            titulo={paso.titulo}
            body={paso.body}
            last={i === pasos.length - 1}
          />
        ))}
      </ol>
    </section>
  );
}
