import { test, expect } from "@playwright/test";
import {
  emptyReservationForm,
  reservationFormSchema,
  toRpcArgs,
  type ReservationFormValues,
} from "../lib/dashboard/reservations";

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
});

test.describe("reservations route guard", () => {
  test("unauthenticated /es/dashboard/reservations redirects to login", async ({ page }) => {
    await page.goto("/es/dashboard/reservations");
    await expect(page).toHaveURL(/\/es\/login(\?|$)/);
  });
});
