"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ClipboardList, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { Logomark } from "@/components/ui/Logo";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";
import type { ChartStatus } from "@/components/charts/chart-phase";

/* The hero's operation panel (tanda D, D4; HQA-D82) — the COMPANY panel, not
   the hotel one. The hotel panel is a reception queue (arrivals, take the
   conversation); cloning it here would lie about what the house sells. This
   one tells the house's own story: a work queue where each line advances
   through the four stages of the method, with the PROCESS stage marked in
   copper — the accent the hero's diagram carried, and the step the whole
   argument turns on.

   Its grammar is borrowed from components/hoteles/Panel.tsx (top bar with
   Logomark, live tiles, one Bklit chart that fake-loads 1400 ms behind the
   skeleton sweep); its content is not. Two tiles, not four, so it does not
   read as the hotel panel with other labels.

   The content is the RECYCLED demo of the deleted «Cómo se ve» section
   (gate D0-5: «ya estaba aprobado y es verdad. Lo feo era la sección, no el
   contenido»): the quote that assembles itself is the first row of the
   queue, and it is the row that stays PARKED in Revisión on purpose. That
   parked row is the honesty of the object — the house claims the AI
   proposes and the person decides, and a panel where everything advances by
   itself says the opposite in image while the copy says the right thing in
   text. A real SaaS would never show that row; this one does, with the
   demo's own closing line under the queue.

   The chart is DESCRIPTIVE — a demonstration week, and never a projection:
   a curve extending forward is a promise of benefit, which is exactly what
   the guide §5.8 and the bank's «ahorra hasta» rows exist to prevent.

   Every figure in here is invented for the demo and the chip says so
   (source of truth §9/§10) — same discipline as the hotel panel. */

const STAGES = ["recibido", "proceso", "agente", "revision"] as const;
type Stage = (typeof STAGES)[number];

/* One demonstration week of completed tasks, weekend low — a descriptive
   shape with no trend and nothing to extrapolate. The bars carry no weekday
   labels on purpose: abbreviations are per-language («L M M J V S D» vs
   «M T W T F S S») and a literal here would hard-code one market into
   shared code (CG-6 discipline); the card's note names the axis instead. */
const DONE = [12, 17, 9, 14, 16, 6, 4];
const DATA = DONE.map((v, i) => ({ dia: `d${i + 1}`, tareas: v }));
const CHART_LOAD_MS = 1400;

/* Where each queue row starts, and which one never moves. Row 0 is the
   recycled quote, parked in Revisión. The others start spread across the
   three working stages so the queue reads busy from the first frame. */
const PARKED_ROW = 0;
const INITIAL: Stage[] = ["revision", "proceso", "recibido", "agente", "proceso"];
const TICK_MS = 2600;

function StageDots({ stage, labels }: { stage: Stage; labels: Record<Stage, string> }) {
  const idx = STAGES.indexOf(stage);
  return (
    <div className="flex items-center gap-1" aria-label={labels[stage]}>
      {STAGES.map((s, i) => (
        <span
          key={s}
          className={cn(
            "h-1.5 rounded-full transition-all duration-500",
            i < idx && "w-1.5 bg-line",
            i === idx && (s === "proceso" ? "w-5 bg-warm" : "w-5 bg-accent-text"),
            i > idx && "w-1.5 bg-line/60",
          )}
        />
      ))}
    </div>
  );
}

