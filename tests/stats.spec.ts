import { test, expect } from "@playwright/test";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  STATS_CONVERSATION_SELECT,
  STATS_MESSAGE_SELECT,
  STATS_TASK_SELECT,
  aggregateWindow,
  buildStatWindows,
  buildStats,
  formatRate,
  formatResponseTime,
  inRange,
  loadStats,
  statsConversationRowSchema,
  statsMessageRowSchema,
  statsTaskRowSchema,
  widestRange,
  type StatsConversationRow,
  type StatsMessageRow,
  type StatsTaskRow,
} from "../lib/dashboard/stats";

const MX = "America/Mexico_City";

// ── buildStatWindows (property-local rolling windows) ────────────────

test.describe("buildStatWindows", () => {
  test("today / week / month share the same exclusive upper bound", () => {
    const w = buildStatWindows(MX, "2026-06-23");
    // All windows end at the start of the NEXT local day (today inclusive):
    // 2026-06-24 00:00 MX = 06:00Z.
    expect(w.today.lt).toBe("2026-06-24T06:00:00.000Z");
    expect(w.week.lt).toBe("2026-06-24T06:00:00.000Z");
    expect(w.month.lt).toBe("2026-06-24T06:00:00.000Z");
  });

  test("each window's lower bound is the right number of days back", () => {
    const w = buildStatWindows(MX, "2026-06-23");
    // today: from 2026-06-23 00:00 MX
    expect(w.today.gte).toBe("2026-06-23T06:00:00.000Z");
    // week: 7 days inclusive → from 2026-06-17
    expect(w.week.gte).toBe("2026-06-17T06:00:00.000Z");
    // month: 30 days inclusive → from 2026-05-25
    expect(w.month.gte).toBe("2026-05-25T06:00:00.000Z");
  });

  test("widestRange is the month window", () => {
    const w = buildStatWindows(MX, "2026-06-23");
    expect(widestRange(w)).toEqual(w.month);
  });
});

// ── inRange (half-open [gte, lt)) ────────────────────────────────────

test.describe("inRange", () => {
  const range = { gte: "2026-06-01T00:00:00Z", lt: "2026-06-02T00:00:00Z" };
  test("gte is inclusive, lt is exclusive", () => {
    expect(inRange("2026-06-01T00:00:00Z", range)).toBe(true);
    expect(inRange("2026-06-01T23:59:59Z", range)).toBe(true);
    expect(inRange("2026-06-02T00:00:00Z", range)).toBe(false);
    expect(inRange("2026-05-31T23:59:59Z", range)).toBe(false);
  });
  test("null / unparseable timestamps fall out", () => {
    expect(inRange(null, range)).toBe(false);
    expect(inRange("nope", range)).toBe(false);
  });
  test("open bounds are unbounded", () => {
    expect(inRange("2000-01-01T00:00:00Z", { gte: null, lt: null })).toBe(true);
  });
});

// ── aggregateWindow (the core metric math) ───────────────────────────

const RANGE = { gte: "2026-06-01T00:00:00Z", lt: "2026-07-01T00:00:00Z" };
const inWindow = "2026-06-15T12:00:00Z";
const outOfWindow = "2026-05-01T12:00:00Z";

test.describe("aggregateWindow", () => {
  test("counts conversations and splits autonomy (ai-handled vs staff)", () => {
    const convs: StatsConversationRow[] = [
      { created_at: inWindow, ai_handled: true, staff_takeover_at: null },
      { created_at: inWindow, ai_handled: true, staff_takeover_at: "2026-06-15T13:00:00Z" }, // taken over → staff
      { created_at: inWindow, ai_handled: false, staff_takeover_at: null }, // not ai → staff
      { created_at: outOfWindow, ai_handled: true, staff_takeover_at: null }, // excluded
    ];
    const s = aggregateWindow(convs, [], [], RANGE);
    expect(s.conversations).toBe(3);
    expect(s.autonomy.aiHandled).toBe(1);
    expect(s.autonomy.staffHandled).toBe(2);
    expect(s.autonomy.rate).toBeCloseTo(1 / 3);
  });

  test("autonomy rate is null with zero conversations", () => {
    expect(aggregateWindow([], [], [], RANGE).autonomy.rate).toBe(null);
  });

  test("counts messages and computes avg/p50 over AI response times only", () => {
    const msgs: StatsMessageRow[] = [
      { sent_at: inWindow, sender_type: "guest", ai_response_time_ms: null },
      { sent_at: inWindow, sender_type: "ai", ai_response_time_ms: 1000 },
      { sent_at: inWindow, sender_type: "ai", ai_response_time_ms: 2000 },
      { sent_at: inWindow, sender_type: "ai", ai_response_time_ms: 3000 },
      { sent_at: inWindow, sender_type: "ai", ai_response_time_ms: null }, // no timing → not sampled
      { sent_at: outOfWindow, sender_type: "ai", ai_response_time_ms: 99999 }, // excluded
    ];
    const s = aggregateWindow([], msgs, [], RANGE);
    expect(s.messages).toBe(5); // all in-window messages, guest + ai
    expect(s.responseTime.sampleSize).toBe(3);
    expect(s.responseTime.avgMs).toBe(2000);
    expect(s.responseTime.p50Ms).toBe(2000);
  });

  test("median averages the two middles for an even sample", () => {
    const msgs: StatsMessageRow[] = [
      { sent_at: inWindow, sender_type: "ai", ai_response_time_ms: 100 },
      { sent_at: inWindow, sender_type: "ai", ai_response_time_ms: 300 },
    ];
    expect(aggregateWindow([], msgs, [], RANGE).responseTime.p50Ms).toBe(200);
  });

  test("escalations split open vs resolved", () => {
    const tasks: StatsTaskRow[] = [
      { created_at: inWindow, status: "pending" },
      { created_at: inWindow, status: "in_progress" },
      { created_at: inWindow, status: "completed" },
      { created_at: inWindow, status: "cancelled" },
      { created_at: outOfWindow, status: "pending" }, // excluded
    ];
    const s = aggregateWindow([], [], tasks, RANGE);
    expect(s.escalations).toEqual({ open: 2, resolved: 2, total: 4 });
  });
});

