"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Timer,
  ArrowUpRight,
  ArrowDownRight,
  Hand,
  Undo2,
  Maximize2,
  X,
  Clock,
  TrendingUp,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Row {
  name: string;
  preview: string;
  status: "ai" | "you";
  time: string;
  initial: string;
}

type T = ReturnType<typeof useTranslations>;

// Conversations-per-hour, static demo data (0–23h sampled).
const BARS = [3, 2, 1, 1, 2, 4, 6, 9, 12, 14, 11, 13, 16, 12, 10, 13, 17, 19, 22, 18, 14, 9, 6, 4];
const TOPICS = [
  { key: "pricing", pct: 38 },
  { key: "availability", pct: 24 },
  { key: "checkin", pct: 18 },
  { key: "pets", pct: 12 },
  { key: "other", pct: 8 },
];

export function DashboardMockup({ className }: { className?: string }) {
  const t = useTranslations();
  const rows = t.raw("dashboard.rows") as Row[];
  const maxBar = Math.max(...BARS);

  const [taken, setTaken] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string | null>(rows[0]?.name ?? null);
  const [insightsOpen, setInsightsOpen] = useState(false);

  const isYou = (row: Row) => (row.name in taken ? taken[row.name] : row.status === "you");
  const youCount = rows.filter(isYou).length;

  const kpis = [
    { icon: MessageCircle, label: t("dashboard.kpi.open"), value: "7", delta: null, live: true },
    { icon: CheckCircle2, label: t("dashboard.kpi.closed"), value: "32", delta: { up: true, v: "+18%" } },
    { icon: AlertTriangle, label: t("dashboard.kpi.complaints"), value: "1", delta: { up: false, v: "−2" } },
    { icon: Timer, label: t("dashboard.kpi.response"), value: "2.4s", delta: { up: true, v: "−0.6s" } },
  ];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-panel text-white shadow-2xl shadow-black/40",
        className
      )}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-turquoise text-sm font-bold text-white">
            O
          </div>
          <span className="text-sm font-semibold">{t("dashboard.title")}</span>
          <span className="hidden sm:inline rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/50">
            {t("dashboard.hotel")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-turquoise/15 px-2.5 py-1 text-[11px] font-medium text-turquoise">
            <span className="h-1.5 w-1.5 rounded-full bg-turquoise animate-pulse" />
            {t("dashboard.live")}
          </span>
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-coral to-turquoise" />
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {/* KPI tiles */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map(({ icon: Icon, label, value, delta, live }) => (
            <div key={label} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <Icon className="h-4 w-4 text-white/45" />
                {live && <span className="h-2 w-2 rounded-full bg-turquoise animate-pulse" />}
                {delta && (
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-[11px] font-medium",
                      delta.up ? "text-turquoise" : "text-coral"
                    )}
                  >
                    {delta.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {delta.v}
                  </span>
                )}
              </div>
              <p className="text-2xl font-semibold tracking-tight">{value}</p>
              <p className="mt-1 text-[11px] leading-tight text-white/45">{label}</p>
            </div>
          ))}
        </div>

        {/* Main: conversations + chart */}
        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          {/* Conversations list — scrollable, all 7 */}
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 lg:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium">{t("dashboard.conversations")}</p>
              <span className="text-xs text-white/40">
                {youCount > 0 ? `${youCount} · ${t("dashboard.statusYou")}` : rows.length}
              </span>
            </div>
            <div className="flex max-h-[244px] flex-col gap-1 overflow-y-auto pr-1">
              {rows.map((row) => {
                const you = isYou(row);
                const active = selected === row.name;
                return (
                  <div
                    key={row.name}
                    onClick={() => setSelected(row.name)}
                    className={cn(
                      "group flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors",
                      active ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    )}
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-semibold text-white/70">
                      {row.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{row.name}</p>
                      <p className="truncate text-[11px] text-white/45">{row.preview}</p>
                    </div>
                    <span
                      className={cn(
                        "hidden flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium sm:inline",
                        you ? "bg-coral/15 text-coral" : "bg-turquoise/15 text-turquoise"
                      )}
                    >
                      {you ? t("dashboard.statusYou") : t("dashboard.statusAI")}
                    </span>
                    <span className="hidden flex-shrink-0 text-[10px] text-white/30 md:inline">{row.time}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTaken((prev) => ({ ...prev, [row.name]: !you }));
                      }}
                      className={cn(
                        "flex flex-shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors",
                        you
                          ? "border-white/15 text-white/60 hover:bg-white/5"
                          : "border-turquoise/40 text-turquoise hover:bg-turquoise hover:text-white"
                      )}
                    >
                      {you ? <Undo2 className="h-3 w-3" /> : <Hand className="h-3 w-3" />}
                      {you ? t("dashboard.return") : t("dashboard.takeOver")}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart panel — clickable, opens insights */}
          <button
            onClick={() => setInsightsOpen(true)}
            className="group flex flex-col rounded-xl border border-white/5 bg-white/[0.03] p-4 text-left transition-colors hover:border-turquoise/40 lg:col-span-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{t("dashboard.chartTitle")}</p>
              <Maximize2 className="h-3.5 w-3.5 text-white/30 transition-colors group-hover:text-turquoise" />
            </div>
            <div className="mt-4 flex h-28 items-end gap-[3px]">
              {BARS.map((b, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-turquoise/30 to-turquoise"
                  style={{ height: `${(b / maxBar) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-3">
              <div>
                <p className="text-2xl font-semibold tracking-tight text-turquoise">94%</p>
                <p className="text-[11px] text-white/45">{t("dashboard.resolved")}</p>
              </div>
              <span className="text-[10px] text-white/30 transition-colors group-hover:text-turquoise">
                {t("dashboard.insights.hint")}
              </span>
            </div>
          </button>
        </div>
      </div>

      <InsightsOverlay t={t} open={insightsOpen} onClose={() => setInsightsOpen(false)} />
    </div>
  );
}

function InsightsOverlay({ t, open, onClose }: { t: T; open: boolean; onClose: () => void }) {
  const maxBar = Math.max(...BARS);

  const metrics = [
    { icon: Clock, label: t("dashboard.insights.peakHour"), value: "18:00" },
    { icon: Timer, label: t("dashboard.insights.firstResponse"), value: "2.4s" },
    { icon: TrendingUp, label: t("dashboard.insights.resolution"), value: "94%" },
    { icon: CalendarCheck, label: t("dashboard.insights.bookings"), value: "32" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute inset-0 z-50 flex flex-col bg-ink-panel"
        >
          {/* header */}
          <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-5 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-turquoise text-sm font-bold text-white">
                O
              </div>
              <span className="text-sm font-semibold">{t("dashboard.insights.title")}</span>
              <span className="hidden rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/50 sm:inline">
                {t("dashboard.hotel")}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label={t("auth.close")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* content */}
          <div className="grid flex-1 gap-5 overflow-y-auto p-5 lg:grid-cols-5">
            {/* big chart + metrics */}
            <div className="lg:col-span-3">
              <p className="mb-4 text-sm font-medium text-white/70">{t("dashboard.chartTitle")}</p>
              <div className="flex h-40 items-end gap-1">
                {BARS.map((b, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-t-sm bg-gradient-to-t from-turquoise/20 to-turquoise",
                      i === 18 && "from-coral/30 to-coral"
                    )}
                    style={{ height: `${(b / maxBar) * 100}%` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-white/30">
                <span>00h</span>
                <span>06h</span>
                <span>12h</span>
                <span>18h</span>
                <span>23h</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {metrics.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <Icon className="mb-2 h-4 w-4 text-turquoise" />
                    <p className="text-lg font-semibold leading-none">{value}</p>
                    <p className="mt-1 text-[10px] leading-tight text-white/45">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* topics */}
            <div className="lg:col-span-2">
              <p className="mb-4 text-sm font-medium text-white/70">{t("dashboard.insights.topics")}</p>
              <div className="flex flex-col gap-3">
                {TOPICS.map((topic) => (
                  <div key={topic.key}>
                    <div className="mb-1 flex items-center justify-between text-[12px]">
                      <span className="text-white/80">{t(`dashboard.insights.topicNames.${topic.key}`)}</span>
                      <span className="text-white/50">{topic.pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-turquoise to-turquoise/60"
                        style={{ width: `${topic.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