export function PanelEmpresa() {
  const t = useTranslations("home.hero.panel");
  const reduce = useReducedMotion();
  const rows = t.raw("rows") as { area: string; tarea: string }[];
  const stageLabel: Record<Stage, string> = {
    recibido: t("etapas.recibido"),
    proceso: t("etapas.proceso"),
    agente: t("etapas.agente"),
    revision: t("etapas.revision"),
  };

  const [stages, setStages] = useState<Stage[]>(INITIAL);
  const [status, setStatus] = useState<ChartStatus>("loading");

  // The chart "loads" once on mount: Bklit's skeleton sweeps until then.
  // Under reduced motion it is simply ready — a fake loading state is
  // motion, not information — DERIVED at render rather than set from the
  // effect, so the effect never calls setState synchronously.
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => setStatus("ready"), CHART_LOAD_MS);
    return () => clearTimeout(id);
  }, [reduce]);
  const chartStatus: ChartStatus = reduce ? "ready" : status;

  // The queue advances: every tick, one moving row steps forward; a row that
  // finishes Agente re-enters as Recibido (the same kind of work arriving
  // again). The parked row never moves — that is the point of it. Under
  // reduced motion the queue stands still in its initial, truthful spread.
  useEffect(() => {
    if (reduce) return;
    let turn = 0;
    const id = setInterval(() => {
      // round-robin over the moving rows so the motion is spread, not a wave
      turn = (turn + 1) % INITIAL.length;
      const row = turn === PARKED_ROW ? (turn + 1) % INITIAL.length : turn;
      setStages((prev) =>
        prev.map((s, i) => {
          if (i !== row) return s;
          if (s === "agente") return "recibido";
          if (s === "revision") return s; // never advances out of review by itself
          return STAGES[STAGES.indexOf(s) + 1];
        }),
      );
    }, TICK_MS);
    return () => clearInterval(id);
  }, [reduce]);

  const inMotion = stages.filter((s) => s !== "revision").length;
  const awaiting = stages.length - inMotion;

  const tiles = [
    { icon: ClipboardList, label: t("enCurso"), value: inMotion, sub: t("enCursoSub"), live: true },
    { icon: UserCheck, label: t("revision"), value: awaiting, sub: t("revisionSub") },
  ];

  return (
    <div className="@container relative w-full bg-surface text-text">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Logomark className="h-7 w-7 bg-accent text-primary-foreground" />
          <span className="truncate text-sm font-semibold">{t("titulo")}</span>
        </div>
        <span
          data-testid="panel-demo-chip"
          className="flex-shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-text-2"
        >
          {t("etiqueta")}
        </span>
      </div>

      <div className="p-4 @2xl:p-5">
        {/* Two tiles — deliberately not the hotel's four */}
        <div className="grid grid-cols-2 gap-3">
          {tiles.map(({ icon: Icon, label, value, sub, live }) => (
            <div key={label} className="glass rounded-xl p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <Icon className="h-4 w-4 text-text-2" aria-hidden="true" />
                {live && !reduce && (
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent-text" aria-hidden="true" />
                )}
              </div>
              <p className="text-xl font-semibold tracking-tight tabular-nums">{value}</p>
              <p className="mt-1 text-[11px] leading-tight text-text-2">
                {label}
                {sub && <span className="block text-text-2/70">{sub}</span>}
              </p>
            </div>
          ))}
        </div>

        {/* The queue */}
        <div className="glass mt-3 rounded-xl p-4">
          <p className="mb-3 text-sm font-medium">{t("cola")}</p>
          <div className="flex flex-col gap-1">
            {rows.map((row, i) => (
              <div key={row.tarea} className="flex items-center gap-3 rounded-lg px-2 py-1">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{row.tarea}</p>
                  <p className="truncate text-[11px] text-text-2">{row.area}</p>
                </div>
                <span
                  className={cn(
                    "hidden flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium @lg:inline",
                    stages[i] === "proceso"
                      ? "bg-warm/15 text-warm-text"
                      : stages[i] === "revision"
                        ? "border border-line text-text-2"
                        : "bg-accent-text/15 text-accent-text",
                  )}
                >
                  {stageLabel[stages[i]]}
                </span>
                <StageDots stage={stages[i]} labels={stageLabel} />
              </div>
            ))}
          </div>
          {/* The recycled demo's closing line, under the row that proves it */}
          <p className="mt-2.5 border-t border-line pt-2.5 text-[11px] text-text-2">{t("pie")}</p>
        </div>

        {/* Chart — descriptive week, never a projection */}
        <div className="glass mt-3 rounded-xl p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-medium">{t("chartTitle")}</p>
            <p className="text-[11px] text-text-2">{t("chartNota")}</p>
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
              <Bar dataKey="tareas" fill="var(--accent-text)" />
              <ChartTooltip
                rows={(p) => [
                  { color: "var(--accent-text)", label: t("chartSerie"), value: p.tareas as number },
                ]}
              />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
}
