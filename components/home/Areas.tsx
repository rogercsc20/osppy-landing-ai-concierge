"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { Photo } from "@/components/media/Photo";
import { useMotionOK, useReducedMotion } from "@/components/fx/motion-hooks";
import { AREAS } from "@/lib/areas";
import { DUR, EASE_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* WHAT, first beat — the sixteen areas (HQA-D37, HQA-D76): the section that
   answers "¿en qué áreas?".

   It stopped being a grid of equal cards in tanda C (C4). At eight the grid
   was a grid; at sixteen it is wallpaper, and every card weighed the same as
   every other, which is the opposite of what a reader needs from a list they
   are supposed to find THEMSELVES in. Now it is an editorial list: sixteen
   names set large, one under the other, and a single frame on the right that
   takes the photograph and the typical task of whichever row the reader is
   on. ONE photo does the work of sixteen cards.

   No badge. All sixteen are `hecho` in data/areas.json with the ledger row as
   their source (which is what check-copy demands), and the operator's ruling
   is that their presence on the page IS the claim: «no tienes que poner que
   se ofrecen, implícitamente decimos que ya las hacemos, por eso estan en la
   pagina».

   Below `lg`, and under reduced motion, the same data is an accordion: the
   pointer is not the only way to ask a list a question. */

export function Areas() {
  const t = useTranslations("home.areas");
  const locale = useLocale();
  const ok = useMotionOK();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);

  const area = AREAS[active];

  return (
    <section id="areas" className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("kicker")}</p>
          <h2 className="font-display mt-5 max-w-4xl text-h2 font-semibold text-text">
            <SplitText text={t("headline")} />
          </h2>
          <p className="mt-6 max-w-2xl text-lead text-text-2">{t("body")}</p>
        </Reveal>

        {/* ── lg and up: the list, and one frame that follows it ───────── */}
        <div className="mt-14 hidden gap-14 lg:grid lg:grid-cols-[1fr_minmax(0,24rem)]">
          <ul
            className="flex flex-col"
            onMouseLeave={ok ? () => setActive(0) : undefined}
          >
            {AREAS.map((a, i) => (
              <li key={a.slug}>
                <button
                  type="button"
                  onMouseEnter={ok ? () => setActive(i) : undefined}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={i === active}
                  className={cn(
                    "group flex w-full items-baseline gap-4 border-b border-line py-3 text-left transition-colors duration-300",
                    i === active ? "text-text" : "text-text-2 hover:text-text",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-px shrink-0 self-center bg-accent-text transition-all duration-300",
                      i === active ? "w-8 opacity-100" : "w-0 opacity-0",
                    )}
                  />
                  <span className="font-display text-h3 font-medium leading-tight">
                    {t(`${a.key}.nombre`)}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="relative">
            <div className="sticky top-28">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={area.slug}
                    className="absolute inset-0"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: DUR.fast, ease: EASE_EXPO }}
                  >
                    <Photo
                      slug={area.foto}
                      locale={locale}
                      sizes="(min-width: 1024px) 24rem, 100vw"
                      className="h-full w-full"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={area.slug}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: DUR.fast, ease: EASE_EXPO }}
                >
                  <p className="mt-6 text-base leading-relaxed text-text-2">
                    {t(`${area.key}.tarea`)}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* The diagnosis takes the area as its entry hint (?area=…) and
                  ships in V5; until then this points at the one place that can
                  answer today — a conversation. */}
              <a
                href="#demo"
                className="link-underline mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent-text"
              >
                {t("cardCta")}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* ── below lg: the same sixteen as an accordion ───────────────── */}
        <ul className="mt-12 lg:hidden">
          {AREAS.map((a, i) => {
            const isOpen = open === i;
            return (
              <li key={a.slug} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span
                    className={cn(
                      "font-display text-h3 font-medium leading-tight transition-colors",
                      isOpen ? "text-text" : "text-text-2",
                    )}
                  >
                    {t(`${a.key}.nombre`)}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      "h-4 w-4 shrink-0 text-text-2 transition-transform duration-300",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="pb-6">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-line">
                      <Photo
                        slug={a.foto}
                        locale={locale}
                        sizes="100vw"
                        className="h-full w-full"
                      />
                    </div>
                    <p className="mt-4 text-base leading-relaxed text-text-2">
                      {t(`${a.key}.tarea`)}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <Reveal delay={0.1} className="mt-10">
          <p className="max-w-3xl border-t border-line pt-6 text-sm leading-relaxed text-text-2">
            {t("nota")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
