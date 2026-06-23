import { test, expect } from "@playwright/test";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  CONVERSATION_DETAIL_SELECT,
  CONVERSATION_LIST_SELECT,
  MESSAGE_SELECT,
  TASK_SELECT,
  buildFilterQuery,
  buildPageMeta,
  conversationDetailRowSchema,
  conversationListRowSchema,
  formatDateTime,
  isOpenTask,
  listConversations,
  loadConversationDetail,
  loadConversationMessages,
  loadConversationTasks,
  loadEscalatedConversationIds,
  messageRowSchema,
  normalizeFilters,
  parsePage,
  taskRowSchema,
  zonedDayRangeToUtc,
  zonedStartOfDayUtc,
  type ConversationFilters,
} from "../lib/dashboard/conversations";

// ── normalizeFilters (query-param hardening) ─────────────────────────

test.describe("normalizeFilters", () => {
  test("keeps a known state, drops an unknown one", () => {
    expect(normalizeFilters({ state: "booking_flow" }).state).toBe("booking_flow");
    expect(normalizeFilters({ state: "wat" }).state).toBe(null);
    expect(normalizeFilters({}).state).toBe(null);
  });

  test("escalated is true only for the literal '1'", () => {
    expect(normalizeFilters({ escalated: "1" }).escalated).toBe(true);
    expect(normalizeFilters({ escalated: "true" }).escalated).toBe(false);
    expect(normalizeFilters({}).escalated).toBe(false);
  });

  test("accepts ISO civil dates, drops malformed ones", () => {
    const f = normalizeFilters({ from: "2026-06-01", to: "2026-6-2" });
    expect(f.from).toBe("2026-06-01");
    expect(f.to).toBe(null); // not zero-padded → rejected
  });

  test("takes the first value when a param repeats", () => {
    expect(normalizeFilters({ state: ["closed", "new"] }).state).toBe("closed");
  });
});

// ── parsePage ────────────────────────────────────────────────────────

test.describe("parsePage", () => {
  test("clamps junk and sub-1 values to page 1", () => {
    expect(parsePage("3")).toBe(3);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-2")).toBe(1);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage("2.5")).toBe(1);
  });
});

// ── buildPageMeta ────────────────────────────────────────────────────

test.describe("buildPageMeta", () => {
  test("empty result", () => {
    const m = buildPageMeta(1, 20, 0);
    expect(m).toMatchObject({
      page: 1,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
      fromIndex: 0,
      toIndex: 0,
    });
  });

  test("a middle page reports the right window and neighbours", () => {
    const m = buildPageMeta(2, 20, 45);
    expect(m).toMatchObject({
      page: 2,
      totalPages: 3,
      hasPrev: true,
      hasNext: true,
      fromIndex: 21,
      toIndex: 40,
    });
  });

  test("clamps an out-of-range page to the last page", () => {
    const m = buildPageMeta(99, 20, 45);
    expect(m.page).toBe(3);
    expect(m.hasNext).toBe(false);
    expect(m.toIndex).toBe(45);
  });
});

// ── property-local date range (D-A11) ────────────────────────────────

test.describe("zonedStartOfDayUtc", () => {
  test("property-local midnight maps to the right UTC instant", () => {
    // 2026-06-23 00:00 in Mexico City (UTC-6) is 06:00Z.
    expect(zonedStartOfDayUtc("America/Mexico_City", "2026-06-23")).toBe("2026-06-23T06:00:00.000Z");
    expect(zonedStartOfDayUtc("UTC", "2026-06-23")).toBe("2026-06-23T00:00:00.000Z");
  });
});

test.describe("zonedDayRangeToUtc", () => {
  test("inclusive 'to' becomes the start of the next local day (half-open)", () => {
    const r = zonedDayRangeToUtc("America/Mexico_City", "2026-06-01", "2026-06-01");
    expect(r.gte).toBe("2026-06-01T06:00:00.000Z");
    expect(r.lt).toBe("2026-06-02T06:00:00.000Z");
  });

  test("absent bounds stay null", () => {
    expect(zonedDayRangeToUtc("UTC", null, null)).toEqual({ gte: null, lt: null });
    expect(zonedDayRangeToUtc("UTC", "2026-06-01", null).lt).toBe(null);
  });
});

// ── buildFilterQuery ─────────────────────────────────────────────────

const filters = (over: Partial<ConversationFilters> = {}): ConversationFilters => ({
  state: null,
  escalated: false,
  from: null,
  to: null,
  ...over,
});

