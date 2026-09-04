/**
 * Registration, at module scope, imported by every file that reaches for
 * ScrollTrigger.
 *
 * It lives here and not in a provider's effect because of a failure that is
 * completely silent: `gsap.to(el, { scrollTrigger: {...} })` does not throw
 * when the plugin is unregistered — it drops the key and plays the tween
 * immediately, so the element jumps straight to its end state and the page
 * looks merely "wrong" rather than broken. Effects run child-before-parent,
 * and useGSAP is a LAYOUT effect while a provider's registration would be a
 * passive one, so a provider can never register early enough for its own
 * children. Module evaluation happens at import time, before any component
 * renders, which is the only ordering that holds.
 *
 * Registering more than once is a no-op in GSAP, so importing this from every
 * consumer is free and removes the ordering question entirely.
 *
 * Caught by a browser probe, not by the build: `npm run build`, `npm run
 * lint` and `tsc` were all green while the scroll-progress bar sat at 100 %
 * from the first paint.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
  // Lag smoothing hides a stalled main thread by pretending no time passed,
  // which on a scrubbed timeline reads as the page freezing and then
  // jumping. Scroll-linked animation wants real elapsed time.
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger };
