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

   **v5 T5 finished that turn, and took the label off.** The board used to
   count TASKS (documents processed, quotes assembled, tasks in review,
   exceptions flagged) under a chip that said the data was a demonstration.
   Decision D-2, taken by the operator ON 2026-09-04 knowingly and against the
   planning session's recommendation, removes the chip AND the company name;
   decision D-3 replaces the four KPIs with business ones. So: the figures are
   still invented and there is no longer anything on the panel that says so.
   The ledger row for T5 carries that in full; this file does not relitigate
   it. The company slot is left EMPTY rather than filled with an invented
   trade name or with Osppy, which is the one part of output A that is more
   honest than the alternatives and costs nothing: a panel that names nobody
   is not claiming to be anybody's.

   Four rules this board still cannot break:

   1. **No benefit metric.** Nothing about time saved, hours freed, cost
      reduced or staff replaced. check-copy.mjs fails on those stems and the
      guide §5.8 forbids drawing an impact promise, so the KPIs describe
      MONEY, STATE and RATE rather than a benefit: period revenue, operating
      margin, collection cycle, capacity utilization. The deltas are movement
      against the previous period, not savings.
   2. **The chart is one week and never a projection.** It stays a BAR chart
      rather than a curve: a line extending across a chart invites the eye to
      continue it, and a continued line is a promise of benefit.
   3. **No day or month names on the axis.** Abbreviations are per-language
      and a literal here would put one market inside shared code. The card's
      note names the axis instead.
   4. **Every figure in messages/*.json enters scripts/copy-allow.json by
      key.** A new digit on this site is a failure until it is attested.
      **What changed under D-2 is the ATTESTATION'S REASON, not the rule:**
      that file used to justify these keys by saying the panel's own chip
      declared them a demonstration, and there is no chip now. The note was
      rewritten to point at D-2 instead. And the bar values below are
      constants in this file, which `check-copy.mjs` never reads — they were
      covered by the chip too, and now they are covered by nothing but D-2.

   **The board reads as one instrument, which is the difference between a mock
   that survives being looked at and one that does not.** The seven daily bars
   sum to 8,480 thousand MXN and `kpis.k1.valor` is 8.48 M MXN for the same
   period, on purpose: a director checks that first.

   The unit never lives inside `valor`. `Counter` is handed `Number(valor)`,
   so the key has to stay numerically pure; currency, `%` and days are their
   own keys and render beside the figure at a smaller size. The delta carries
   its own unit for the same reason the plan flagged it: over a margin and an
   occupancy rate, both already percentages, a bare `+2%` cannot be read as
   two points or as two percent of the margin. It is **points**, and it says
   so.

   The infrastructure of D4 is reused whole and not rebuilt: the dynamic
   boundary in <Aplicada/>, the same-shaped skeleton, AppWindow, and the rule
   that nothing renders below md. */

/** One week of daily revenue in thousands of MXN, weekend low. No trend and
    nothing to extrapolate; the labels are neutral because of rule 3. These
    seven add up to 8,480, which is the 8.48 M MXN of `kpis.k1.valor` — the
    board has to survive somebody adding it up. Invented, like every figure
    here, and since D-2 nothing on the panel says so: see rule 4. */
const VOLUMEN = [1180, 1620, 1440, 1710, 1560, 620, 350];
const DATA = VOLUMEN.map((v, i) => ({ dia: `d${i + 1}`, docs: v }));
const CHART_LOAD_MS = 1400;

/** The by-area split of the same week's activity, as shares. Plain bars, not
    a second chart component: four values do not need a chart engine, and the
    first-load budget is already 43 % over (HQA-D86). */
const AREAS = ["a1", "a2", "a3", "a4"] as const;
const AREA_SHARE = [100, 72, 54, 38];

const KPIS = ["k1", "k2", "k3", "k4"] as const;

/** The delta chip: up, flat or down. Colour carries no judgement — a shorter
    collection cycle and a higher margin are both just movement, and painting
    one green and the other red would be the panel claiming an outcome.

    The unit is a PROP and no longer a hard-coded `%`. Four KPIs in money, a
    rate, days and a rate cannot share one suffix, and the one that was here
    would have printed "+6%" over a figure in millions and "-5%" over a
    figure in days. */
function Delta({ value, unit }: { value: string; unit: string }) {
  const n = Number(value);
  const glyph = n > 0 ? "▲" : n < 0 ? "▼" : "▬";
  return (
    <span className="flex items-center gap-1 text-[11px] font-medium tabular-nums text-text-2">
      <span aria-hidden="true">{glyph}</span>
      {/* value and unit are ONE flex item: as two, the container's gap-1
          would inject a space the key never asked for, and "+6 %" is not
          what `deltaUnidad: "%"` says. All spacing comes from the key. */}
      <span>
        {value}
        {unit}
      </span>
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
      {/* The header names the board and nobody else. Both the company line
          and the demonstration chip died with D-2, and the slot is left empty
          on purpose rather than refilled. */}
      <div className="flex min-w-0 items-center gap-2.5 border-b border-line px-5 py-3.5">
        <Logomark className="h-7 w-7 bg-accent text-primary-foreground" />
        <p className="truncate text-sm font-semibold leading-tight">{t("titulo")}</p>
      </div>

      <div className="p-4 @2xl:p-5">
        {/* Four KPI tiles. The number is the largest thing in the panel,
            which is what "a mayor escala" asked for; its unit rides beside it
            at a smaller size so the figure keeps the weight and the reader
            still knows whether they are looking at pesos, points or days. */}
        <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-4">
          {KPIS.map((k) => (
            <div key={k} className="glass rounded-xl p-3.5">
              <p className="font-display text-2xl font-extrabold leading-none tracking-tight tabular-nums">
                <Counter value={Number(t(`kpis.${k}.valor`))} />
                <span className="text-[13px] font-semibold text-text-2">
                  {t(`kpis.${k}.unidad`)}
                </span>
              </p>
              <p className="mt-2 text-[11px] leading-tight text-text-2">
                {t(`kpis.${k}.label`)}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <Delta
                  value={t(`kpis.${k}.delta`)}
                  unit={t(`kpis.${k}.deltaUnidad`)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* The deltas need a basis or they mean nothing, and saying it four
            times inside four small tiles is noise. It is said once. */}
        <p className="mt-2.5 text-[11px] leading-tight text-text-2">
          {t("kpisNota")}
        </p>

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
