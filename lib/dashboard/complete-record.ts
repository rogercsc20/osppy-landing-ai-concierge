import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isCanonicalizablePhone, toE164 } from "./phone";

/**
 * Complete-the-record data layer for the dashboard B6 slice.
 *
 * SL-7 ingests OTA iCal feeds into the one `reservations` truth, but OTA iCal
 * carries no contactable guest identity (Booking.com = dates only; Airbnb =
 * dates + last-4). So each ingested row lands with a PLACEHOLDER guest
 * (`guest_name` = "Reserva Airbnb ••1234", `guest_phone` = NULL — see
 * `app/jobs/ical_sync.py` + `repositories/reservations.upsert_reservation_by_ical_uid`)
 * and must be completed before the guest can be contacted. This slice surfaces
 * those rows and lets owner|staff fill in the real name + phone.
 *
 * **v1 scope (operator-ratified 2026-06-23): frontend-only, no migration.** The
 * complete-write updates the DENORMALIZED `reservations.guest_name` /
 * `guest_phone` columns through the existing `reservations_dashboard_update`
 * RLS policy (owner|staff, table-wide UPDATE — no column REVOKE). That makes
 * the guest reachable from the board's `tel:` / `wa.me` affordances (staff can
 * manually call/message). It does NOT update the `guest_profiles` row the BOT
 * reads for its automated lifecycle messages — that needs a SECURITY DEFINER
 * RPC (mig 083, deferred until iCal ingestion is actually live; Aura is
 * escalation-tier with no live feeds today, so there are zero such rows yet).
 *
 * The iCal marker is `source_feed_id IS NOT NULL` — the FK that ONLY iCal
 * ingestion sets (manual bookings via mig-082 leave it NULL). This is more
 * robust than matching a `booking_source` string.
 *
 * The Supabase client is injected (server client for reads, browser client for
 * the mutation) so this module imports only `zod` and stays unit-testable
 * outside a browser.
 */

// E.164: '+' then a non-zero country digit, up to 15 digits total. Same shape
// the ReservationForm uses (lib/dashboard/reservations.ts) and within the
// reservations.guest_phone VARCHAR(20) bound.
const E164 = /^\+[1-9]\d{1,14}$/;

// The placeholder guest names the SL-7 poller writes (`_guest_label` in
// app/jobs/ical_sync.py — tenant-AGNOSTIC, generated in shared backend code):
//   "Reserva Booking.com", "Reserva Airbnb", "Reserva OTA" (+ optional " ••1234").
// A row whose name still matches this shape has not been completed.
const PLACEHOLDER_NAME = /^Reserva (Booking\.com|Airbnb|OTA)\b/;

// ── "Needs info" predicate (pure) ────────────────────────────────────

/** The minimal shape `isIncomplete` reasons over (a superset of the read row). */
export type IncompleteCandidate = {
  source_feed_id?: string | null;
  guest_phone?: string | null;
  guest_name?: string | null;
  status?: string | null;
};

/** True when a row was ingested from an OTA iCal feed (vs entered manually). */
export function isIcalRow(row: IncompleteCandidate): boolean {
  return row.source_feed_id != null && String(row.source_feed_id).trim() !== "";
}

/** True when the guest has no contactable phone. */
export function isPhoneMissing(row: IncompleteCandidate): boolean {
  return row.guest_phone == null || row.guest_phone.trim() === "";
}

/** True when the guest name is still the SL-7 placeholder (or empty). */
export function isPlaceholderName(row: IncompleteCandidate): boolean {
  const name = row.guest_name?.trim() ?? "";
  return name === "" || PLACEHOLDER_NAME.test(name);
}

/**
 * A reservation "needs info" when it is an iCal-ingested row that still lacks a
 * real, contactable guest identity — no phone OR a placeholder name. Cancelled
 * rows are never surfaced (nothing to complete). Pure → drives both the read
 * filter and a unit test.
 */
export function isIncomplete(row: IncompleteCandidate): boolean {
  if (!isIcalRow(row)) return false;
  if (row.status === "cancelled") return false;
  return isPhoneMissing(row) || isPlaceholderName(row);
}

// ── Complete-record form (only the missing fields) ───────────────────

/**
 * Targeted form: ONLY the missing guest identity. The whole point is to make
 * the guest contactable, so both are required — name (a real identity, not the
 * placeholder) and a valid E.164 phone. Dates/room/price are NOT re-collected
 * (they came from the feed and are correct).
 */
