"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-init";

/**
 * A hairline of accent across the top of the page that fills as you read.
 * Sits above the navbar's border, decorative and aria-hidden.
 *
 * This one runs under reduced motion too, and on purpose: it is not an
 * animation, it is a readout of where you are in the document. Suppressing it
 * would remove information, not motion. What reduced motion drops is the
 * catch-up — `scrub: true` pins the bar to the exact scroll position instead
 * of easing toward it.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.fromTo(
      ref.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: smooth ? 0.3 : true,
        },
      },
    );
  }, { scope: ref });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left scale-x-0 bg-accent-text"
    />
  );
}