// ── buildStats (windows partitioned from one row set) ────────────────

test.describe("buildStats", () => {
  test("a row lands only in the windows whose range contains it", () => {
    const windows = buildStatWindows(MX, "2026-06-23");
    // A conversation 3 days ago is in week + month but not today.
    const convs: StatsConversationRow[] = [
      { created_at: "2026-06-20T18:00:00Z", ai_handled: true, staff_takeover_at: null },
    ];
    const { windows: out } = buildStats(windows, convs, [], []);
    expect(out.today.conversations).toBe(0);
    expect(out.week.conversations).toBe(1);
    expect(out.month.conversations).toBe(1);
  });

  test("passes the capped flag through", () => {
    const windows = buildStatWindows(MX, "2026-06-23");
    expect(buildStats(windows, [], [], [], true).capped).toBe(true);
  });
});

// ── formatters ───────────────────────────────────────────────────────

test.describe("formatResponseTime / formatRate", () => {
  test("response time renders ms under 1s, seconds above", () => {
    expect(formatResponseTime(null)).toBe("—");
    expect(formatResponseTime(850)).toBe("850 ms");
    expect(formatResponseTime(1500)).toBe("1.5 s");
  });
  test("rate renders a whole percent or em dash", () => {
    expect(formatRate(null)).toBe("—");
    expect(formatRate(0)).toBe("0%");
    expect(formatRate(0.6667)).toBe("67%");
    expect(formatRate(1)).toBe("100%");
  });
});

// ── RC-1 projection contract (every schema field is in its SELECT) ───

test.describe("projection contract", () => {
  test("each stats SELECT covers its schema fields", () => {
    for (const field of Object.keys(statsConversationRowSchema.shape)) {
      expect(STATS_CONVERSATION_SELECT).toContain(field);
    }
    for (const field of Object.keys(statsMessageRowSchema.shape)) {
      expect(STATS_MESSAGE_SELECT).toContain(field);
    }
    for (const field of Object.keys(statsTaskRowSchema.shape)) {
      expect(STATS_TASK_SELECT).toContain(field);
    }
  });
});

// ── A minimal chainable fake Supabase client (no network) ────────────

type FakeData = Record<string, unknown[]>;

function fakeSupabase(data: FakeData, errors: Record<string, Error> = {}) {
  class Builder {
    constructor(private table: string) {}
    select() {
      return this;
    }
    eq() {
      return this;
    }
    gte() {
      return this;
    }
    limit() {
      return this;
    }
    private result() {
      return { data: data[this.table] ?? [], error: errors[this.table] ?? null };
    }
    then<R>(onFulfilled: (v: { data: unknown; error: Error | null }) => R) {
      return Promise.resolve(this.result()).then(onFulfilled);
    }
  }
  return {
    from(table: string) {
      return new Builder(table);
    },
  } as unknown as SupabaseClient;
}

// ── loadStats (read seam) ────────────────────────────────────────────

test.describe("loadStats", () => {
  test("reads the three tables, parses through zod, and aggregates", async () => {
    const now = new Date("2026-06-23T20:00:00Z"); // fixed clock → deterministic windows
    const client = fakeSupabase({
      conversations: [
        { created_at: "2026-06-23T18:00:00Z", ai_handled: true, staff_takeover_at: null },
        { created_at: "2026-06-20T18:00:00Z", ai_handled: false, staff_takeover_at: null },
      ],
      messages: [
        { sent_at: "2026-06-23T18:00:00Z", sender_type: "ai", ai_response_time_ms: 1200 },
        { sent_at: "2026-06-23T18:00:01Z", sender_type: "guest", ai_response_time_ms: null },
      ],
      tasks: [{ created_at: "2026-06-23T18:00:00Z", status: "pending" }],
    });
    const stats = await loadStats(client, "p1", MX, now);
    expect(stats.windows.today.conversations).toBe(1); // only the 06-23 one
    expect(stats.windows.month.conversations).toBe(2);
    expect(stats.windows.today.messages).toBe(2);
    expect(stats.windows.today.escalations.open).toBe(1);
    expect(stats.windows.today.responseTime.avgMs).toBe(1200);
    expect(stats.capped).toBe(false);
  });

  test("propagates a PostgREST error", async () => {
    const client = fakeSupabase({}, { conversations: new Error("boom") });
    await expect(loadStats(client, "p1", MX, new Date("2026-06-23T20:00:00Z"))).rejects.toThrow(/boom/);
  });
});

// ── Route guard (e2e) ────────────────────────────────────────────────

test.describe("stats route guard", () => {
  test("unauthenticated /es/dashboard/stats redirects to login", async ({ page }) => {
    await page.goto("/es/dashboard/stats");
    await expect(page).toHaveURL(/\/es\/login(\?|$)/);
  });
});
