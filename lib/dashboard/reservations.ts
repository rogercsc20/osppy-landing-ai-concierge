import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Reservations data layer for the dashboard B2 slice.
 *
 * Reads go through PostgREST under RLS (the `reservations_dashboard_read`
 * SELECT policy). Writes go through the `create_manual_reservation()` RPC
 * (mig 082): the browser has SELECT-only on `guest_profiles`, so a manual
 * booking's NOT-NULL guest_id can only be satisfied by the SECURITY DEFINER
 * RPC, which upserts the guest + inserts the reservation atomically and
 * enforces the owner|staff tenant fence itself (RAISE 42501).
 *
 * The Supabase client is injected (server client for reads, browser client
 * for the mutation) so this module imports only `zod` and stays unit-testable
 * outside a browser. Validation here mirrors the RPC's defensive guards —
 * the RPC is the real gate; zod is the fast, friendly first line.
 */

// E.164: '+' then a non-zero country digit, up to 15 digits total.
const E164 = /^\+[1-9]\d{1,14}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;
const MONEY = /^\d+(\.\d{1,2})?$/;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Mirrors the reservations.booking_source CHECK (mig 072) — the subset a human
// would enter from the dashboard (manual desk/phone/walk-in or a logged OTA).
export const BOOKING_SOURCES = [
  "manual",
  "booking_com",
  "expedia",
  "airbnb",
  "other",
] as const;

// reservations.outbound_consent_source CHECK (mig 068) — the D12 affordance.
export const CONSENT_SOURCES = [
  "manual_booking",
  "guest_initiated",
  "ota_booking",
] as const;

// The two states a *new* booking can be entered in; checked_in/out/no_show are
// board transitions, not create-time choices.
export const CREATE_STATUSES = ["confirmed", "tentative"] as const;

/**
 * Form schema. Numeric/date fields are typed as strings (HTML input values) and
 * validated by shape, so `z.input === z.output` and react-hook-form's typing
 * stays clean. Coercion to the RPC's numeric args happens in {@link toRpcArgs}.
 */
export const reservationFormSchema = z
  .object({
    guestName: z.string().trim().min(1, "required"),
    guestPhone: z.string().trim().regex(E164, "phone"),
    guestEmail: z
      .string()
      .trim()
      .refine((v) => v === "" || EMAIL.test(v), "email"),
    roomId: z.string(), // "" → no specific room (room_id nullable)
    roomCode: z.string().trim().min(1, "required"),
    checkIn: z.string().regex(ISO_DATE, "date"),
    checkOut: z.string().regex(ISO_DATE, "date"),
    numGuests: z
      .string()
      .regex(/^\d+$/, "number")
      .refine((v) => Number(v) >= 1, "min1"),
    totalPriceMxn: z.string().regex(MONEY, "money"),
    amountPaidMxn: z
      .string()
      .refine((v) => v === "" || MONEY.test(v), "money"),
    depositAmountMxn: z
      .string()
      .refine((v) => v === "" || MONEY.test(v), "money"),
    arrivalEta: z.string().refine((v) => v === "" || HH_MM.test(v), "time"),
    bookingSource: z.enum(BOOKING_SOURCES),
    outboundConsentSource: z.enum(CONSENT_SOURCES),
    status: z.enum(CREATE_STATUSES),
    specialRequests: z.string().trim(),
  })
  .refine((v) => v.checkOut > v.checkIn, {
    path: ["checkOut"],
    message: "checkoutAfter",
  })
  .refine(
    (v) => v.amountPaidMxn === "" || Number(v.amountPaidMxn) <= Number(v.totalPriceMxn),
    { path: ["amountPaidMxn"], message: "paidOverTotal" },
  );

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;

/** Sensible empty form (all fields present → clean rhf typing, no `.default()`). */
export const emptyReservationForm: ReservationFormValues = {
  guestName: "",
  guestPhone: "",
  guestEmail: "",
  roomId: "",
  roomCode: "",
  checkIn: "",
  checkOut: "",
  numGuests: "1",
  totalPriceMxn: "",
  amountPaidMxn: "",
  depositAmountMxn: "",
  arrivalEta: "",
  bookingSource: "manual",
  outboundConsentSource: "manual_booking",
  status: "confirmed",
  specialRequests: "",
};

