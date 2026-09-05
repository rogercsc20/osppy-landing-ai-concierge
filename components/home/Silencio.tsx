"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { SplitText } from "@/components/fx/SplitText";
import { gsap } from "@/lib/gsap-init";
import { MOTION_OK } from "@/lib/gsap-motion";
import { DUR, STAGGER } from "@/lib/motion";

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
    fixed light text would be sitting on Marfil in light mode. The number is
    MEASURED, not chosen by eye, and it moved once.

    E3c set 0.65 by compositing #040807 at the ellipse's centre stop (alpha
    0.94) over Alba's #f7f5f0: 5.10:1 for the headline against the 3:1 WCAG
    floor for text at 24px or more. v5 T2 halved the section, added a SMALL
    line of text (the AI's greeting over the caret, which needs 4.5:1) and
    measured the ground on a full-page capture instead of computing it. The
    5.10:1 turned out to be the exact centre of the ellipse and nothing else:
    the radial's radius is 80% of a box that spans the wrapper plus 100vw, so
    the START of every line sits ~450px off the centre at 1280 (~175px at
    360) and reads the stop between 0.94 and 0.82, not 0.94. Sampled left of
    the text column, at the rows the text occupies, veil at its floor, light
    mode, against #e8efec:

      floor 0.65   headline 4.22:1 (top edge) to 4.54:1 (centre) · greeting
                   4.39 to 4.41:1 — the greeting FAILS 4.5:1 at 1280 and 360
      floor 0.70   headline 4.94:1 (360, top edge) to 5.42:1 · greeting
                   5.12:1 (360, bottom edge) to 5.28:1 — both pass, with margin

    So the floor is 0.70. In Obsidian every value is above 17:1 and the floor
    is irrelevant. The breathing still goes floor → 1 → floor; it is a little
    shallower and the eye cannot tell. */
const VEIL_FLOOR = 0.7;

export function Silencio() {
  const ref = useRef<HTMLDivElement>(null);

  const t = useTranslations("home.silencio");
  const linea1 = t("linea1");
  /* The second line is the second beat of the sentence, not the tail of the
     first: it starts one fast beat after the LAST word of line 1 has begun,
     so "y después, silencio" arrives after the client has finished speaking.
     Computed from the text because the word count differs by language. */
  const linea2Delay = linea1.split(" ").length * STAGGER.words + DUR.fast;

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
      {/* Half a screen, not a full one (v5 T2, operator note 2.4): exactly half
          of what E3c built, which was the viewport under the fixed 4rem nav.
          The height lives HERE and never on the <section>, where
          check-sections.mjs forbids min-h-screen. */}
      <div
        ref={ref}
        className="relative mx-auto flex min-h-[calc(50svh-2rem)] max-w-4xl flex-col justify-center"
      >
        <div
          aria-hidden="true"
          className="silencio-veil pointer-events-none absolute inset-x-[-50vw] inset-y-[-20%] -z-10 opacity-90"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 50%, rgba(4,8,7,0.94), rgba(4,8,7,0.82) 70%, rgba(4,8,7,0) 100%)",
          }}
        />

        {/* ONE heading in two lines (v5 T2): the client's words on the first,
            in curly quotes because the quotes are what make it THEIR voice and
            not Osppy's, and the silence on the second. Two blocks inside one
            <h2>, never two headings. Each SplitText renders its intact string
            in an sr-only span, so the literal space between the blocks is
            what keeps the accessible name from reading "…IA.”Y después…".
            On desktop each line is one line; below lg the text flows. */}
        <h2 className="font-display max-w-4xl text-h2 font-semibold text-balance text-[#e8efec]">
          <span className="block">
            <SplitText text={linea1} />
          </span>{" "}
          <span className="block">
            <SplitText text={t("linea2")} delay={linea2Delay} />
          </span>
        </h2>

        {/* The silence, drawn: what any AI says first, and then an answer line
            that never gets its answer. Decorative, so the box is aria-hidden
            and adds nothing to the reading order — the headline already says
            it out loud, and the greeting is the machine's line in the scene,
            not the page's. The greeting is small text and so needs 4.5:1, not
            the headline's 3:1: it keeps the FULL #e8efec (no alpha — at /70
            like the caret it would fail everywhere in light mode at the
            veil's floor), and the floor itself was raised for it, 0.65 to
            0.70. Measured on a capture, both modes; the numbers are next to
            VEIL_FLOOR. */}
        <div
          aria-hidden="true"
          className="mt-12 flex max-w-2xl flex-col justify-center gap-3 border-l-2 border-white/20 py-1 pl-6"
        >
          <p className="text-base leading-snug text-[#e8efec] sm:text-lg">{t("cursor")}</p>
          <span className="caret-blink h-6 w-[2px] bg-[#e8efec]/70" />
        </div>
      </div>
    </section>
  );
}
