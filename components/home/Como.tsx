"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { Reveal } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { Pinned, type GoTo } from "@/components/fx/Pinned";
import { DUR, EASE_EXPO } from "@/lib/motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/* HOW, first beat — the method, and the one section of the page that pins
   (landing v2 §3: sticky storytelling is used ONCE or it stops meaning
   anything).

   FIVE phases since tanda D (D6). The operator's answer at the gate replaced
   the earlier list outright: «Exploracion (descubrimiento y viabilidad),
   Diagnostico (evaluacion de datos y auditoria), Diseno de Solucion (PoC),
   Implementacion Desarrollo y MLOps, Soporte y Monitoreo (gobernanza y
   reentrenamiento)» — recorded verbatim in the ledger (HQA-D84). The bar
   carries the short names; each parenthesis became the concept-first opening
   of its step body (guide §6.6: the clear concept before the term).

   The chapter also takes the DIAGRAM the hero gave up: with the operation
   panel on the hero's right, an 824px diagram below it would refill exactly
   what the operator asked to lighten. Here its content is the five phases —
   which is what the master prompt §5 asked for («Capítulo Pinned, diagrama
   avanza por paso») and was never built. HTML nodes, not SVG text: labels
   wrap naturally, so nothing assumes two words per label the way the old
   splitLabel() did — «Soporte y monitoreo» would have broken it.

   The bar is CLICKABLE at lg+ (tanda D point 6). A click cannot just
   setState: the step is a function of scroll position, recomputed on every
   trigger update, so the click SCROLLS — Pinned's goTo aims at the centre
   of the step's band using ScrollTrigger's own geometry. Below lg there is
   no track (it is hidden, its geometry reads zero), so the stacked steps
   carry anchor ids and a strip of pill links does the jumping: Lenis
   (anchors: true) makes it smooth, and with JavaScript gone it degrades to
   a native jump.

   **Since v5 T7 that clickable bar IS the diagram** (decisions D-4 output A
   and 5b): the rail of names on the left is deleted and the nodes on the
   right are the chapter's only control. See PhaseNav for why the
   `aria-hidden` could come off, why the shape is an `<ol>` of `<button>`,
   and why the active node stopped breathing. */

const STEP_COUNT = 5;
const STEP_IDS = Array.from({ length: STEP_COUNT }, (_, i) => `como-p${i + 1}`);

/* HQA-D92: the five phases stop being a chapter and become navigation.
   Exploración → training, Diagnóstico → advisory, and the last three →
   implementation, which is the operator's own mapping. Three of the five
   share a destination, which is exactly why each link carries the SERVICE
   NAME and not "ver más": five links called "ver más" are five
   indistinguishable links to anyone reading with a keyboard or a screen
   reader. The label comes from `pNCta`, one key per phase. */
const STEP_HREF: readonly AppPathname[] = [
  "/capacitacion",
  "/asesoria",
  "/implementacion",
  "/implementacion",
  "/implementacion",
];