test.describe("buildFilterQuery", () => {
  test("clean URL for default filters on page 1", () => {
    expect(buildFilterQuery(filters(), 1)).toBe("");
  });

  test("serialises every active filter plus the page", () => {
    const qs = buildFilterQuery(
      filters({ state: "closed", escalated: true, from: "2026-06-01", to: "2026-06-30" }),
      3,
    );
    const parsed = new URLSearchParams(qs);
    expect(parsed.get("state")).toBe("closed");
    expect(parsed.get("escalated")).toBe("1");
    expect(parsed.get("from")).toBe("2026-06-01");
    expect(parsed.get("to")).toBe("2026-06-30");
    expect(parsed.get("page")).toBe("3");
  });
});

// ── formatDateTime + isOpenTask ──────────────────────────────────────

test.describe("formatDateTime", () => {
  test("renders an em dash for empty input", () => {
    expect(formatDateTime(null, "America/Mexico_City")).toBe("—");
    expect(formatDateTime(undefined, "America/Mexico_City")).toBe("—");
    expect(formatDateTime("not-a-date", "America/Mexico_City")).toBe("—");
  });

  test("renders a real instant (non-dash) in the property timezone", () => {
    expect(formatDateTime("2026-06-23T18:00:00Z", "America/Mexico_City")).not.toBe("—");
  });
});

test.describe("isOpenTask", () => {
  test("pending/in_progress are open; terminal states are not", () => {
    expect(isOpenTask("pending")).toBe(true);
    expect(isOpenTask("in_progress")).toBe(true);
    expect(isOpenTask("completed")).toBe(false);
    expect(isOpenTask("cancelled")).toBe(false);
  });
});

// ── RC-1 projection contract (every schema field is in its SELECT) ───

test.describe("projection contract", () => {
  test("CONVERSATION_LIST_SELECT covers every list-row field", () => {
    for (const field of Object.keys(conversationListRowSchema.shape)) {
      if (field === "guest_profiles") continue;
      expect(CONVERSATION_LIST_SELECT).toContain(field);
    }
    expect(CONVERSATION_LIST_SELECT).toContain("guest_profiles(name, phone)");
  });

  test("CONVERSATION_DETAIL_SELECT covers every detail-row + guest field", () => {
    for (const field of Object.keys(conversationDetailRowSchema.shape)) {
      if (field === "guest_profiles") continue;
      expect(CONVERSATION_DETAIL_SELECT).toContain(field);
    }
    for (const g of [
      "name",
      "phone",
      "email",
      "language_preference",
      "total_stays",
      "total_messages",
      "first_contact_at",
      "last_contact_at",
    ]) {
      expect(CONVERSATION_DETAIL_SELECT).toContain(g);
    }
  });

  test("MESSAGE_SELECT and TASK_SELECT cover their fields", () => {
    for (const field of Object.keys(messageRowSchema.shape)) {
      expect(MESSAGE_SELECT).toContain(field);
    }
    for (const field of Object.keys(taskRowSchema.shape)) {
      expect(TASK_SELECT).toContain(field);
    }
  });
});

// ── A minimal chainable fake Supabase client (no network) ────────────

type FakeData = Record<string, unknown[]>;

function fakeSupabase(data: FakeData, errors: Record<string, Error> = {}) {
  class Builder {
    private wantCount = false;
    constructor(private table: string) {}
    select(_sel?: string, opts?: { count?: string }) {
      if (opts?.count) this.wantCount = true;
      return this;
    }
    eq() {
      return this;
    }
    in() {
      return this;
    }
    gte() {
      return this;
    }
    lt() {
      return this;
    }
    not() {
      return this;
    }
    order() {
      return this;
    }
    range() {
      return this;
    }
    limit() {
      return this;
    }
    maybeSingle() {
      const rows = data[this.table] ?? [];
      return Promise.resolve({ data: rows[0] ?? null, error: errors[this.table] ?? null });
    }
    private result() {
      const rows = data[this.table] ?? [];
      return {
        data: rows,
        count: this.wantCount ? rows.length : null,
        error: errors[this.table] ?? null,
      };
    }
    then<R>(onFulfilled: (v: { data: unknown; count: number | null; error: Error | null }) => R) {
      return Promise.resolve(this.result()).then(onFulfilled);
    }
  }
  return {
    from(table: string) {
      return new Builder(table);
    },
  } as unknown as SupabaseClient;
}

