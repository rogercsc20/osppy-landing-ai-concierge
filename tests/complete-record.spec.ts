import { test, expect } from "@playwright/test";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  NEEDS_INFO_SELECT,
  completeRecord,
  completeRecordFormSchema,
  emptyCompleteRecordForm,
  incompleteReservationRowSchema,
  isIcalRow,
  isIncomplete,
  isPhoneMissing,
  isPlaceholderName,
  listIncompleteReservations,
  toCompleteUpdate,
  type CompleteRecordFormValues,
  type IncompleteReservationRow,
} from "../lib/dashboard/complete-record";
import {
  BOARD_RESERVATION_SELECT,
  boardReservationRowSchema,
} from "../lib/dashboard/board";

// A row as PostgREST returns it (DATE/optional cols as strings/null).
const row = (over: Partial<IncompleteReservationRow>): IncompleteReservationRow => ({
  reservation_id: "r1",
  guest_name: "Reserva Airbnb ••1234",
  guest_phone: null,
  room_code: "ical:airbnb",
  check_in: "2099-01-10",
  check_out: "2099-01-12",
  num_guests: 1,
  status: "confirmed",
  booking_source: "airbnb",
  source_feed_id: "feed-1",
  ...over,
});

// ── isIcalRow / isPhoneMissing / isPlaceholderName ───────────────────

test.describe("iCal-row + gap predicates", () => {
  test("isIcalRow is true only when source_feed_id is set", () => {
    expect(isIcalRow(row())).toBe(true);
    expect(isIcalRow(row({ source_feed_id: null }))).toBe(false);
    expect(isIcalRow(row({ source_feed_id: "" }))).toBe(false);
    expect(isIcalRow(row({ source_feed_id: "  " }))).toBe(false);
  });

  test("isPhoneMissing covers null / empty / whitespace", () => {
    expect(isPhoneMissing(row({ guest_phone: null }))).toBe(true);
    expect(isPhoneMissing(row({ guest_phone: "" }))).toBe(true);
    expect(isPhoneMissing(row({ guest_phone: "  " }))).toBe(true);
    expect(isPhoneMissing(row({ guest_phone: "+5213312345678" }))).toBe(false);
  });

  test("isPlaceholderName matches the SL-7 'Reserva <OTA>' labels (and empty)", () => {
    expect(isPlaceholderName(row({ guest_name: "Reserva Airbnb ••1234" }))).toBe(true);
    expect(isPlaceholderName(row({ guest_name: "Reserva Booking.com" }))).toBe(true);
    expect(isPlaceholderName(row({ guest_name: "Reserva OTA" }))).toBe(true);
    expect(isPlaceholderName(row({ guest_name: "" }))).toBe(true);
    expect(isPlaceholderName(row({ guest_name: null }))).toBe(true);
    // A real name (even one starting with "Reserva" mid-string) is not a placeholder.
    expect(isPlaceholderName(row({ guest_name: "Ana López" }))).toBe(false);
    expect(isPlaceholderName(row({ guest_name: "Reservados Pérez" }))).toBe(false);
  });
});

// ── isIncomplete (the surfacing predicate) ───────────────────────────

test.describe("isIncomplete", () => {
  test("flags an iCal row missing a phone", () => {
    expect(isIncomplete(row({ guest_phone: null }))).toBe(true);
  });

  test("flags an iCal row whose name is still the placeholder, even with a phone", () => {
    expect(
      isIncomplete(row({ guest_name: "Reserva Airbnb ••1234", guest_phone: "+5213312345678" })),
    ).toBe(true);
  });

  test("clears once the row has a real name AND a phone (the complete state)", () => {
    expect(
      isIncomplete(row({ guest_name: "Ana López", guest_phone: "+5213312345678" })),
    ).toBe(false);
  });

  test("never flags a manual booking (no source_feed_id), even if phone-less", () => {
    expect(
      isIncomplete(row({ source_feed_id: null, guest_name: "Walk-in", guest_phone: null })),
    ).toBe(false);
  });

  test("never flags a cancelled row (nothing to complete)", () => {
    expect(isIncomplete(row({ status: "cancelled", guest_phone: null }))).toBe(false);
  });
});

// ── completeRecordFormSchema (only the missing fields) ───────────────

const validForm: CompleteRecordFormValues = {
  guestName: "Ana López",
  guestPhone: "+5213312345678",
};

test.describe("completeRecordFormSchema", () => {
  test("accepts a real name + E.164 phone", () => {
    expect(completeRecordFormSchema.safeParse(validForm).success).toBe(true);
  });

  test("requires a name", () => {
    expect(completeRecordFormSchema.safeParse({ ...validForm, guestName: "" }).success).toBe(false);
    expect(completeRecordFormSchema.safeParse({ ...validForm, guestName: "   " }).success).toBe(
      false,
    );
  });

  test("requires an E.164 phone (no bare national numbers)", () => {
    expect(completeRecordFormSchema.safeParse({ ...validForm, guestPhone: "3312345678" }).success).toBe(
      false,
    );
    expect(completeRecordFormSchema.safeParse({ ...validForm, guestPhone: "" }).success).toBe(false);
  });

  test("the empty form is invalid (both fields required)", () => {
    expect(completeRecordFormSchema.safeParse(emptyCompleteRecordForm).success).toBe(false);
  });
});

// ── toCompleteUpdate (form → reservations.guest_* payload) ────────────