/** The mig-082 RPC argument object (PostgREST binds these by name). */
export type ManualReservationRpcArgs = {
  p_property_id: string;
  p_guest_name: string;
  p_room_code: string;
  p_check_in: string;
  p_check_out: string;
  p_num_guests: number;
  p_total_price_mxn: number;
  p_guest_phone: string | null;
  p_guest_email: string | null;
  p_room_id: string | null;
  p_amount_paid_mxn: number;
  p_deposit_amount_mxn: number | null;
  p_booking_source: string;
  p_outbound_consent_source: string;
  p_special_requests: string | null;
  p_arrival_eta: string | null;
  p_status: string;
  p_currency: string;
};

const nullIfBlank = (v: string): string | null => (v.trim() === "" ? null : v.trim());

/** Pure form-values → RPC-args mapper. Coerces the string inputs to numbers. */
export function toRpcArgs(
  values: ReservationFormValues,
  propertyId: string,
): ManualReservationRpcArgs {
  return {
    p_property_id: propertyId,
    p_guest_name: values.guestName.trim(),
    p_room_code: values.roomCode.trim(),
    p_check_in: values.checkIn,
    p_check_out: values.checkOut,
    p_num_guests: Number(values.numGuests),
    p_total_price_mxn: Number(values.totalPriceMxn),
    p_guest_phone: nullIfBlank(values.guestPhone),
    p_guest_email: nullIfBlank(values.guestEmail),
    p_room_id: nullIfBlank(values.roomId),
    p_amount_paid_mxn: values.amountPaidMxn === "" ? 0 : Number(values.amountPaidMxn),
    p_deposit_amount_mxn:
      values.depositAmountMxn === "" ? null : Number(values.depositAmountMxn),
    p_booking_source: values.bookingSource,
    p_outbound_consent_source: values.outboundConsentSource,
    p_special_requests: nullIfBlank(values.specialRequests),
    p_arrival_eta: nullIfBlank(values.arrivalEta),
    p_status: values.status,
    p_currency: "MXN",
  };
}

// ── Read boundary ────────────────────────────────────────────────────

/** Lenient row schema for the list (PostgREST returns DECIMAL as a string). */
export const reservationRowSchema = z.object({
  reservation_id: z.string(),
  guest_name: z.string(),
  guest_phone: z.string().nullable().optional(),
  room_code: z.string().nullable().optional(),
  check_in: z.string(),
  check_out: z.string(),
  num_guests: z.number(),
  num_nights: z.number().nullable().optional(),
  total_price_mxn: z.union([z.string(), z.number()]).nullable().optional(),
  status: z.string(),
  payment_status: z.string().nullable().optional(),
  booking_source: z.string().nullable().optional(),
});

export type ReservationRow = z.infer<typeof reservationRowSchema>;

export const RESERVATION_LIST_SELECT =
  "reservation_id, guest_name, guest_phone, room_code, check_in, check_out, " +
  "num_guests, num_nights, total_price_mxn, status, payment_status, booking_source";

/** Roster of a property's reservations (most recent arrival first), RLS-scoped. */
export async function listReservations(
  supabase: SupabaseClient,
  propertyId: string,
): Promise<ReservationRow[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select(RESERVATION_LIST_SELECT)
    .eq("property_id", propertyId)
    .order("check_in", { ascending: false })
    .limit(200);
  if (error) throw error;
  return z.array(reservationRowSchema).parse(data ?? []);
}

/** Room options for the form's room picker (RLS-scoped). */
export type RoomOption = { room_id: string; room_code: string; room_name: string };

export async function listRooms(
  supabase: SupabaseClient,
  propertyId: string,
): Promise<RoomOption[]> {
  const { data, error } = await supabase
    .from("property_rooms")
    .select("room_id, room_code, room_name")
    .eq("property_id", propertyId)
    .order("room_code", { ascending: true });
  if (error) throw error;
  return (data ?? []) as RoomOption[];
}

/**
 * Create a manual booking via the mig-082 RPC. Validates first (fast, friendly),
 * then the RPC enforces the real owner|staff fence + atomic guest upsert.
 * Returns the inserted reservation row.
 */
export async function createManualReservation(
  supabase: SupabaseClient,
  propertyId: string,
  values: ReservationFormValues,
): Promise<ReservationRow> {
  const parsed = reservationFormSchema.parse(values);
  const { data, error } = await supabase.rpc(
    "create_manual_reservation",
    toRpcArgs(parsed, propertyId),
  );
  if (error) throw error;
  // PostgREST returns the SETOF/composite as the row object (or a 1-elem array).
  const row = Array.isArray(data) ? data[0] : data;
  return reservationRowSchema.parse(row);
}
