import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { todayInTimeZone } from "./board";
import { zonedDayRangeToUtc, zonedStartOfDayUtc, type UtcRange } from "./conversations";

/**
 * Stats read-model for the dashboard B5 slice (READ-ONLY).
 *
 * Every read goes through PostgREST under RLS (the mig-080 `has_dashboard_access`
 * SELECT policies on conversations / messages / tasks). No writes → no role gate
 * (a viewer can read the numbers). The Supabase client is injected so this module
 * imports only `zod` + the tz helpers and stays unit-testable outside a browser.
 *
 * Three property-local windows (master plan §B5): today / last 7 days / last 30
 * days. The widest (30d) is read ONCE and partitioned into the three windows in
 * pure code — one set of reads, all the aggregation unit-testable. "Today" is the
 * property's civil today (D-A11), not UTC, so the day boundary doesn't slip at
 * the Mexico offset; the refresh is **polling** (a client interval that
 * router.refresh()es), not Realtime, per the master plan.
 */

// ── Windows (property-local civil dates → UTC instants) ──────────────

export const STAT_WINDOWS = ["today", "week", "month"] as const;
export type StatWindowKey = (typeof STAT_WINDOWS)[number];

// How many days back each rolling window reaches (inclusive of today).
const WINDOW_SPAN_DAYS: Record<StatWindowKey, number> = {
  today: 1,
  week: 7,
  month: 30,
};

/** The civil date `n` days before `civilDate` (YYYY-MM-DD). Pure. */
function civilDateMinusDays(civilDate: string, days: number): string {
  return new Date(Date.parse(`${civilDate}T00:00:00Z`) - days * 86_400_000)
    .toISOString()
    .slice(0, 10);
}

/**
 * The three rolling windows as half-open UTC ranges `[gte, lt)`, all ending at
 * the start of the property-local day AFTER `today` (so today is inclusive).
 * `month` is the widest → its `gte` is the lower bound for the single read.
 */
export function buildStatWindows(
  timeZone: string,
  today: string,
): Record<StatWindowKey, UtcRange> {
  const out = {} as Record<StatWindowKey, UtcRange>;
  for (const key of STAT_WINDOWS) {
    const from = civilDateMinusDays(today, WINDOW_SPAN_DAYS[key] - 1);
    out[key] = zonedDayRangeToUtc(timeZone, from, today);
  }
  return out;
}

/** The single read range that covers all windows (== the month window). */
export function widestRange(windows: Record<StatWindowKey, UtcRange>): UtcRange {
  return windows.month;
}

/** True when `iso` falls in `[gte, lt)`. Open bounds are treated as unbounded. */
export function inRange(iso: string | null | undefined, range: UtcRange): boolean {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  if (range.gte && t < Date.parse(range.gte)) return false;
  if (range.lt && t >= Date.parse(range.lt)) return false;
  return true;
}

// ── Read boundaries (zod) + projection contracts (RC-1) ──────────────

// Only the columns the aggregation touches — kept minimal so the 30d read is
// cheap. Every field here MUST appear in the matching SELECT string below.
export const statsConversationRowSchema = z.object({
  created_at: z.string(),
  ai_handled: z.boolean(),
  staff_takeover_at: z.string().nullable().optional(),
});
export type StatsConversationRow = z.infer<typeof statsConversationRowSchema>;
export const STATS_CONVERSATION_SELECT = "created_at, ai_handled, staff_takeover_at";

export const statsMessageRowSchema = z.object({
  sent_at: z.string(),
  sender_type: z.string(),
  ai_response_time_ms: z.number().nullable().optional(),
});
export type StatsMessageRow = z.infer<typeof statsMessageRowSchema>;
export const STATS_MESSAGE_SELECT = "sent_at, sender_type, ai_response_time_ms";

export const statsTaskRowSchema = z.object({
  created_at: z.string(),
  status: z.string(),
});
export type StatsTaskRow = z.infer<typeof statsTaskRowSchema>;
export const STATS_TASK_SELECT = "created_at, status";

// An escalation task is "open" while pending/in_progress; anything else is
// resolved (mig 001 tasks.status CHECK: pending|in_progress|completed|cancelled).
const OPEN_TASK_STATUSES = new Set(["pending", "in_progress"]);

// Per-dataset row cap. A boutique hotel's 30 days is far below this; if a read
// hits it the aggregation is over a partial set, so we surface a `capped` flag
// rather than silently undercount.
export const STATS_ROW_CAP = 5000;

// ── Aggregation (pure) ───────────────────────────────────────────────

export type WindowStats = {
  conversations: number;
  messages: number;
  autonomy: { aiHandled: number; staffHandled: number; rate: number | null };
  escalations: { open: number; resolved: number; total: number };
  responseTime: { avgMs: number | null; p50Ms: number | null; sampleSize: number };
};

export type StatsResult = {
  windows: Record<StatWindowKey, WindowStats>;
  capped: boolean;
};