test.describe("toCompleteUpdate", () => {
  test("maps + trims to exactly the two denormalized columns", () => {
    const u = toCompleteUpdate({ guestName: "  Ana López ", guestPhone: " +5213312345678 " });
    expect(u).toEqual({ guest_name: "Ana López", guest_phone: "+5213312345678" });
    // No stray columns escape to PostgREST.
    expect(Object.keys(u).sort()).toEqual(["guest_name", "guest_phone"]);
  });
});

// ── RC-1 projection contracts ────────────────────────────────────────

test.describe("projection contract", () => {
  test("NEEDS_INFO_SELECT covers every read-schema field", () => {
    for (const field of Object.keys(incompleteReservationRowSchema.shape)) {
      expect(NEEDS_INFO_SELECT).toContain(field);
    }
  });

  // B6 added source_feed_id to the board read so the board can flag a "needs
  // info" card — keep the board SELECT and its schema in lock-step (RC-1).
  test("BOARD_RESERVATION_SELECT covers every board-schema field (incl. source_feed_id)", () => {
    for (const field of Object.keys(boardReservationRowSchema.shape)) {
      expect(BOARD_RESERVATION_SELECT).toContain(field);
    }
    expect(BOARD_RESERVATION_SELECT).toContain("source_feed_id");
  });
});

// ── A chainable fake Supabase client (no network) ────────────────────

type RecordedUpdate = { payload: Record<string, unknown>; filters: Record<string, unknown> };

function fakeSupabase(opts: {
  rows?: unknown[];
  selectError?: Error;
  updateError?: Error;
  onUpdate?: (u: RecordedUpdate) => void;
}) {
  class Builder {
    private op: "select" | "update" = "select";
    private payload: Record<string, unknown> = {};
    private filters: Record<string, unknown> = {};
    select() {
      return this;
    }
    update(payload: Record<string, unknown>) {
      this.op = "update";
      this.payload = payload;
      return this;
    }
    eq(col: string, val: unknown) {
      this.filters[col] = val;
      return this;
    }
    neq() {
      return this;
    }
    not() {
      return this;
    }
    order() {
      return this;
    }
    limit() {
      return this;
    }
    private result() {
      if (this.op === "update") {
        opts.onUpdate?.({ payload: this.payload, filters: this.filters });
        return { data: null, error: opts.updateError ?? null };
      }
      return { data: opts.rows ?? [], error: opts.selectError ?? null };
    }
    then<R>(onFulfilled: (value: { data: unknown; error: Error | null }) => R) {
      return Promise.resolve(this.result()).then(onFulfilled);
    }
  }
  return {
    from() {
      return new Builder();
    },
  } as unknown as SupabaseClient;
}

// ── listIncompleteReservations (read seam) ───────────────────────────

test.describe("listIncompleteReservations", () => {
  test("parses through the zod boundary and keeps only incomplete rows", async () => {
    const client = fakeSupabase({
      rows: [
        row({ reservation_id: "needs", guest_phone: null }), // missing phone → kept
        row({
          reservation_id: "done",
          guest_name: "Ana López",
          guest_phone: "+5213312345678",
        }), // complete → dropped
        row({ reservation_id: "placeholder", guest_name: "Reserva OTA", guest_phone: "+5213312345678" }), // placeholder name → kept
      ],
    });
    const rows = await listIncompleteReservations(client, "p1");
    expect(rows.map((r) => r.reservation_id)).toEqual(["needs", "placeholder"]);
  });

  test("propagates a PostgREST read error", async () => {
    const client = fakeSupabase({ selectError: new Error("boom") });
    await expect(listIncompleteReservations(client, "p1")).rejects.toThrow(/boom/);
  });
});

// ── completeRecord (write seam) ──────────────────────────────────────

test.describe("completeRecord", () => {
  test("writes only guest_name + guest_phone, scoped by property + reservation", async () => {
    let captured: RecordedUpdate | null = null;
    const client = fakeSupabase({ onUpdate: (u) => (captured = u) });
    await completeRecord(client, "p1", "r1", validForm);
    expect(captured).not.toBeNull();
    const u = captured!;
    expect(new Set(Object.keys(u.payload))).toEqual(new Set(["guest_name", "guest_phone"]));
    expect(u.payload.guest_name).toBe("Ana López");
    expect(u.payload.guest_phone).toBe("+5213312345678");
    expect(u.filters.reservation_id).toBe("r1");
    expect(u.filters.property_id).toBe("p1");
  });

  test("surfaces an RLS / grant error (e.g. 42501) for the form to translate", async () => {
    const client = fakeSupabase({ updateError: new Error("permission denied (42501)") });
    await expect(completeRecord(client, "p1", "r1", validForm)).rejects.toThrow(/42501/);
  });

  test("rejects an invalid form before touching the network", async () => {
    let touched = false;
    const client = fakeSupabase({ onUpdate: () => (touched = true) });
    await expect(
      completeRecord(client, "p1", "r1", { guestName: "Ana", guestPhone: "nope" }),
    ).rejects.toThrow();
    expect(touched).toBe(false);
  });
});

// ── Route guard (e2e) ────────────────────────────────────────────────

test.describe("needs-info route guard", () => {
  test("unauthenticated /es/dashboard/needs-info redirects to login", async ({ page }) => {
    await page.goto("/es/dashboard/needs-info");
    await expect(page).toHaveURL(/\/es\/login(\?|$)/);
  });
});
