"use client";

import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Spotlight } from "@/components/fx/Spotlight";
import { AppWindow } from "@/components/device/AppWindow";
import { PanelSkeleton } from "./PanelSkeleton";

/* Section 2 (HQA-D90 displaces HQA-D82 here): the hero of tanda D, demoted
   to the second screen. The kicker, the headline and the subtitle are the
   operator's own words and the last two are UNTOUCHED — the only thing that
   changed is that they stopped being the page's h1, so they are an h2 and a
   paragraph now. The `<u>` on one word survives the move and a test asserts
   it in each language, because t.rich drops unbalanced markup in silence.

   What this section lost when it came down: the four-node diagram, which
   went to /implementacion (gate E0-2), and the two CTAs, which merged into
   the single close (gate E0-6). The panel STAYS as it is: E4 turns it into
   a KPI board and inverts it (HQA-D91), and doing that here would have
   bundled two gates into one commit.

   Below md the panel is not rendered (the D4 rule) and the diagram is gone,
   so on a phone this section is typography. That is question 10 of the plan
   §9 and it is a design question, not a copy one; typography is the answer
   until the operator says otherwise. */
const PanelEmpresa = dynamic(
  () => import("./PanelEmpresa").then((m) => m.PanelEmpresa),
  { ssr: false, loading: () => <PanelSkeleton /> },
);

export function Aplicada() {
  const t = useTranslations("home.aplicada");

  return (
    <section id="aplicada" className="relative px-4 py-section sm:px-6">
      <Spotlight className="mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-16">
          <div>
            <p
              className="eyebrow animate-fade-rise"
              style={{ "--rise-delay": "0s" } as CSSProperties}
            >
              {t("kicker")}
            </p>
            <h2 className="font-display mt-6 max-w-4xl text-h1 font-extrabold text-text">
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
            <AppWindow>
              <PanelEmpresa />
            </AppWindow>
          </div>
        </div>
      </Spotlight>
    </section>
  );
}
