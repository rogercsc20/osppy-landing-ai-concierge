"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { Pinned } from "@/components/fx/Pinned";
import { DUR, EASE_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* HOW, first beat — the method, and the one section of the page that pins
   (landing v2 §3: sticky storytelling is used ONCE or it stops meaning
   anything). The chapter holds still while the scroll walks the four steps;
   below lg and under reduced motion the four simply stack, which is why the
   step body is one component used by both shapes.

   The copy is unchanged from the previous home: it is the paragraph that
   survived every review. */

const STEPS = ["p1", "p2", "p3", "p4"] as const;

function StepBody({
  titulo,
  body,
  index,
}: {
  titulo: string;
  body: string;
  index: number;
}) {
  return (
    <div>
      <span className="font-display text-sm font-semibold tabular-nums text-accent-text">
        {`0${index + 1}`}
      </span>
      <h3 className="font-display mt-3 text-h2 font-semibold text-text">{titulo}</h3>
      <p className="mt-5 max-w-xl text-lead text-text-2">{body}</p>
    </div>
  );
}

/** The rail: four dots, the current one lit and grown. */
function Rail({ step, labels }: { step: number; labels: string[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {labels.map((label, i) => (
        <li key={label} className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className={cn(
              "h-px transition-all duration-500",
              i === step ? "w-12 bg-accent-text" : "w-6 bg-line",
            )}
          />
          <span
            className={cn(
              "text-sm transition-colors duration-500",
              i === step ? "font-medium text-text" : "text-text-2",
            )}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Como() {
  const t = useTranslations("home.como");
  const reduce = useReducedMotion();
  const steps = STEPS.map((k) => ({ titulo: t(`${k}Titulo`), body: t(`${k}Body`) }));
  const labels = steps.map((s) => s.titulo);

  return (
    <section id="como" className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("kicker")}</p>
          <h2 className="font-display mt-5 max-w-3xl text-h2 font-semibold text-text">
            <SplitText text={t("headline")} />
          </h2>
        </Reveal>

        <Pinned steps={steps.length} className="mt-16">
          {(step, stacked) =>
            stacked ? (
              <div className="border-t border-line py-10">
                <StepBody {...steps[step]} index={step} />
              </div>
            ) : (
              <div className="grid w-full grid-cols-[minmax(0,14rem)_1fr] gap-16">
                <Rail step={step} labels={labels} />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={reduce ? undefined : { opacity: 0, y: -24, filter: "blur(6px)" }}
                    transition={{ duration: DUR.fast, ease: EASE_EXPO }}
                  >
                    <StepBody {...steps[step]} index={step} />
                  </motion.div>
                </AnimatePresence>
              </div>
            )
          }
        </Pinned>
      </div>
    </section>
  );
}
