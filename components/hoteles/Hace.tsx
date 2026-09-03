"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { useTranslations } from "next-intl";
import { CalendarCheck, MousePointerClick, ArrowUpRight } from "lucide-react";
import { Reveal, Stagger } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { Conversacion } from "./Conversacion";

/* What Diana does (source of truth §4.4): the guest conversation plays
   itself as the section travels the viewport; three hairline items name
   the three moves — quote and build, hand over with a button, escalate. */
export function Hace() {
  const t = useTranslations("hoteles.hace");
  const etiqueta = useTranslations("hoteles.hero")("demoEtiqueta");
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.75"] });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setProgress(v));

  const items = [
    { icon: CalendarCheck, title: t("i1.titulo"), body: t("i1.body") },
    { icon: MousePointerClick, title: t("i2.titulo"), body: t("i2.body") },
    { icon: ArrowUpRight, title: t("i3.titulo"), body: t("i3.body") },
  ];

  return (
    <section className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div ref={ref} className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 flex flex-col items-center gap-5 lg:order-1">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,211,102,0.13),transparent)] blur-2xl"
            />
            <Conversacion progress={progress} />
            <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-text-2">
              {etiqueta}
            </span>
          </div>

          <div className="order-1 lg:order-2">
            <Reveal className="mb-12">
              <p className="eyebrow mb-5">{t("kicker")}</p>
              <h2 className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-text">
                <SplitText text={t("headline")} />
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-2">{t("body")}</p>
            </Reveal>

            <Stagger className="divide-y divide-line border-y border-line">
              {items.map(({ icon: Icon, title, body }) => (
                <div key={title} className="group flex gap-5 py-6">
                  <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl glass transition-colors group-hover:border-accent-text/40">
                    <Icon className="h-4 w-4 text-accent-text" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="mb-1 font-semibold text-text">{title}</h3>
                    <p className="text-[15px] leading-relaxed text-text-2">{body}</p>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