function StepBody({
  titulo,
  body,
  cta,
  index,
}: {
  titulo: string;
  body: string;
  cta: string;
  index: number;
}) {
  return (
    <div>
      <span className="font-display text-sm font-semibold tabular-nums text-accent-text">
        {`0${index + 1}`}
      </span>
      <h3 className="font-display mt-3 text-h2 font-semibold text-text">{titulo}</h3>
      <p className="mt-5 max-w-xl text-lead text-text-2">{body}</p>
      {/* The phase's own door. A real link, not the rail button: the rail
          SCROLLS within the chapter and this NAVIGATES away from it, and one
          control cannot mean both. */}
      <Link
        href={STEP_HREF[index]}
        className="link-underline group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent-text"
      >
        {cta}
        <ArrowUpRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}

/** The five phases, and the chapter's ONLY control (v5 T7, decisions D-4
    output A and 5b).

    There used to be two controls saying exactly the same five things: a rail
    of names down the left (clickable since HQA-D92) and these nodes down the
    right (`aria-hidden`, not clickable). The operator saw the duplication and
    ruled that one survives — these. **The rail is deleted**, and with it the
    16rem column it occupied.

    That is why `aria-hidden="true"` could come off. It was there on purpose:
    the rail and the body already said all five phases in text, so announcing
    them a third time was noise. The moment the nodes take a click they must
    leave the hidden subtree — focusable content inside `aria-hidden` is a
    WCAG failure axe reports, and accessibility is the one number on this site
    that is at its target. The duplication that removing it would have created
    is gone by DESIGN rather than patched: there is no second list left to
    duplicate.

    **An `<ol>` of `<button>` with `aria-current="step"`, and the shape is not
    incidental.** It is the shape the dead rail had, and the test
    `clicking the third phase in the bar scrolls the chapter there` addresses
    `.pin-spacer ol button` and asserts on `[aria-current="step"]` without
    naming the rail — so it keeps biting, unedited, on a control it was never
    written for. Built as `<div onClick>` instead, it would have needed
    rewriting AND the chapter would have lost the keyboard.

    **The click SCROLLS.** The step is a function of scroll position and is
    recomputed on every trigger update, so a `setStep` is overwritten on the
    next frame. `goTo` from Pinned already aims at the centre of the step's
    band using ScrollTrigger's own geometry; it is inherited from the rail,
    not reinvented.

    **The active node no longer breathes.** It carried `Float distance={4}
    duration={5}` forever. The operator's instruction was "suave, o quitarla
    por completo", and 5b decides between those two halves on its own: the
    node is now a CLICK TARGET, and a target that drifts under the pointer is
    a target you aim at while it moves. Softening keeps that. The connector
    fill stays — it is transform-only, it runs once per step, and it is
    information rather than decoration. The active node is still unmistakable
    without motion: its own border, its tint and `aria-current`. */
function PhaseNav({
  step,
  labels,
  goTo,
}: {
  step: number;
  labels: string[];
  goTo: GoTo;
}) {
  return (
    <ol className="flex flex-col">
      {labels.map((label, i) => {
        // keyed by index, not label: titles are copy and copy may repeat
        const active = i === step;
        const done = i < step;
        return (
          <li key={i} className="flex flex-col">
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition-colors duration-500",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text",
                active
                  ? "border-accent-text bg-accent-text/10 font-medium text-text"
                  : done
                    ? "border-line bg-surface text-text-2 hover:border-accent-text/60 hover:text-text"
                    : "border-line/60 text-text-2/70 hover:border-accent-text/60 hover:text-text",
              )}
            >
              <span className="font-display mr-2 text-xs font-semibold tabular-nums text-accent-text">
                {`0${i + 1}`}
              </span>
              {label}
            </button>
            {i < labels.length - 1 && (
              <div
                aria-hidden="true"
                className="mx-auto h-6 w-[2px] overflow-hidden bg-line/50"
              >
                {/* the connector fills top-down once its step is behind the
                    reader — transform only, per the motion budget */}
                <div
                  className={cn(
                    "h-full w-full origin-top bg-accent-text transition-transform duration-500",
                    i < step ? "scale-y-100" : "scale-y-0",
                  )}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function Como() {
  const t = useTranslations("home.como");
  const reduce = useReducedMotion();
  const steps = Array.from({ length: STEP_COUNT }, (_, i) => ({
    titulo: t(`p${i + 1}Titulo`),
    body: t(`p${i + 1}Body`),
    cta: t(`p${i + 1}Cta`),
  }));
  const labels = steps.map((s) => s.titulo);

  return (
    // id="como" stays on the section: the Navbar link and the scroll-spy
    // IntersectionObserver both address it.
    <section id="como" className="relative px-4 pt-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display max-w-3xl text-h2 font-semibold text-text">
            <SplitText text={t("headline")} />
          </h2>
        </Reveal>

        {/* Below lg there is no rail and no pinning: a draggable strip of
            pills, each one a plain anchor to a stacked step. Works with
            JavaScript disabled; Lenis makes it smooth when it is enabled.
            The landmark's name is a key of its OWN. It used to borrow the
            section kicker, and when the house's nine kickers died (v5 T1,
            D-5) this <nav> would have been left nameless with no test
            looking; now one does. */}
        <nav
          aria-label={t("navLabel")}
          className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {labels.map((label, i) => (
            <a
              key={i}
              href={`#${STEP_IDS[i]}`}
              className="flex-shrink-0 rounded-full border border-line px-3.5 py-1.5 text-sm text-text-2 transition-colors hover:border-accent-text hover:text-text"
            >
              {label}
            </a>
          ))}
        </nav>

        <Pinned steps={STEP_COUNT} stepVh={60} className="mt-4 lg:mt-16">
          {(step, stacked, goTo) =>
            stacked ? (
              <div id={STEP_IDS[step]} className="border-t border-line py-10">
                <StepBody {...steps[step]} index={step} />
              </div>
            ) : (
              /* Two columns since v5 T7, not three. The 16rem the rail held
                 belongs to the five step IMAGES the operator still owes
                 (plan O-1, open since tanda D): when they arrive, a third
                 column goes back in FIRST here and the body returns to the
                 measure it had. It is not drawn now — an empty bordered
                 frame reads as a mistake, and a wide empty gutter reads as
                 one too, so the body takes the width in the meantime. */
              <div className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,15rem)] gap-10 xl:gap-16">
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
                <PhaseNav step={step} labels={labels} goTo={goTo} />
              </div>
            )
          }
        </Pinned>
      </div>
    </section>
  );
}
