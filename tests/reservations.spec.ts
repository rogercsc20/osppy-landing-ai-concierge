import { test, expect } from "@playwright/test";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createManualReservation,
  emptyReservationForm,
  listReservations,
  RESERVATION_LIST_SELECT,
  reservationFormSchema,
  reservationRowSchema,
  toRpcArgs,
  type ReservationFormValues,
} from "../lib/dashboard/reservations";
import { isPermissionError } from "../lib/dashboard/errors";

// A valid manual booking (future dates so it never collides with `today`).
const valid: ReservationFormValues = {
  ...emptyReservationForm,
  guestName: "Ana López",
  guestPhone: "+523312345678",
  roomCode: "R1",
  checkIn: "2099-01-10",
  checkOut: "2099-01-12",
  numGuests: "2",
  totalPriceMxn: "2400",
};

test.describe("reservation form schema (zod)", () => {
  test("accepts a valid booking", () => {
    expect(reservationFormSchema.safeParse(valid).success).toBe(true);
  });

  test("rejects a non-E.164 phone", () => {
    expect(
      reservationFormSchema.safeParse({ ...valid, guestPhone: "3312345678" }).success,
    ).toBe(false);
  });

  test("rejects a format-valid but unparseable number", () => {
    // Passes the +E.164 regex but libphonenumber says it is not a real
    // number → the canonicalizability refine rejects it (so toRpcArgs can
    // never silently null the phone).
    expect(
      reservationFormSchema.safeParse({ ...valid, guestPhone: "+10000000000" }).success,
    ).toBe(false);
  });

  test("rejects check_out on or before check_in", () => {
    expect(
      reservationFormSchema.safeParse({ ...valid, checkOut: "2099-01-10" }).success,
    ).toBe(false);
  });

  test("requires a guest name", () => {
    expect(reservationFormSchema.safeParse({ ...valid, guestName: "" }).success).toBe(false);
  });

  test("requires a room code", () => {
    expect(reservationFormSchema.safeParse({ ...valid, roomCode: "" }).success).toBe(false);
  });

  test("rejects num_guests < 1", () => {
    expect(reservationFormSchema.safeParse({ ...valid, numGuests: "0" }).success).toBe(false);
  });

  test("rejects amount paid over the total", () => {
    expect(
      reservationFormSchema.safeParse({ ...valid, amountPaidMxn: "9999" }).success,
    ).toBe(false);
  });

  test("accepts an optional valid email but rejects a malformed one", () => {
    expect(
      reservationFormSchema.safeParse({ ...valid, guestEmail: "ana@hotel.mx" }).success,
    ).toBe(true);
    expect(
      reservationFormSchema.safeParse({ ...valid, guestEmail: "not-an-email" }).success,
    ).toBe(false);
  });
});

test.describe("toRpcArgs → mig-082 contract", () => {
  test("maps + coerces the named RPC arguments", () => {
    const args = toRpcArgs(valid, "prop-123");
    expect(args.p_property_id).toBe("prop-123");
    expect(args.p_guest_name).toBe("Ana López");
    expect(args.p_num_guests).toBe(2); // string → number
    expect(args.p_total_price_mxn).toBe(2400);
    expect(args.p_guest_phone).toBe("+523312345678");
    expect(args.p_guest_email).toBeNull(); // blank → null
    expect(args.p_room_id).toBeNull();
    expect(args.p_amount_paid_mxn).toBe(0); // blank paid → 0
    expect(args.p_deposit_amount_mxn).toBeNull();
    expect(args.p_booking_source).toBe("manual");
    expect(args.p_outbound_consent_source).toBe("manual_booking");
    expect(args.p_status).toBe("confirmed");
    expect(args.p_currency).toBe("MXN");
  });

  test("canonicalizes a legacy MX-1 phone so it matches the pipeline guest", () => {
    // The 2026-06-23 duplicate-guest bug: a hotelier enters the legacy MX
    // mobile form (`+521…`) that Meta delivers; the RPC stored it raw, so the
    // WhatsApp pipeline (canonical `+52…` via to_e164) never resolved the same
    // guest. Now toRpcArgs strips the "1" → the stored phone IS the canonical.
    const args = toRpcArgs({ ...valid, guestPhone: "+5213312345678" }, "prop-123");
    expect(args.p_guest_phone).toBe("+523312345678");
  });
});

