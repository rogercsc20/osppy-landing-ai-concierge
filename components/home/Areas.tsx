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
   pointer is not the only way to ask a list a question.

   **HOW BIG THE FRAME CAN BE, measured before it was chosen (v5 T6).** The
   operator asked for much bigger photographs here. The size is capped by the
   photo bank, and the cap is NOT the one the plan assumed.

   `optimize-photos.mjs` writes every photo at a LONG EDGE of 1600, so the
   plan reasoned that a 24rem frame already spends 768 of 1600 at DPR 2 and
   that the bank would take roughly double — about 48rem. That holds for
   eighteen of the twenty. It does not hold for `legal` (original 4000x6000)
   and `mantenimiento` (5304x7952), which are PORTRAIT: capping their long
   edge caps their HEIGHT, so they are delivered **1067 px wide**, two thirds
   of what every other photo gets. This frame is `aspect-[4/3]` with
   object-cover, so a portrait source binds on WIDTH. The bank's real ceiling
   is 1067 px of frame width at DPR 1, not 1600.

   Which makes the choice arithmetic rather than taste. next/image serves a
   width from `deviceSizes`/`imageSizes` in next.config.ts, so at DPR 2 a
   32rem frame (512 CSS px) asks for **1024**, and 1067 covers it with room.
   The next step the config offers is **1280**, which those two cannot cover
   and would upscale by 1.20x. 32rem is therefore the largest frame at which
   EVERY photograph in the bank is still delivered at or above the size it is
   painted at. The plan's own recommendation of 40rem sits past it, on a
   premise measured false here.

   Raising it further is a real option and it belongs to the operator: the two
   portrait originals have enormous headroom (6000 and 7952 px on their long
   edge), so re-running the optimizer with a larger `LONG_EDGE` would lift the
   ceiling for all twenty. That is the "re-optimize the twenty photos" the
   plan fences off, and until it happens 32rem is the honest maximum. */

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
          {/* E3c: the headline is now the two words the operator asked for
              and the paragraph under it is gone ("todo eso me lo quitas… y le
              pones una frase tipo Áreas Funcionales"). The scroll of sixteen
              below is untouched. */}
          <h2 className="font-display max-w-4xl text-h2 font-semibold text-text">
            <SplitText text={t("headline")} />
          </h2>
        </Reveal>

        {/* ── lg and up: the list, and one frame that follows it ───────── */}
        {/* v5 T6: the frame grows from 24rem to 32rem — +33 % across, +78 % in
            area — and 32rem is not a taste, it is the ceiling. See the
            docstring: two of the twenty masters are 1067 px wide, and
            next/image asks for 1024 at this size and for 1280 at the next
            step up. */}
        <div className="mt-14 hidden gap-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]">
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
                      sizes="(min-width: 1024px) 32rem, 100vw"
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

              {/* Points at the close, and stays there. It used to be a
                  placeholder for /diagnostico; that route left the scope with
                  no date (HQA-D93), so the conversation IS the destination
                  rather than a stand-in for one. */}
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
