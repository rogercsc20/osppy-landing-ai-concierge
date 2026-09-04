"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { FxLayer } from "@/components/fx/FxLayer";
import { gsap } from "@/lib/gsap-init";
import { MOTION_OK } from "@/lib/gsap-motion";

/* Section 1 (HQA-D90): the house opens with a feeling, not an argument. One
   phrase, enormous, and a background that has to produce RELIEF — corporate
   and warm at once, explicitly not sombre futurism.

   What it does NOT have, and each absence is a decision, not an omission:
   no photo (gate E0-3, re-ratified 2026-09-04 against a contrary remark), no
   panel, no diagram, no figures, and NO BUTTON (decision 2 of the E3a gate:
   the first screen is a promise and the scroll indicator is the only action).

   The h1 is the LCP element, so it enters with `animate-rise-only` and never
   starts at opacity 0 — the rule globals.css has carried since V3.

   The height lives on the inner wrapper and never on the <section>: the
   plan asks for it there because check-sections.mjs fails on a section that
   declares its own full-screen height, and that guard is from V2.

   The breathing object is ONE tween on transform and opacity, configured
   only under `prefers-reduced-motion: no-preference` via matchMedia, so
   under reduced motion it is never set up at all — not merely paused
   (HQA-D80). It is not scroll-linked: the house already publishes at
   Lighthouse 51 with 28 ScrollTrigger instances as the measured cause
   (HQA-D87), and the first screen is the last place to add a 29th. */
export function HeroCorporativo() {
  const t = useTranslations("home.hero");
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.to(".hero-breath", {
          scale: 1.08,
          opacity: 0.75,
          duration: 9,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative px-4 sm:px-6">
      <FxLayer>
        {/* Two auras of the atmosphere that already exists, raised here:
            sage above, copper below. No new engine, no new file. */}
        {/* bottom is NEGATIVE on purpose: a glow that ends exactly on the
            section boundary draws a visible horizontal seam, which is the
            one thing landing v2 §2 rule 1 forbids by name. It bleeds into
            section 2 instead, and FxLayer is overflow-visible so it can. */}
        <div
          className="absolute inset-x-0 -top-16 bottom-[-25%]"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 8%, color-mix(in srgb, var(--glow-2) 34%, transparent), transparent 62%), radial-gradient(55% 45% at 50% 96%, color-mix(in srgb, var(--glow-4) 26%, transparent), transparent 60%)",
          }}
        />
        {/* The object that breathes: one very large soft ring, animated on
            transform and opacity only. */}
        <div
          className="hero-breath absolute left-1/2 top-1/2 aspect-square w-[min(120vw,68rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-100"
          style={{
            background:
              "radial-gradient(closest-side, transparent 62%, color-mix(in srgb, var(--accent) 22%, transparent) 74%, transparent 84%)",
          }}
        />
      </FxLayer>

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col items-center justify-center pt-16 pb-24 text-center">
        <h1
          className="font-display animate-rise-only text-display font-extrabold tracking-tight text-balance text-text"
          style={{ "--rise-delay": "0.05s" } as CSSProperties}
        >
          {t("headline")}
        </h1>
        <p
          className="font-display animate-fade-rise mt-8 max-w-2xl text-h3 font-medium text-text-2"
          style={{ "--rise-delay": "0.25s" } as CSSProperties}
        >
          {t("apoyo")}
        </p>

        {/* The only action on the first screen. A link, not a button: it
            takes the reader to the next section, which is what the arrow
            promises. */}
        <a
          href="#aplicada"
          className="animate-fade-rise mt-16 inline-flex flex-col items-center gap-2 text-xs font-medium tracking-[0.2em] text-text-2 uppercase transition-colors hover:text-text"
          style={{ "--rise-delay": "0.45s" } as CSSProperties}
        >
          {t("scroll")}
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
