import { test, expect } from "@playwright/test";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  availableActions,
  buildChipMap,
  buildTodayBoard,
  computeChip,
  loadTodayBoard,
  todayInTimeZone,
  updateReservationStatus,
  type BoardReservationRow,
  type LifecycleSendRow,
} from "../lib/dashboard/board";

// ── todayInTimeZone (D-A11 boundary) ─────────────────────────────────

test.describe("todayInTimeZone", () => {
  test("rolls 'today' back across the Mexico offset near UTC midnight", () => {
    // 05:30 UTC = 23:30 (prev day) in America/Mexico_City (UTC-6).
    const instant = new Date("2026-06-23T05:30:00Z");
    expect(todayInTimeZone("America/Mexico_City", instant)).toBe("2026-06-22");
    expect(todayInTimeZone("UTC", instant)).toBe("2026-06-23");
  });

  test("agrees with UTC well inside the day", () => {
    const instant = new Date("2026-06-23T18:00:00Z"); // 12:00 in MX
    expect(todayInTimeZone("America/Mexico_City", instant)).toBe("2026-06-23");
  });

  test("falls back to a UTC slice for an invalid timezone", () => {
    const instant = new Date("2026-06-23T18:00:00Z");
    expect(todayInTimeZone("Not/AZone", instant)).toBe("2026-06-23");
  });
});

// ── computeChip / buildChipMap (lifecycle ledger) ────────────────────

const send = (over: Partial<LifecycleSendRow>): LifecycleSendRow => ({
  reservation_id: "r1",
  trigger: "arrival_ask",
  status: "sent",
  sent_at: "2026-06-23T10:00:00Z",
  replied_at: null,
  ...over,
});

test.describe("computeChip", () => {
  test("absent when there are no rows", () => {
    expect(computeChip([])).toBe("absent");
  });

  test("absent when only failed/suppressed", () => {
    expect(computeChip([send({ status: "failed" }), send({ status: "suppressed" })])).toBe(
      "absent",
    );
  });

  test("sent when delivered/read but not replied", () => {
    expect(computeChip([send({ status: "delivered" })])).toBe("sent");
    expect(computeChip([send({ status: "read" })])).toBe("sent");
  });

  test("replied dominates even if that row's status is just 'sent'", () => {
    expect(
      computeChip([send({ status: "sent", replied_at: "2026-06-23T11:00:00Z" })]),
    ).toBe("replied");
  });
});

test.describe("buildChipMap", () => {
  test("resolves per-trigger state and leaves absent triggers absent", () => {
    const map = buildChipMap([
      send({ reservation_id: "r1", trigger: "arrival_ask", status: "delivered" }),
      send({
        reservation_id: "r1",
        trigger: "access_info",
        status: "sent",
        replied_at: "2026-06-23T12:00:00Z",
      }),
      // staff_notify is not a guest-facing chip → ignored.
      send({ reservation_id: "r1", trigger: "staff_notify", status: "sent" }),
    ]);
    const chips = map.get("r1");
    expect(chips?.arrival_ask).toBe("sent");
    expect(chips?.access_info).toBe("replied");
    expect(chips?.checkout_reminder).toBe("absent");
    expect(chips?.review_ask).toBe("absent");
  });
});

// ── availableActions ─────────────────────────────────────────────────

test.describe("availableActions", () => {
  test("offers check-in + no-show before arrival", () => {
    expect(availableActions("confirmed")).toEqual(["checked_in", "no_show"]);
    expect(availableActions("tentative")).toEqual(["checked_in", "no_show"]);
  });
  test("offers check-out once in-house", () => {
    expect(availableActions("checked_in")).toEqual(["checked_out"]);
  });
  test("offers nothing once terminal", () => {
    expect(availableActions("checked_out")).toEqual([]);
    expect(availableActions("cancelled")).toEqual([]);
    expect(availableActions("no_show")).toEqual([]);
  });
});

// ── buildTodayBoard (partition + chips) ──────────────────────────────

const res = (over: Partial<BoardReservationRow>): BoardReservationRow => ({
  reservation_id: "r",
  guest_name: "Guest",
  guest_phone: "+523300000000",
  room_code: "R1",
  check_in: "2026-06-23",
  check_out: "2026-06-25",
  num_guests: 2,
  status: "confirmed",
  arrival_eta: null,
  ...over,
});

