import { gsap } from "@/lib/gsap-init";
import { MOTION_OK } from "@/lib/gsap-motion";

/**
 * The one-shot entrance mechanism, on IntersectionObserver (tanda E6).
 *
 * **Why this is not ScrollTrigger.** HQA-D87 measured it: under `motion` the
 * site's entrances were IntersectionObserver callbacks, effectively free;
 * HQA-D80 moved every scroll effect to GSAP and turned them into one
 * ScrollTrigger per entrance, each doing synchronous layout math at
 * hydration. On the tanda-D house that was 28 instances and a 1,111 ms long
 * task. **GSAP stays the animator** — the tween, the easing and the FROM
 * state are unchanged. What goes back to the browser is the only question a
 * one-shot entrance actually asks: is this on screen yet. ScrollTrigger keeps
 * everything that needs scroll POSITION rather than a yes/no: the pinned
 * chapter, the atmosphere lag, the progress bar, the parallax and the veil.
 *
 * **Why the tween is created paused instead of on intersection.** A `from`
 * tween renders its start state the moment it is created, so creating it up
 * front is what keeps the element hidden before it arrives. Creating it on
 * intersection would let the element paint at its natural state first and
 * then snap back to the from state: a flash on every entrance.
 *
 * **Reduced motion is honoured by never running at all**, the same contract
 * `gsap.matchMedia(MOTION_OK)` gave before: the setup body only runs under
 * "no-preference", so no from state is ever written and the element stays
 * exactly as the server rendered it. That is what makes the reduced pass of
 * scripts/capture.mjs hold by construction rather than by a second code path.
 */
export function enterOnce(
  el: Element | null,
  amount: number,
  build: () => gsap.core.Tween | undefined,
): () => void {
  if (!el) return () => {};

  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    const tween = build();
    if (!tween) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // "amount of what CAN be shown is shown". Comparing the visible
          // height against min(element, viewport) rather than against the
          // element alone is what keeps a section taller than the screen from
          // waiting forever for a ratio it can never reach — the failure mode
          // a bare `threshold: amount` has on exactly the full-height sections
          // this site is made of.
          const rootHeight = entry.rootBounds?.height ?? window.innerHeight;
          const reference = Math.min(
            entry.boundingClientRect.height,
            rootHeight,
          );
          const shown = entry.intersectionRect.height;
          if (reference > 0 && shown >= amount * reference) {
            tween.play();
            io.disconnect();
            return;
          }
        }
      },
      { threshold: STEPS },
    );
    io.observe(el);
    return () => io.disconnect();
  });

  return () => mm.revert();
}

/** Enough steps that the rule above is evaluated as the element slides in;
    coarser than a scroll handler by two orders of magnitude, which is the
    entire point. */
const STEPS = Array.from({ length: 21 }, (_, i) => i / 20);