test.describe("RESERVATION_LIST_SELECT — RC-1 projection contract", () => {
  test("every reservationRowSchema field is present in the SELECT string", () => {
    const selected = RESERVATION_LIST_SELECT.split(",").map((s) => s.trim());
    for (const key of Object.keys(reservationRowSchema.shape)) {
      expect(selected).toContain(key);
    }
  });
});

// ── A minimal chainable fake Supabase client (no network) ────────────
type FakeOpts = {
  rows?: unknown[];
  rpcResult?: unknown;
  rpcError?: Error | null;
  selectError?: Error | null;
};

function fakeSupabase(opts: FakeOpts = {}) {
  const calls: Array<{ rpc: string; args: unknown }> = [];
  class Builder {
    select() {
      return this;
    }
    eq() {
      return this;
    }
    order() {
      return this;
    }
    limit() {
      return this;
    }
    then<R>(onFulfilled: (v: { data: unknown; error: Error | null }) => R) {
      return Promise.resolve({
        data: opts.rows ?? [],
        error: opts.selectError ?? null,
      }).then(onFulfilled);
    }
  }
  const client = {
    from() {
      return new Builder();
    },
    rpc(fn: string, args: unknown) {
      calls.push({ rpc: fn, args });
      return Promise.resolve({ data: opts.rpcResult ?? null, error: opts.rpcError ?? null });
    },
  };
  return { client: client as unknown as SupabaseClient, calls };
}

const validRow = {
  reservation_id: "res-1",
  guest_name: "Ana López",
  guest_phone: "+523312345678",
  room_code: "R1",
  check_in: "2099-01-10",
  check_out: "2099-01-12",
  num_guests: 2,
  num_nights: 2,
  total_price_mxn: "2400",
  status: "confirmed",
  payment_status: "pending",
  booking_source: "manual",
};

test.describe("createManualReservation (the write seam)", () => {
  test("calls the create_manual_reservation RPC and returns the parsed row", async () => {
    const { client, calls } = fakeSupabase({ rpcResult: validRow });
    const row = await createManualReservation(client, "prop-1", valid);
    expect(calls).toHaveLength(1);
    expect(calls[0].rpc).toBe("create_manual_reservation");
    expect(row.reservation_id).toBe("res-1");
  });

  test("unwraps a 1-element array result (PostgREST SETOF shape)", async () => {
    const { client } = fakeSupabase({ rpcResult: [validRow] });
    const row = await createManualReservation(client, "prop-1", valid);
    expect(row.reservation_id).toBe("res-1");
  });

  test("re-throws a 42501 RLS denial instead of swallowing it", async () => {
    const { client } = fakeSupabase({ rpcError: new Error("permission denied (42501)") });
    await expect(createManualReservation(client, "prop-1", valid)).rejects.toThrow(/42501/);
  });

  test("rejects an invalid form BEFORE calling the RPC", async () => {
    const { client, calls } = fakeSupabase({ rpcResult: validRow });
    await expect(
      createManualReservation(client, "prop-1", { ...valid, guestPhone: "3312345678" }),
    ).rejects.toThrow();
    expect(calls).toHaveLength(0); // zod gate fires before the network write
  });
});

test.describe("listReservations (read seam)", () => {
  test("parses RLS-scoped rows through the zod boundary", async () => {
    const { client } = fakeSupabase({ rows: [validRow] });
    const rows = await listReservations(client, "prop-1");
    expect(rows).toHaveLength(1);
    expect(rows[0].reservation_id).toBe("res-1");
  });

  test("throws on a PostgREST error rather than returning []", async () => {
    const { client } = fakeSupabase({ selectError: new Error("permission denied") });
    await expect(listReservations(client, "prop-1")).rejects.toThrow();
  });
});

test.describe("isPermissionError", () => {
  test("classifies RLS / permission denials as permission errors", () => {
    for (const m of [
      "permission denied (42501)",
      "new row violates row-level security policy",
      "owner only",
      "permission denied for table reservations",
    ]) {
      expect(isPermissionError(m)).toBe(true);
    }
  });

  test("does not classify a generic failure as a permission error", () => {
    expect(isPermissionError("network timeout")).toBe(false);
    expect(isPermissionError("could not parse response")).toBe(false);
  });
});

test.describe("reservations route guard", () => {
  test("unauthenticated /es/dashboard/reservations redirects to login", async ({ page }) => {
    await page.goto("/es/dashboard/reservations");
    await expect(page).toHaveURL(/\/es\/login(\?|$)/);
  });
});
