"use client";

import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Spotlight } from "@/components/fx/Spotlight";
import { AppWindow } from "@/components/device/AppWindow";
import { PanelSkeleton } from "./PanelSkeleton";

/* Section 2 (HQA-D90 displaces HQA-D82 here): the hero of tanda D, demoted
   to the second screen. The headline and the subtitle are the operator's own
   words and are UNTOUCHED — the only thing that changed is that they stopped
   being the page's h1, so they are an h2 and a paragraph now. The kicker
   that sat above them died with the house's other eight in v5 T1 (D-5), and
   the underline moved onto the question itself, marks INSIDE the `<u>`
   (D-6): `<u>¿dónde?</u>` / `<u>where?</u>`. A test asserts the underlined
   word in each language, because t.rich drops unbalanced markup in silence.

   What this section lost when it came down: the four-node diagram, which
   went to /implementacion (gate E0-2), and the two CTAs, which merged into
   the single close (gate E0-6). The panel became a KPI board in E4 and now
   carries `data-panel="invert"`, so it wears the OTHER mode: ivory over
   Obsidian, ink over Alba (HQA-D91). The attribute goes on the AppWindow and
   nowhere higher — it re-points variables inside its own subtree and never
   touches `data-theme`, which is the only way to get the inversion without
   breaking the toggle.

   Below md the panel is not rendered (the D4 rule) and the diagram is gone,
   so on a phone this section is typography. That is question 10 of the plan
   §9 and it is a design question, not a copy one; typography is the answer
   until the operator says otherwise. */
const PanelKPI = dynamic(() => import("./PanelKPI").then((m) => m.PanelKPI), {
  ssr: false,
  loading: () => <PanelSkeleton />,
});

export function Aplicada() {
  const t = useTranslations("home.aplicada");

  return (
    <section id="aplicada" className="relative px-4 py-section sm:px-6">
      <Spotlight className="mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-16">
          <div>
            <h2 className="font-display max-w-4xl text-h1 font-extrabold text-text">
              {t("headline")}
            </h2>
            <p className="font-display mt-8 max-w-3xl text-h3 font-semibold text-text">
              {t.rich("subtitulo", {
                u: (chunks) => <u className="underline-thick">{chunks}</u>,
              })}
            </p>
          </div>

          <div
            className="animate-fade-rise hidden md:block"
            style={{ "--rise-delay": "0.35s" } as CSSProperties}
            role="img"
            aria-label={t("panel.alt")}
          >
            <AppWindow invert>
              <PanelKPI />
            </AppWindow>
          </div>
        </div>
      </Spotlight>
    </section>
  );
}