export const completeRecordFormSchema = z
  .object({
    guestName: z.string().trim().min(1, "required").max(255, "tooLong"),
    // `+E.164` format gate + libphonenumber canonicalizability — so the
    // completed phone matches the pipeline's to_e164 (no duplicate guest) and
    // `toCompleteUpdate` can canonicalize without producing null.
    guestPhone: z.string().trim().regex(E164, "phone").refine(isCanonicalizablePhone, "phone"),
  })
  // Reject a name that is still the OTA placeholder shape — otherwise the write
  // "succeeds" but `isIncomplete` stays true, the row never leaves the list, and
  // the form is stuck. The whole point is a real, contactable identity.
  .refine((v) => !PLACEHOLDER_NAME.test(v.guestName.trim()), {
    path: ["guestName"],
    message: "placeholderName",
  });

export type CompleteRecordFormValues = z.infer<typeof completeRecordFormSchema>;

export const emptyCompleteRecordForm: CompleteRecordFormValues = {
  guestName: "",
  guestPhone: "",
};

/** The reservations columns the complete-write touches (denormalized guest_*). */
export type CompleteRecordUpdate = {
  guest_name: string;
  guest_phone: string;
};

/** Pure form-values → reservations UPDATE payload. */
export function toCompleteUpdate(values: CompleteRecordFormValues): CompleteRecordUpdate {
  // Canonical +E.164 — validation guarantees non-null; `?? ""` only narrows
  // the type (the CompleteRecordUpdate.guest_phone is a required string).
  return {
    guest_name: values.guestName.trim(),
    guest_phone: toE164(values.guestPhone) ?? "",
  };
}

// ── Read boundary ────────────────────────────────────────────────────

/** Lenient row schema (PostgREST returns DATE/optional cols as strings/null). */
export const incompleteReservationRowSchema = z.object({
  reservation_id: z.string(),
  guest_name: z.string().nullable().optional(),
  guest_phone: z.string().nullable().optional(),
  room_code: z.string().nullable().optional(),
  check_in: z.string(),
  check_out: z.string(),
  num_guests: z.number(),
  status: z.string(),
  booking_source: z.string().nullable().optional(),
  source_feed_id: z.string().nullable().optional(),
});

export type IncompleteReservationRow = z.infer<typeof incompleteReservationRowSchema>;

export const NEEDS_INFO_SELECT =
  "reservation_id, guest_name, guest_phone, room_code, check_in, check_out, " +
  "num_guests, status, booking_source, source_feed_id";

/**
 * The iCal-ingested rows still needing completion for a property (RLS-scoped).
 * Pushes the `source_feed_id IS NOT NULL` + not-cancelled filter to PostgREST,
 * then applies the full {@link isIncomplete} predicate in pure code (the
 * phone-missing-OR-placeholder-name part is awkward to express server-side).
 * Bounded to 200 — Aura has zero today, and a `capped`-style limit avoids an
 * unbounded read if a high-volume OTA tenant onboards.
 */
export async function listIncompleteReservations(
  supabase: SupabaseClient,
  propertyId: string,
): Promise<IncompleteReservationRow[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select(NEEDS_INFO_SELECT)
    .eq("property_id", propertyId)
    .not("source_feed_id", "is", null)
    .neq("status", "cancelled")
    .order("check_in", { ascending: true })
    .limit(200);
  if (error) throw error;
  const rows = z.array(incompleteReservationRowSchema).parse(data ?? []);
  return rows.filter(isIncomplete);
}

/**
 * Complete an iCal row's guest identity: write the real name + phone onto the
 * DENORMALIZED `reservations.guest_*` columns through the
 * `reservations_dashboard_update` RLS policy (owner|staff). Scoped by
 * `property_id` (RLS also fences it); a viewer / cross-tenant caller gets a
 * PostgREST RLS error, surfaced as a friendly notice by the form. Validates
 * first (fast, friendly) — the RLS policy is the real gate.
 *
 * NOTE (v1 scope): this does NOT touch the `guest_profiles` row the bot reads
 * for automated messaging — see the module docstring (mig 083, deferred).
 */
export async function completeRecord(
  supabase: SupabaseClient,
  propertyId: string,
  reservationId: string,
  values: CompleteRecordFormValues,
): Promise<void> {
  const parsed = completeRecordFormSchema.parse(values);
  const { error } = await supabase
    .from("reservations")
    .update(toCompleteUpdate(parsed))
    .eq("reservation_id", reservationId)
    .eq("property_id", propertyId);
  if (error) throw error;
}