/** Mean of a non-empty list (ms), rounded; null when empty. Pure. */
function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/** Median (p50) of a list (ms); null when empty. Pure. */
function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

/** Metrics for one window over the already-loaded rows. Pure. */
export function aggregateWindow(
  convRows: StatsConversationRow[],
  msgRows: StatsMessageRow[],
  taskRows: StatsTaskRow[],
  range: UtcRange,
): WindowStats {
  const convs = convRows.filter((r) => inRange(r.created_at, range));
  const aiHandled = convs.filter(
    (c) => c.ai_handled && !c.staff_takeover_at,
  ).length;
  const staffHandled = convs.length - aiHandled;

  const msgs = msgRows.filter((r) => inRange(r.sent_at, range));
  const responseSamples = msgs
    .filter((m) => m.sender_type === "ai" && m.ai_response_time_ms != null)
    .map((m) => m.ai_response_time_ms as number);

  const tasks = taskRows.filter((r) => inRange(r.created_at, range));
  const open = tasks.filter((t) => OPEN_TASK_STATUSES.has(t.status)).length;

  return {
    conversations: convs.length,
    messages: msgs.length,
    autonomy: {
      aiHandled,
      staffHandled,
      rate: convs.length > 0 ? aiHandled / convs.length : null,
    },
    escalations: { open, resolved: tasks.length - open, total: tasks.length },
    responseTime: {
      avgMs: mean(responseSamples),
      p50Ms: median(responseSamples),
      sampleSize: responseSamples.length,
    },
  };
}

/** Build all three windows from one set of loaded rows. Pure. */
export function buildStats(
  windows: Record<StatWindowKey, UtcRange>,
  convRows: StatsConversationRow[],
  msgRows: StatsMessageRow[],
  taskRows: StatsTaskRow[],
  capped = false,
): StatsResult {
  const out = {} as Record<StatWindowKey, WindowStats>;
  for (const key of STAT_WINDOWS) {
    out[key] = aggregateWindow(convRows, msgRows, taskRows, windows[key]);
  }
  return { windows: out, capped };
}

// ── Reads ────────────────────────────────────────────────────────────

/**
 * Load the raw rows for the widest window (RLS-scoped), then partition them into
 * the three windows in pure code. The `property_id` predicate is defense-in-depth;
 * the RLS SELECT policy is the tenant fence. Escalation tasks are filtered to
 * `task_type='escalation'` server-side. A `capped` flag is raised if any read
 * reached {@link STATS_ROW_CAP} (partial aggregation) so the UI can say so.
 */
export async function loadStats(
  supabase: SupabaseClient,
  propertyId: string,
  timeZone: string,
  now: Date = new Date(),
): Promise<StatsResult> {
  const today = todayInTimeZone(timeZone, now);
  const windows = buildStatWindows(timeZone, today);
  const range = widestRange(windows);
  // `lt` is always set (today is inclusive → start of tomorrow); `gte` is the
  // 30d lower bound. Belt-and-braces fallback if a tz somehow yields nulls.
  const gte = range.gte ?? zonedStartOfDayUtc(timeZone, civilDateMinusDays(today, 29));

  const [conv, msg, task] = await Promise.all([
    supabase
      .from("conversations")
      .select(STATS_CONVERSATION_SELECT)
      .eq("property_id", propertyId)
      .gte("created_at", gte)
      .limit(STATS_ROW_CAP),
    supabase
      .from("messages")
      .select(STATS_MESSAGE_SELECT)
      .eq("property_id", propertyId)
      .gte("sent_at", gte)
      .limit(STATS_ROW_CAP),
    supabase
      .from("tasks")
      .select(STATS_TASK_SELECT)
      .eq("property_id", propertyId)
      .eq("task_type", "escalation")
      .gte("created_at", gte)
      .limit(STATS_ROW_CAP),
  ]);

  if (conv.error) throw conv.error;
  if (msg.error) throw msg.error;
  if (task.error) throw task.error;

  const convRows = z.array(statsConversationRowSchema).parse(conv.data ?? []);
  const msgRows = z.array(statsMessageRowSchema).parse(msg.data ?? []);
  const taskRows = z.array(statsTaskRowSchema).parse(task.data ?? []);

  const capped =
    convRows.length >= STATS_ROW_CAP ||
    msgRows.length >= STATS_ROW_CAP ||
    taskRows.length >= STATS_ROW_CAP;

  return buildStats(windows, convRows, msgRows, taskRows, capped);
}

// ── Display formatting (pure) ────────────────────────────────────────

/** A response time in ms rendered compactly: "1.2 s" or "850 ms" (— when null). */
export function formatResponseTime(ms: number | null): string {
  if (ms == null) return "—";
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)} s`;
  return `${ms} ms`;
}

/** An autonomy rate (0..1) as a whole-percent string ("—" when null). */
export function formatRate(rate: number | null): string {
  if (rate == null) return "—";
  return `${Math.round(rate * 100)}%`;
}
