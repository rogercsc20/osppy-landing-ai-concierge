import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FxLayer } from "@/components/fx/FxLayer";
import { Photo } from "@/components/media/Photo";

/* Section 1 (HQA-D90, amended by v5 T3): the house opens with a feeling, not
   an argument. One phrase, enormous, over a photograph — and the photograph is
   the amendment. HQA-D90 opened the house on an abstract written in code and
   said, in the same row, that "if the operator gets a photo later it enters
   as a layer on top without redoing anything". That is what happened on
   2026-09-04 (plan v5 D-1, salida A): the operator sent a generated image and
   chose it knowingly, reopening HQA-D31 ("no model-generated images"), HQA-D41
   ("never in a hero") and HQA-D90 ("sin foto") in one ledger row.

   What the first screen does NOT have, and each absence is a decision:
   no panel, no diagram, no figures, and NO ACTION AT ALL — no button, no
   contact link, and since T3 no scroll indicator either (the operator:
   "quitar el botón de Baja"). The first screen is a promise and nothing else.

   The photo is decoration, so it lives inside FxLayer (aria-hidden, -z-10):
   no reader hears it before the <h1>, and its alt stays as traceability and
   as the component's contract. The two auras and the breathing ring that
   built the atmosphere before the photo are GONE, not hidden: the copper aura
   fused into a golden sky, the sage one fought it, and a teal ring around the
   sun read as a halo. With them went the hero's only GSAP tween and its
   "use client": the first screen is now a server component with no JS motion,
   which is also what keeps the ground under the headline STILL, so the
   contrast floor below is one number and not a range.

   The photo ends at the section's bottom edge, and a full-bleed image ending
   on a boundary is exactly the horizontal seam landing v2 §2 rule 1 forbids
   (the reason the old aura bled 25% into section 2). So the photo AND its
   veil sit in one wrapper that carries a mask fading to transparent over the
   bottom 38%: the page ground shows through and section 2 starts with no
   line. Both layers share the wrapper on purpose — a veil that outlived the
   photo would paint its own band.

   THE CONTRAST FLOOR. check-contrast.mjs measures tokens and cannot see text
   over an image; the ground here changes pixel by pixel, and the sun (the
   brightest zone, at x≈50% y≈55% of the frame) sits behind the centred
   headline. The veil is `--hero-veil` in globals.css, a wash of the page's
   own ground at a measured alpha per theme: Marfil over the photo in light
   mode so Tinta stays readable (the two `--veil` values are both dark, and
   dark ink on a dark veil is the defect E3c caught in Silencio), Obsidian in
   dark mode. It was measured on a viewport capture against `next start`, a
   grid sampled INSIDE the boxes of the <h1> and the <p> with the letters
   hidden, in both modes, at 1280x900 and 360x780, reduced motion and not;
   the table lives next to the token in globals.css. The minimum is the
   number that rules: <h1> (44px+, extrabold) needs 3:1 everywhere, <p>
   (21.2px at 360, weight 500) needs 4.5:1 everywhere. The <p> reads
   `text-text` and not `text-text-2` for that reason: Grafito needs an alpha
   near 0.9 to pass over the silhouettes, which would erase the photo the
   operator asked to see.

   The h1 is or was the LCP element, so it enters with `animate-rise-only`
   and never starts at opacity 0 — the rule globals.css has carried since V3.
   The photo has no entrance: a `priority` image starting at opacity 0 would
   move the LCP back and gain nothing.

   The height lives on the inner wrapper and never on the <section>:
   check-sections.mjs fails on a section that declares its own full-screen
   height, and that guard is from V2. */

/** Bottom fade of the photo+veil wrapper: opaque to 62%, gone at 100%. */
const HERO_FADE = "linear-gradient(to bottom, #000 62%, transparent 100%)";

export function HeroCorporativo() {
  const t = useTranslations("home.hero");
  const locale = useLocale();

  return (
    <section className="relative px-4 sm:px-6">
      <FxLayer>
        <div
          className="absolute inset-0"
          style={{ maskImage: HERO_FADE, WebkitMaskImage: HERO_FADE }}
        >
          {/* `absolute inset-0` wins over Photo's own `relative` through
              twMerge. `veil={false}`: the house veil is dark in both modes and
              this ground needs to follow the theme (see the docstring). */}
          <Photo
            slug="hero"
            locale={locale}
            priority
            sizes="100vw"
            veil={false}
            className="absolute inset-0"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "var(--hero-veil)" }}
          />
        </div>
      </FxLayer>

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col items-center justify-center pt-16 pb-24 text-center">
        <h1
          className="font-display animate-rise-only text-display font-extrabold tracking-tight text-balance text-text"
          style={{ "--rise-delay": "0.05s" } as CSSProperties}
        >
          {t("headline")}
        </h1>
        <p
          className="font-display animate-fade-rise mt-8 max-w-2xl text-h3 font-medium text-text"
          style={{ "--rise-delay": "0.25s" } as CSSProperties}
        >
          {t("apoyo")}
        </p>
      </div>
    </section>
  );
}
