"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Hand, Undo2, Users, LogIn, LogOut, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logomark } from "@/components/ui/Logo";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { Grid } from "@/components/charts/grid";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { ChartTooltip } from "@/components/charts/tooltip";
import type { ChartStatus } from "@/components/charts/chart-phase";

interface Row {
  name: string;
  preview: string;
  status: "ai" | "you";
  initial: string;
}

/* The operations panel as the product shows it (source of truth §4.4):
   the shift queue, today's arrivals and departures, the conversations with
   take-over / resolve, and one Bklit chart (HQA-D34). Every number here is
   labeled demo data; the shift count follows the reader's own take-overs. */

// Two-hour buckets of a demo day — labeled demo data, not a measurement.
const HOURS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
const VOLUME = [3, 1, 2, 5, 9, 12, 14, 11, 13, 19, 15, 8];
const DATA = HOURS.map((h, i) => ({ hora: `${h}h`, conversaciones: VOLUME[i] }));
const CHART_LOAD_MS = 1400;

export function Panel({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("hoteles.circuito.panel");
  const rows = t.raw("rows") as Row[];

  const [taken, setTaken] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string | null>(rows[0]?.name ?? null);
  // The chart "loads" once on mount: Bklit's skeleton sweeps until then.
  const [status, setStatus] = useState<ChartStatus>("loading");
  useEffect(() => {
    const id = setTimeout(() => setStatus("ready"), CHART_LOAD_MS);
    return () => clearTimeout(id);
  }, []);

  const isYou = (row: Row) => (row.name in taken ? taken[row.name] : row.status === "you");
  const youCount = rows.filter(isYou).length;

  const tiles = [
    { icon: Users, label: t("turno"), value: youCount, sub: t("turnoSub"), live: true },
    { icon: LogIn, label: t("llegadas"), value: 3 },
    { icon: LogOut, label: t("salidas"), value: 2 },
    { icon: MessageCircle, label: t("abiertas"), value: rows.length },
  ];

  return (
    <div className="@container relative w-full overflow-hidden bg-surface text-text">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <Logomark className="h-7 w-7 bg-accent text-white" />
          <span className="truncate text-sm font-semibold">{t("titulo")}</span>
          <span className="hidden rounded-md bg-white/5 px-2 py-0.5 text-xs text-text-2 @lg:inline">{t("hotel")}</span>
        </div>
        <span className="flex-shrink-0 rounded-full border border-line px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-text-2">
          {t("etiqueta")}
        </span>
      </div>

      <div className="p-4 @2xl:p-5">
        {/* Tiles */}
        <div className="grid grid-cols-2 gap-3 @2xl:grid-cols-4">
          {tiles.map(({ icon: Icon, label, value, sub, live }) => (
            <div key={label} className="rounded-xl glass p-4">
              <div className="mb-3 flex items-center justify-between">
                <Icon className="h-4 w-4 text-text-2" aria-hidden="true" />
                {live && <span className="h-2 w-2 animate-pulse rounded-full bg-accent-text" aria-hidden="true" />}
              </div>
              <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
              <p className="mt-1 text-[11px] leading-tight text-text-2">
                {label}
                {sub && <span className="block text-text-2/70">{sub}</span>}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 @2xl:grid-cols-5">
          {/* Conversations */}
          <div className="rounded-xl glass p-4 @2xl:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium">{t("conversaciones")}</p>
              <span className="text-xs text-text-2">{youCount > 0 ? `${youCount} · ${t("statusYou")}` : rows.length}</span>
            </div>
            <div className={cn("flex flex-col gap-1", !compact && "max-h-[268px] overflow-y-auto pr-1")}>
              {rows.map((row) => {
                const you = isYou(row);
                const active = selected === row.name;
                return (
                  <div
                    key={row.name}
                    onClick={() => setSelected(row.name)}
                    className={cn(
                      "group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors",
                      active ? "bg-white/[0.06]" : "hover:bg-white/[0.03]",
                    )}
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-semibold text-text-2">
                      {row.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{row.name}</p>
                      <p className="truncate text-[11px] text-text-2">{row.preview}</p>
                    </div>
                    <span
                      className={cn(
                        "hidden flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium @lg:inline",
                        you ? "bg-warm/15 text-warm" : "bg-accent-text/15 text-accent-text",
                      )}
                    >
                      {you ? t("statusYou") : t("statusAI")}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTaken((prev) => ({ ...prev, [row.name]: !you }));
                      }}
                      className={cn(
                        "flex flex-shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors",
                        you
                          ? "border-white/15 text-text-2 hover:bg-white/5"
                          : "border-accent-text/40 text-accent-text hover:bg-accent hover:text-primary-foreground",
                      )}
                    >
                      {you ? <Undo2 className="h-3 w-3" aria-hidden="true" /> : <Hand className="h-3 w-3" aria-hidden="true" />}
                      {you ? t("resolver") : t("tomar")}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart — Bklit, with its skeleton while "loading" */}
          <div className="flex flex-col rounded-xl glass p-4 @2xl:col-span-2">
            <p className="text-sm font-medium">{t("chartTitle")}</p>
            <p className="mt-0.5 text-[11px] text-text-2">{t("chartNota")}</p>
            <div className="mt-3">
              <BarChart
                data={DATA}
                xDataKey="hora"
                aspectRatio="1.7 / 1"
                status={status}
                margin={{ top: 12, right: 6, bottom: 30, left: 6 }}
                barGap={0.3}
              >
                <Grid horizontal numTicksRows={4} />
                <Bar dataKey="conversaciones" fill="var(--accent-text)" />
                <BarXAxis maxLabels={6} />
                <ChartTooltip
                  rows={(p) => [{ color: "var(--accent-text)", label: t("conversaciones"), value: p.conversaciones as number }]}
                />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
