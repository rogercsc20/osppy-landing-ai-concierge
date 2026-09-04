"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { SplitText } from "@/components/fx/SplitText";
import { gsap } from "@/lib/gsap-init";
import { MOTION_OK } from "@/lib/gsap-motion";

/* Section 3: the only section of the site that is an experience and not a
   text. The operator's words: "eso todo en un renglón junto, y después
   silencio, y el cursor así parpadeando está perfecto", and "hay que hacerla
   como una página completa".

   The emptiness is PAINTED, not themed. The veil is a gradient in a layer of
   this section; `data-theme` is never touched, because touching it would
   break the toggle, the <meta name="theme-color"> and the layout's
   pre-paint. It also has to work in BOTH modes, so in light it is a real ink
   veil and not an absence of colour — which is why the colour is a fixed
   near-black with alpha rather than a token that flips with the mode.

   **And that is exactly what makes the text colour a decision and not a
   detail.** If the ground goes dark under a headline whose colour still
   comes from `--text`, light mode paints dark ink on a dark veil and the
   sentence stops being readable. Two things follow, and both are here on
   purpose: the headline carries a FIXED light colour in both modes, because
   this section paints its own ground; and the veil never drops to zero while
   the section is on screen — it breathes between a floor and full, so a
   light sentence is never left sitting on Marfil. Caught on a capture, not
   by check-contrast, which measures tokens and cannot see a layer stacked
   under text.

   The exit is ONE scrubbed timeline, and one is the budget: the veil
   thins as the reader scrolls out, and section 4 is handed over already
   lit. No `filter: blur` on anything large; the veil is a background, not a
   filter.

   Under reduced motion nothing is configured — matchMedia only RUNS the
   setup when the query matches — so the section renders still, with the
   caret standing (globals.css stops caret-blink there too). The veil's CSS
   opacity is its RESTING value, not zero, which is what makes that degrade
   correct: the reduced-motion reader gets the dark section and the readable
   sentence, just without the breathing. */
/** The veil never fully lifts while the section is on screen: below this the
    fixed light headline would be sitting on Marfil in light mode. The number
    is MEASURED, not chosen by eye. Compositing #040807 at this alpha over
    Alba's #f7f5f0 puts the headline at 5.10:1, against the 3:1 WCAG floor
    for text at 24px or more; 0.55 would have been 3.70:1, which passes and
    leaves no margin for a lighter ground later. In Obsidian every value is
    above 16:1 and the floor is irrelevant. */
const VEIL_FLOOR = 0.65;

export function Silencio() {
  const ref = useRef<HTMLDivElement>(null);

  const t = useTranslations("home.silencio");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.4,
            },
          })
          // in: the dark gathers as the section arrives
          .fromTo(".silencio-veil", { opacity: VEIL_FLOOR }, { opacity: 1, ease: "none" })
          // hold it shut across the middle of the crossing
          .to(".silencio-veil", { opacity: 1, duration: 1, ease: "none" })
          // out: it thins, and hands over the section below already lit
          .to(".silencio-veil", { opacity: VEIL_FLOOR, ease: "none" });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section className="relative px-4 sm:px-6">
      {/* The veil sits BEHIND the words, not over them. Painted on top it
          reads exactly as the section wants — until you try to read the
          sentence, which drops to about 2:1 against the dark and stops being
          legible. The emptiness belongs AROUND the line, not on it: the veil
          swallows the atmosphere and the ground, and the copy keeps its
          contrast. Caught by looking at a capture, not by check-contrast,
          which measures tokens and never sees a layer stacked over text. */}
      <div
        ref={ref}
        className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-4xl flex-col justify-center"
      >
        <div
          aria-hidden="true"
          className="silencio-veil pointer-events-none absolute inset-x-[-50vw] inset-y-[-20%] -z-10 opacity-90"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 50%, rgba(4,8,7,0.94), rgba(4,8,7,0.82) 70%, rgba(4,8,7,0) 100%)",
          }}
        />

        <h2 className="font-display max-w-3xl text-h2 font-semibold text-balance text-[#e8efec]">
          <SplitText text={t("headline")} />
        </h2>

        {/* The silence, drawn: an answer line that never gets its answer.
            Decorative, so it is aria-hidden and adds no text — the headline
            already says it out loud. */}
        <div
          aria-hidden="true"
          className="mt-12 flex h-16 max-w-2xl items-center border-l-2 border-white/20 pl-6"
        >
          <span className="caret-blink h-6 w-[2px] bg-[#e8efec]/70" />
        </div>
      </div>
    </section>
  );
}
