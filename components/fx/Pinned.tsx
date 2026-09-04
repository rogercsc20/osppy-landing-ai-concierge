"use client";

import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap-init";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "./motion-hooks";
import { cn } from "@/lib/utils";
import { MOTION_OK } from "@/lib/gsap-motion";

/** Jump the page to a step of the chapter. */
export type GoTo = (step: number) => void;

/**
 * Sticky storytelling, used once per page (landing v2 §3): the chapter holds
 * still while the scroll advances its step. Below `lg` and under reduced
 * motion the steps simply stack, which is why `children` receives the step
 * index and `steps` the total — the caller draws both shapes from one source.
 *
 * On ScrollTrigger since 2026-09-03. The visible result is the same, but the
 * geometry stops being guesswork: the old version measured its own tall
 * spacer with useScroll, and a caller that wanted to jump to a step had to
 * re-derive those numbers by hand. ScrollTrigger already knows `self.start`
 * and `self.end` in document pixels, so `goTo` reads them instead of
 * recomputing them, and the two can no longer drift apart.
 *
 * `goTo` SCROLLS rather than setting the step directly. The step is a
 * function of scroll position, recomputed every frame the trigger updates,
 * so a click that only called setStep would be overwritten on the very next
 * frame. It aims at the CENTRE of a step's band, not its edge, so a
 * sub-pixel rounding error cannot land on the previous step.
 *
 * Which TREE renders is still decided by the hydration-safe useReducedMotion
 * and not by gsap.matchMedia: matchMedia only runs inside an effect, so
 * driving the markup from it would make the server send the stacked shape
 * and the client swap to the pinned one a frame later, on every desktop
 * load. The hook answers false until hydration, so both renders agree and
 * the calm shape takes over afterwards — the same contract every other
 * component here follows.
 */
export function Pinned({
  steps,
  children,
  className,
  stickyClassName,
  stepVh = 100,
}: {
  steps: number;
  children: (step: number, stacked: boolean, goTo: GoTo) => ReactNode;
  className?: string;
  stickyClassName?: string;
  /**
   * Viewport heights of scroll per step, and therefore how long the chapter
   * holds. At 100 the last step still has a full viewport of scroll behind
   * it before the block releases and another full viewport to travel off
   * screen — the empty stretch the operator saw after "Operación" (C1).
   */
  stepVh?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const lenis = useLenis();
  // The trigger is found by id at CLICK time rather than kept in a ref. A
  // ref would be read while rendering the children `goTo` is handed to,
  // which react-hooks/refs rejects — and rightly: the trigger does not exist
  // during the render that passes the callback down, only after the effect
  // that creates it. useId gives one Pinned per page its own name so a
  // second chapter could never steal the first one's geometry.
  const id = `pinned-${useId()}`;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Both conditions in one place: the chapter pins only on a wide
      // viewport AND only when motion is welcome. matchMedia re-evaluates on
      // resize and reverts what it created when a query stops matching,
      // which is what keeps the stacked fallback correct at every width
      // without a resize listener of our own.
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const st = ScrollTrigger.create({
          id,
          trigger: ref.current,
          start: "top top",
          // "%" and not "vh": in a ScrollTrigger end string, a relative
          // percentage means "this much of the SCROLLER's height past the
          // start", which is the viewport and therefore exactly what vh
          // meant in the old CSS height. "vh" is not a unit the end parser
          // knows — it read `+=288vh` as 288 PIXELS, so the chapter pinned
          // for a third of a screen and never left step one. It threw
          // nothing and logged nothing; the browser probe is what caught it.
          end: () => `+=${steps * stepVh}%`,
          pin: pinRef.current,
          pinSpacing: true,
          onUpdate: (self) => {
            setStep(Math.min(steps - 1, Math.max(0, Math.floor(self.progress * steps))));
          },
          // leaving the chapter backwards restores the first step, or the
          // reader scrolls back up into the last one
          onLeaveBack: () => setStep(0),
        });
        return () => {
          st.kill();
          setStep(0);
        };
      });
      return () => mm.revert();
    },
    { dependencies: [steps, stepVh, id], scope: ref },
  );

  const goTo = useCallback<GoTo>(
    (i) => {
      const st = ScrollTrigger.getById(id);
      // Below lg, and under reduced motion, the trigger was never created
      // and its geometry is nothing to compute from. There the stacked steps
      // carry anchor ids and the browser does the scrolling.
      if (!st) return;
      const y = st.start + ((i + 0.5) / steps) * (st.end - st.start);
      // Lenis transforms the page rather than moving the scrollbar, so a
      // smooth window.scrollTo would fight it; and useLenis() is undefined
      // under reduced motion, where there is no provider at all.
      if (lenis) lenis.scrollTo(y);
      else window.scrollTo({ top: y });
    },
    [lenis, steps, id],
  );

  const stacked = Array.from({ length: steps }, (_, i) => (
    <div key={i}>{children(i, true, goTo)}</div>
  ));

  return (
    <>
      {/* stacked: every step drawn in order, no pinning */}
      <div className={cn("lg:hidden", className)}>{stacked}</div>

      {/* pinned: `stepVh` of scroll per step, the chapter stays put.
          ScrollTrigger pins `pinRef` and inserts its own spacer, so this
          wrapper carries no height of its own — the tall div the previous
          version needed is gone, and with it the chance of that height and
          the scroll math disagreeing. */}
      <div ref={ref} className={cn("hidden lg:block", className)}>
        {reduce ? (
          stacked
        ) : (
          // Full-viewport pin box with centred content: the CSS-sticky
          // version floated at top-[16vh] with a 68svh block, which put the
          // reading line at 50vh. ScrollTrigger pins flush to the top, so
          // the same reading line comes from centring inside 100svh instead
          // of from two magic offsets.
          <div ref={pinRef} className={cn("flex min-h-svh items-center", stickyClassName)}>
            {children(step, false, goTo)}
          </div>
        )}
      </div>
    </>
  );
}
