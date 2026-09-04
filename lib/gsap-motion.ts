/**
 * The same motion vocabulary as lib/motion.ts, expressed the way GSAP wants
 * it. It is a translation, not a second opinion: the cubic-bezier control
 * points are the identical numbers, so an entrance written with GSAP and one
 * written with `motion` land on the same curve and the page keeps one feel
 * even while it has two engines.
 *
 * `motion` takes easing as four numbers; GSAP takes a registered name or a
 * CustomEase. The bezier strings below are read by gsap's built-in
 * `CustomEase`-free path: GSAP accepts a raw `cubic-bezier(...)` string since
 * 3.11, so no extra plugin is loaded for this.
 */
import { EASE_EXPO, EASE_LUXE } from "./motion";

const bezier = (p: readonly [number, number, number, number] | readonly number[]) =>
  `cubic-bezier(${p.join(",")})`;

export const GSAP_EASE_LUXE = bezier(EASE_LUXE);
export const GSAP_EASE_EXPO = bezier(EASE_EXPO);

/**
 * The media query every scroll effect branches on, via `gsap.matchMedia()`.
 *
 * Writing it as "no-preference" rather than negating "reduce" is deliberate:
 * matchMedia only RUNS the setup function when the query matches, so under
 * reduced motion no `from` state is ever written and the element is simply
 * left as the server rendered it — visible. That is what makes the reduced
 * pass of scripts/capture.mjs (nothing at opacity 0 after two seconds) hold
 * by construction instead of by a second code path that has to be remembered.
 */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * ScrollTrigger's `start` for "this element is `amount` revealed", so the
 * ported entrances fire where `motion`'s viewport={{ amount }} used to.
 * `"35% bottom"` reads as: the point 35% down the trigger reaches the bottom
 * of the viewport.
 */
export const startAtAmount = (amount: number) => `${Math.round(amount * 100)}% bottom`;