test.describe("buildTodayBoard", () => {
  const today = "2026-06-23";

  test("partitions arrivals, departures, and in-house; excludes cancelled", () => {
    const rows: BoardReservationRow[] = [
      res({ reservation_id: "arr", check_in: today, check_out: "2026-06-26" }),
      res({ reservation_id: "dep", check_in: "2026-06-20", check_out: today, status: "checked_in" }),
      res({
        reservation_id: "mid",
        check_in: "2026-06-21",
        check_out: "2026-06-28",
        status: "checked_in",
      }),
      res({ reservation_id: "cxl", check_in: today, check_out: "2026-06-24", status: "cancelled" }),
    ];
    const board = buildTodayBoard(today, rows, []);

    expect(board.today).toBe(today);
    expect(board.arrivals.map((c) => c.reservation_id)).toEqual(["arr"]); // cancelled dropped
    expect(board.departures.map((c) => c.reservation_id)).toEqual(["dep"]);
    expect(board.inHouseCount).toBe(2); // dep + mid are checked_in; mid isn't a column card
  });

  test("sorts arrivals by ETA (no-ETA last), then attaches chips", () => {
    const rows: BoardReservationRow[] = [
      res({ reservation_id: "late", check_in: today, arrival_eta: "20:00:00" }),
      res({ reservation_id: "none", check_in: today, arrival_eta: null }),
      res({ reservation_id: "early", check_in: today, arrival_eta: "09:00:00" }),
    ];
    const sends: LifecycleSendRow[] = [
      send({ reservation_id: "early", trigger: "arrival_ask", status: "delivered" }),
    ];
    const board = buildTodayBoard(today, rows, sends);
    expect(board.arrivals.map((c) => c.reservation_id)).toEqual(["early", "late", "none"]);
    expect(board.arrivals[0].chips.arrival_ask).toBe("sent");
    expect(board.arrivals[1].chips.arrival_ask).toBe("absent");
  });
});

// ── A minimal chainable fake Supabase client (no network) ────────────

type FakeData = Record<string, unknown[]>;
type RecordedUpdate = { table: string; payload: Record<string, unknown> };

function fakeSupabase(data: FakeData, updateError: Error | null = null) {
  const updates: RecordedUpdate[] = [];

  class Builder {
    private payload: Record<string, unknown> = {};
    private op: "select" | "update" = "select";
    constructor(private table: string) {}
    select() {
      return this;
    }
    update(payload: Record<string, unknown>) {
      this.op = "update";
      this.payload = payload;
      return this;
    }
    eq() {
      return this;
    }
    in() {
      return this;
    }
    or() {
      return this;
    }
    order() {
      return this;
    }
    limit() {
      return this;
    }
    maybeSingle() {
      const rows = data[this.table] ?? [];
      return Promise.resolve({ data: rows[0] ?? null, error: null });
    }
    private result() {
      if (this.op === "update") {
        updates.push({ table: this.table, payload: this.payload });
        return { data: null, error: updateError };
      }
      return { data: data[this.table] ?? [], error: null };
    }
    then<R>(onFulfilled: (value: { data: unknown; error: Error | null }) => R) {
      return Promise.resolve(this.result()).then(onFulfilled);
    }
  }

  const client = {
    from(table: string) {
      return new Builder(table);
    },
  };
  return { client: client as unknown as SupabaseClient, updates };
}

test.describe("updateReservationStatus (write contract)", () => {
  test("check-in stamps status + checked_in_at", async () => {
    const { client, updates } = fakeSupabase({});
    await updateReservationStatus(client, "r1", "p1", "checked_in");
    expect(updates).toHaveLength(1);
    expect(updates[0].payload.status).toBe("checked_in");
    expect(typeof updates[0].payload.checked_in_at).toBe("string");
  });

  test("no-show stamps status only (no timestamp)", async () => {
    const { client, updates } = fakeSupabase({});
    await updateReservationStatus(client, "r1", "p1", "no_show");
    expect(updates[0].payload).toEqual({ status: "no_show" });
  });

  test("propagates an RLS / PostgREST error", async () => {
    const { client } = fakeSupabase({}, new Error("permission denied (42501)"));
    await expect(updateReservationStatus(client, "r1", "p1", "checked_in")).rejects.toThrow(
      /42501/,
    );
  });
});

test.describe("loadTodayBoard (read seam)", () => {
  test("assembles the board from the reservations + lifecycle reads", async () => {
    const today = "2026-06-23";
    const { client } = fakeSupabase({
      reservations: [
        res({ reservation_id: "arr", check_in: today }),
        res({ reservation_id: "dep", check_in: "2026-06-20", check_out: today, status: "checked_in" }),
      ],
      lifecycle_sends: [
        send({ reservation_id: "arr", trigger: "arrival_ask", status: "read" }),
      ],
    });
    const board = await loadTodayBoard(client, "p1", today);
    expect(board.arrivals.map((c) => c.reservation_id)).toEqual(["arr"]);
    expect(board.departures.map((c) => c.reservation_id)).toEqual(["dep"]);
    expect(board.inHouseCount).toBe(1);
    expect(board.arrivals[0].chips.arrival_ask).toBe("sent");
  });
});

// ── Route guard (e2e) ────────────────────────────────────────────────

test.describe("today board route guard", () => {
  test("unauthenticated /es/dashboard/today redirects to login", async ({ page }) => {
    await page.goto("/es/dashboard/today");
    await expect(page).toHaveURL(/\/es\/login(\?|$)/);
  });
});
