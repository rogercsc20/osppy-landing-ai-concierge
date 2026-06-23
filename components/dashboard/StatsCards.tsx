import { useTranslations } from "next-intl";
import {
  STAT_WINDOWS,
  formatRate,
  formatResponseTime,
  type StatsResult,
  type StatWindowKey,
} from "@/lib/dashboard/stats";

/**
 * Presentational stats cards (server-rendered). One card per metric; each card
 * shows the metric across the three property-local windows (Hoy / 7 días / 30
 * días) so an owner gets the whole picture at a glance. Numbers are the signal;
 * the window labels carry their own text (no colour-only meaning) → a11y by
 * construction.
 */
export function StatsCards({ stats }: { stats: StatsResult }) {
  const t = useTranslations("dashboardApp.stats");
  const windowLabel: Record<StatWindowKey, string> = {
    today: t("windows.today"),
    week: t("windows.week"),
    month: t("windows.month"),
  };

  const cards: Array<{ key: string; label: string; value: (w: StatWindowKey) => string; sub?: (w: StatWindowKey) => string | null }> = [
    {
      key: "conversations",
      label: t("cards.conversations"),
      value: (w) => String(stats.windows[w].conversations),
    },
    {
      key: "messages",
      label: t("cards.messages"),
      value: (w) => String(stats.windows[w].messages),
    },
    {
      key: "escalations",
      label: t("cards.escalations"),
      value: (w) => String(stats.windows[w].escalations.total),
      sub: (w) =>
        t("escalationBreakdown", {
          open: stats.windows[w].escalations.open,
          resolved: stats.windows[w].escalations.resolved,
        }),
    },
    {
      key: "autonomy",
      label: t("cards.autonomy"),
      value: (w) => formatRate(stats.windows[w].autonomy.rate),
      sub: (w) =>
        t("autonomyBreakdown", {
          ai: stats.windows[w].autonomy.aiHandled,
          staff: stats.windows[w].autonomy.staffHandled,
        }),
    },
    {
      key: "responseTime",
      label: t("cards.responseTime"),
      value: (w) => formatResponseTime(stats.windows[w].responseTime.avgMs),
      sub: (w) =>
        stats.windows[w].responseTime.sampleSize > 0
          ? t("responseTimeSub", {
              p50: formatResponseTime(stats.windows[w].responseTime.p50Ms),
              n: stats.windows[w].responseTime.sampleSize,
            })
          : null,
    },
  ];

  return (
    <div className="space-y-4">
      {stats.capped && (
        <p role="status" className="border-line text-ink/60 rounded-lg border border-dashed px-3 py-2 text-xs">
          {t("capped")}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <section
            key={card.key}
            aria-label={card.label}
            className="border-line bg-ink-panel rounded-2xl border p-5"
          >
            <h2 className="text-ink/70 text-sm font-medium">{card.label}</h2>
            <dl className="mt-3 grid grid-cols-3 gap-2">
              {STAT_WINDOWS.map((w) => (
                <div key={w}>
                  <dt className="text-ink/40 text-xs">{windowLabel[w]}</dt>
                  <dd className="font-display text-ink mt-0.5 text-xl">{card.value(w)}</dd>
                  {card.sub && card.sub(w) && (
                    <dd className="text-ink/50 mt-0.5 text-[11px] leading-tight">{card.sub(w)}</dd>
                  )}
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