const convRow = (over: Record<string, unknown> = {}) => ({
  conversation_id: "c1",
  conversation_state: "inquiry",
  ai_handled: true,
  staff_takeover_at: null,
  last_message_at: "2026-06-23T18:00:00Z",
  last_guest_inbound_at: "2026-06-23T17:55:00Z",
  closed_at: null,
  created_at: "2026-06-23T17:00:00Z",
  channel_type: "whatsapp",
  reservation_id: null,
  guest_id: "g1",
  guest_profiles: { name: "Ana", phone: "+523300000000" },
  ...over,
});

// ── loadEscalatedConversationIds (dedupe + drop nulls) ───────────────

test.describe("loadEscalatedConversationIds", () => {
  test("dedupes conversation ids and drops nulls", async () => {
    const client = fakeSupabase({
      tasks: [
        { conversation_id: "c1" },
        { conversation_id: "c1" },
        { conversation_id: "c2" },
        { conversation_id: null },
      ],
    });
    const ids = await loadEscalatedConversationIds(client, "p1");
    expect(ids.sort()).toEqual(["c1", "c2"]);
  });

  test("propagates a PostgREST error", async () => {
    const client = fakeSupabase({}, { tasks: new Error("boom") });
    await expect(loadEscalatedConversationIds(client, "p1")).rejects.toThrow(/boom/);
  });
});

// ── listConversations (read seam) ────────────────────────────────────

test.describe("listConversations", () => {
  test("parses rows through the zod boundary and returns the exact total", async () => {
    const client = fakeSupabase({
      conversations: [convRow({ conversation_id: "c1" }), convRow({ conversation_id: "c2" })],
    });
    const { rows, total } = await listConversations(client, "p1", {
      state: null,
      restrictIds: null,
      range: { gte: null, lt: null },
      page: 1,
      pageSize: 20,
    });
    expect(rows.map((r) => r.conversation_id)).toEqual(["c1", "c2"]);
    expect(total).toBe(2);
    expect(rows[0].guest_profiles?.name).toBe("Ana");
  });
});

// ── detail reads ─────────────────────────────────────────────────────

test.describe("loadConversationDetail", () => {
  test("returns the parsed conversation", async () => {
    const client = fakeSupabase({
      conversations: [
        {
          conversation_id: "c1",
          property_id: "p1",
          conversation_state: "post_stay",
          ai_handled: false,
          staff_takeover_at: "2026-06-23T18:10:00Z",
          first_message_at: "2026-06-23T17:00:00Z",
          last_message_at: "2026-06-23T18:00:00Z",
          last_guest_inbound_at: null,
          closed_at: null,
          created_at: "2026-06-23T17:00:00Z",
          channel_type: "whatsapp",
          reservation_id: null,
          guest_id: "g1",
          guest_profiles: {
            name: "Ana",
            phone: "+52",
            email: null,
            language_preference: "es",
            total_stays: 2,
            total_messages: 9,
            first_contact_at: null,
            last_contact_at: null,
          },
        },
      ],
    });
    const conv = await loadConversationDetail(client, "c1");
    expect(conv?.conversation_state).toBe("post_stay");
    expect(conv?.guest_profiles?.total_stays).toBe(2);
  });

  test("returns null when the id is absent / not accessible", async () => {
    const client = fakeSupabase({ conversations: [] });
    expect(await loadConversationDetail(client, "nope")).toBe(null);
  });
});

test.describe("loadConversationMessages / loadConversationTasks", () => {
  test("parse their rows through the zod boundary", async () => {
    const client = fakeSupabase({
      messages: [
        { message_id: "m1", sender_type: "guest", text: "Hola", intent: "greeting", ai_model: null, created_at: "2026-06-23T17:00:00Z" },
        { message_id: "m2", sender_type: "ai", text: "¡Hola!", intent: null, ai_model: "claude-sonnet-4-6", created_at: "2026-06-23T17:01:00Z" },
      ],
      tasks: [
        { task_id: "t1", task_type: "escalation", status: "pending", priority: "high", title: "Llamar", due_at: null, created_at: "2026-06-23T17:02:00Z" },
      ],
    });
    const messages = await loadConversationMessages(client, "c1");
    expect(messages.map((m) => m.sender_type)).toEqual(["guest", "ai"]);
    const tasks = await loadConversationTasks(client, "c1");
    expect(tasks[0].task_type).toBe("escalation");
  });
});

// ── Route guard (e2e) ────────────────────────────────────────────────

test.describe("conversations route guard", () => {
  test("unauthenticated /es/dashboard/conversations redirects to login", async ({ page }) => {
    await page.goto("/es/dashboard/conversations");
    await expect(page).toHaveURL(/\/es\/login(\?|$)/);
  });
});
