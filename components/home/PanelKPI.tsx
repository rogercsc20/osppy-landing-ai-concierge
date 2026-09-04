"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { Logomark } from "@/components/ui/Logo";
import { Counter } from "@/components/fx/Counter";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";
import type { ChartStatus } from "@/components/charts/chart-phase";
import { cn } from "@/lib/utils";

/* Section 2's object (HQA-D91, superseding HQA-D82 in content and keeping it
   in principle). The operator rejected the work queue outright — "el panel de
   operación del lado derecho no me gusta para nada" — and asked for a
   professional dashboard: real-time KPIs, metrics, the kind of charts a
   director or an analyst would want, with the numbers at a larger scale.

   **What did NOT change is the honesty.** It is still a labelled demo, still
   descriptive, and still invented for the demo with the chip saying so
   (source of truth §9/§10).

   Four rules this board cannot break, and each one is a real constraint and
   not a style note:

   1. **No benefit metric.** Nothing about time saved, hours freed, cost
      reduced or staff replaced. check-copy.mjs fails on those stems and the
      guide §5.8 forbids drawing an impact promise, so the KPIs are
      descriptive of VOLUME and STATE: documents processed, quotes assembled,
      tasks in review, exceptions flagged. The deltas are period-over-period
      counts, not savings.
   2. **The chart is a demonstration week and never a projection.** It stays
      a BAR chart rather than the curve the plan sketched, and that is the
      safer reading of the same rule: a line extending across a chart invites
      the eye to continue it, and a continued line is a promise of benefit.
   3. **No day or month names on the axis.** Abbreviations are per-language
      and a literal here would put one market inside shared code. The card's
      note names the axis instead.
   4. **Every demo figure enters scripts/copy-allow.json by key**, which is
      exactly what that file was built for: a new digit on this site is a
      failure until it is attested, and a demo figure is attested as a demo.

   The infrastructure of D4 is reused whole and not rebuilt: the dynamic
   boundary in <Aplicada/>, the same-shaped skeleton, AppWindow, the rule
   that nothing renders below md, and the pinned chip. */

/** One demonstration week of processed volume, weekend low. No trend, and
    nothing to extrapolate; the labels are neutral because of rule 3. */
const VOLUMEN = [1180, 1620, 1440, 1710, 1560, 620, 350];
const DATA = VOLUMEN.map((v, i) => ({ dia: `d${i + 1}`, docs: v }));
const CHART_LOAD_MS = 1400;

/** The by-area split, as shares of the same demonstration week. Plain bars,
    not a second chart component: four values do not need a chart engine, and
    the first-load budget is already 43 % over (HQA-D86). */
const AREAS = ["a1", "a2", "a3", "a4"] as const;
const AREA_SHARE = [100, 72, 54, 38];

const KPIS = ["k1", "k2", "k3", "k4"] as const;

/** The delta chip: up, flat or down. Colour carries no judgement — a fall in
    flagged exceptions and a rise in processed documents are both just
    movement, and painting one green and the other red would be the panel
    claiming an outcome. */
function Delta({ value }: { value: string }) {
  const n = Number(value);
  const glyph = n > 0 ? "▲" : n < 0 ? "▼" : "▬";
  return (
    <span className="flex items-center gap-1 text-[11px] font-medium tabular-nums text-text-2">
      <span aria-hidden="true">{glyph}</span>
      {value}%
    </span>
  );
}

export function PanelKPI() {
  const t = useTranslations("home.aplicada.panel");
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<ChartStatus>("loading");

  // The chart "loads" once on mount and the Bklit skeleton sweeps until then.
  // Under reduced motion it is simply ready — a fake loading state is motion,
  // not information — derived at render so the effect never setStates
  // synchronously.
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => setStatus("ready"), CHART_LOAD_MS);
    return () => clearTimeout(id);
  }, [reduce]);
  const chartStatus: ChartStatus = reduce ? "ready" : status;

  return (
    <div className="@container relative w-full bg-surface text-text">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Logomark className="h-7 w-7 bg-accent text-primary-foreground" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">{t("titulo")}</p>
            <p className="truncate text-[11px] leading-tight text-text-2">{t("empresa")}</p>
          </div>
        </div>
        <span
          data-testid="panel-demo-chip"
          className="flex-shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-text-2"
        >
          {t("etiqueta")}
        </span>
      </div>

      <div className="p-4 @2xl:p-5">
        {/* Four KPI tiles. The number is the largest thing in the panel,
            which is what "a mayor escala" asked for. */}
        <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-4">
          {KPIS.map((k) => (
            <div key={k} className="glass rounded-xl p-3.5">
              <p className="font-display text-2xl font-extrabold leading-none tracking-tight tabular-nums">
                <Counter value={Number(t(`kpis.${k}.valor`))} />
              </p>
              <p className="mt-2 text-[11px] leading-tight text-text-2">
                {t(`kpis.${k}.label`)}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <Delta value={t(`kpis.${k}.delta`)} />
              </div>
            </div>
          ))}
        </div>

        {/* Volume for one demonstration week */}
        <div className="glass mt-3 rounded-xl p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium">{t("volumenTitulo")}</p>
            <p className="flex-shrink-0 text-[11px] text-text-2">{t("volumenNota")}</p>
          </div>
          <div className="mt-3">
            <BarChart
              data={DATA}
              xDataKey="dia"
              aspectRatio="4.6 / 1"
              status={chartStatus}
              margin={{ top: 10, right: 6, bottom: 8, left: 6 }}
              barGap={0.35}
            >
              <Grid horizontal numTicksRows={3} />
              <Bar dataKey="docs" fill="var(--accent-text)" />
              <ChartTooltip
                rows={(p) => [
                  {
                    color: "var(--accent-text)",
                    label: t("volumenSerie"),
                    value: p.docs as number,
                  },
                ]}
              />
            </BarChart>
          </div>
        </div>

        {/* By area */}
        <div className="glass mt-3 rounded-xl p-4">
          <p className="text-sm font-medium">{t("areasTitulo")}</p>
          <ul className="mt-3 flex flex-col gap-2">
            {AREAS.map((a, i) => (
              <li key={a} className="flex items-center gap-3">
                <span className="w-24 flex-shrink-0 truncate text-[11px] text-text-2">
                  {t(`areas.${a}`)}
                </span>
                <span
                  aria-hidden="true"
                  className="h-2 flex-1 overflow-hidden rounded-full bg-line"
                >
                  <span
                    className={cn(
                      "block h-full rounded-full bg-accent-text",
                      !reduce && "transition-[width] duration-700",
                    )}
                    style={{ width: `${AREA_SHARE[i]}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-line pt-2.5 text-[11px] text-text-2">
            {t("pie")}
          </p>
        </div>
      </div>
    </div>
  );
}
