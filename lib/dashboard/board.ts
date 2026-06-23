import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Today-board data layer for the dashboard B3 slice.
 *
 * Reads (today's arrivals/departures + the lifecycle ledger) go through
 * PostgREST under RLS (the mig-080 `*_dashboard_*` SELECT policies). The status
 * write (check-in / check-out / no-show) is a `reservations` UPDATE fenced by
 * the `reservations_dashboard_update` policy (owner|staff) — no migration this
 * slice. The Supabase client is injected (server client for reads, browser
 * client for the mutation) so this module imports only `zod` and stays
 * unit-testable outside a browser.
 *
 * The "today" boundary is computed in the property's local timezone (D-A11),
 * not UTC, so arrivals/departures don't slip a day at the Mexico offset.
 */

// ── "Today" in the property's timezone ───────────────────────────────

/**
 * The civil date (YYYY-MM-DD) at `now` in `timeZone`. Pure: pass a fixed `now`
 * in tests. Uses the `en-CA` locale because it formats as ISO `YYYY-MM-DD`.
 * Falls back to a UTC slice if the timezone string is somehow invalid (the DB
 * column defaults to `America/Mexico_City`, so this is just belt-and-braces).
 */
export function todayInTimeZone(timeZone: string, now: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

const DEFAULT_TIMEZONE = "America/Mexico_City";

/** The property's IANA timezone (RLS-scoped read); the house default on miss. */
export async function loadPropertyTimezone(
  supabase: SupabaseClient,
  propertyId: string,
): Promise<string> {
  try {
    const { data } = await supabase
      .from("properties")
      .select("timezone")
      .eq("property_id", propertyId)
      .maybeSingle();
    const tz = (data as { timezone?: string } | null)?.timezone;
    return tz && tz.trim() !== "" ? tz : DEFAULT_TIMEZONE;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

// ── Lifecycle chips (from the lifecycle_sends ledger, mig 070) ────────

// The guest-facing lifecycle messages a chip can represent. `staff_notify` is
// an internal alert, not a guest-facing step → deliberately excluded.
export const LIFECYCLE_TRIGGERS = [
  "arrival_ask", // M1
  "access_info", // M3
  "checkout_reminder", // M7
  "review_ask", // M8
] as const;
export type LifecycleTrigger = (typeof LIFECYCLE_TRIGGERS)[number];

// Which chips each board column surfaces (A3 chip-state matrix).
export const ARRIVAL_CHIP_TRIGGERS: readonly LifecycleTrigger[] = [
  "arrival_ask",
  "access_info",
];
export const DEPARTURE_CHIP_TRIGGERS: readonly LifecycleTrigger[] = [
  "checkout_reminder",
  "review_ask",
];

// A lifecycle_sends.status counts as "delivered to the guest" for the chip.
// `failed` / `suppressed` do not → those render as Absent ("—").
const SENT_STATUSES = new Set(["sent", "delivered", "read"]);

export type ChipState = "replied" | "sent" | "absent";

/**
 * Chip state for the rows of a single (reservation_id, trigger) group:
 *   Replied — any row has `replied_at`
 *   Sent    — any row has status ∈ {sent, delivered, read}
 *   Absent  — no rows, or only failed/suppressed → render "—"
 */
export function computeChip(rows: LifecycleSendRow[]): ChipState {
  if (rows.some((r) => r.replied_at != null && r.replied_at !== "")) return "replied";
  if (rows.some((r) => SENT_STATUSES.has(r.status))) return "sent";
  return "absent";
}

export type ChipMap = Record<LifecycleTrigger, ChipState>;

const ABSENT_CHIPS: ChipMap = {
  arrival_ask: "absent",
  access_info: "absent",
  checkout_reminder: "absent",
  review_ask: "absent",
};

/** Group a flat lifecycle_sends list into per-reservation, per-trigger chip states. */
export function buildChipMap(rows: LifecycleSendRow[]): Map<string, ChipMap> {
  // reservation_id → trigger → rows
  const grouped = new Map<string, Map<LifecycleTrigger, LifecycleSendRow[]>>();
  for (const row of rows) {
    if (!LIFECYCLE_TRIGGERS.includes(row.trigger as LifecycleTrigger)) continue;
    const trigger = row.trigger as LifecycleTrigger;
    let byTrigger = grouped.get(row.reservation_id);
    if (!byTrigger) {
      byTrigger = new Map();
      grouped.set(row.reservation_id, byTrigger);
    }
    const list = byTrigger.get(trigger);
    if (list) list.push(row);
    else byTrigger.set(trigger, [row]);
  }

  const result = new Map<string, ChipMap>();
  for (const [reservationId, byTrigger] of grouped) {
    const chips: ChipMap = { ...ABSENT_CHIPS };
    for (const trigger of LIFECYCLE_TRIGGERS) {
      const list = byTrigger.get(trigger);
      if (list && list.length > 0) chips[trigger] = computeChip(list);
    }
    result.set(reservationId, chips);
  }
  return result;
}

// ── Status actions (board check-in/out/no-show) ──────────────────────

/**
 * Status transition → the lifecycle timestamp column it stamps. Byte-for-byte
 * the backend `_STATUS_TIMESTAMP_COLUMNS` (`repositories/reservations.py`) so
 * the dashboard write and the bot's owner-confirm write agree; `no_show` stamps
 * nothing.
 */
const STATUS_TIMESTAMP_COLUMNS: Record<string, string> = {
  confirmed: "confirmed_at",
  checked_in: "checked_in_at",
  checked_out: "checked_out_at",
  cancelled: "cancelled_at",
};

// The board's three one-tap transitions.
export type BoardAction = "checked_in" | "checked_out" | "no_show";

/**
 * The transitions a card offers, derived from its current status (terminal
 * states offer none). Pure → drives both the UI and a unit test.
 */
export function availableActions(status: string): BoardAction[] {
  if (status === "tentative" || status === "confirmed") return ["checked_in", "no_show"];
  if (status === "checked_in") return ["checked_out"];
  return [];
}

/**
 * Transition a reservation's status, stamping the matching lifecycle timestamp.
 * Scoped by `property_id` (RLS also fences it) and gated to owner|staff by the
 * `reservations_dashboard_update` WITH CHECK — a viewer / cross-tenant caller
 * gets a PostgREST RLS error, surfaced as a friendly notice by the card.
 */
export async function updateReservationStatus(
  supabase: SupabaseClient,
  reservationId: string,
  propertyId: string,
  status: BoardAction,
): Promise<void> {
  const updates: Record<string, unknown> = { status };
  const tsColumn = STATUS_TIMESTAMP_COLUMNS[status];
  if (tsColumn) updates[tsColumn] = new Date().toISOString();

  const { error } = await supabase
    .from("reservations")
    .update(updates)
    .eq("reservation_id", reservationId)
    .eq("property_id", propertyId);
  if (error) throw error;
}

// ── Read boundary ────────────────────────────────────────────────────

/** Lenient board-row schema (PostgREST returns DATE/optional cols as strings/null). */
export const boardReservationRowSchema = z.object({
  reservation_id: z.string(),
  guest_name: z.string(),
  guest_phone: z.string().nullable().optional(),
  room_code: z.string().nullable().optional(),
  check_in: z.string(),
  check_out: z.string(),
  num_guests: z.number(),
  status: z.string(),
  arrival_eta: z.string().nullable().optional(),
  // SL-7 iCal marker — set ONLY by feed ingestion (manual rows leave it NULL).
  // The board uses it (with guest_phone/guest_name) to flag a "needs info"
  // card via `isIncomplete` (B6); a completed/manual row never matches.
  source_feed_id: z.string().nullable().optional(),
});

export type BoardReservationRow = z.infer<typeof boardReservationRowSchema>;

export const BOARD_RESERVATION_SELECT =
  "reservation_id, guest_name, guest_phone, room_code, check_in, check_out, " +
  "num_guests, status, arrival_eta, source_feed_id";

export const lifecycleSendRowSchema = z.object({
  reservation_id: z.string(),
  trigger: z.string(),
  status: z.string(),
  sent_at: z.string().nullable().optional(),
  replied_at: z.string().nullable().optional(),
});

export type LifecycleSendRow = z.infer<typeof lifecycleSendRowSchema>;

export const LIFECYCLE_SEND_SELECT = "reservation_id, trigger, status, sent_at, replied_at";

/** A reservation card with its lifecycle chips resolved. */
export type BoardCard = BoardReservationRow & { chips: ChipMap };

export type TodayBoard = {
  today: string;
  arrivals: BoardCard[];
  departures: BoardCard[];
  inHouseCount: number;
};

/**
 * Partition the relevant reservations (already RLS-scoped) into the today
 * board, attaching each card's lifecycle chips. Pure → exercised directly by a
 * seam test with canned rows. `cancelled` rows are dropped from the columns
 * (not an operational arrival/departure); in-house = anyone `checked_in`.
 */
export function buildTodayBoard(
  today: string,
  reservations: BoardReservationRow[],
  sends: LifecycleSendRow[],
): TodayBoard {
  const chipMap = buildChipMap(sends);
  const cards: BoardCard[] = reservations.map((r) => ({
    ...r,
    chips: chipMap.get(r.reservation_id) ?? { ...ABSENT_CHIPS },
  }));

  const live = cards.filter((c) => c.status !== "cancelled");
  const arrivals = live
    .filter((c) => c.check_in === today)
    .sort(byEtaThenName);
  const departures = live
    .filter((c) => c.check_out === today)
    .sort((a, b) => a.guest_name.localeCompare(b.guest_name));
  const inHouseCount = cards.filter((c) => c.status === "checked_in").length;

  return { today, arrivals, departures, inHouseCount };
}

// Arrivals sort by ETA (earliest first; no-ETA last), then name.
function byEtaThenName(a: BoardCard, b: BoardCard): number {
  const ea = a.arrival_eta ?? "";
  const eb = b.arrival_eta ?? "";
  if (ea !== eb) {
    if (ea === "") return 1;
    if (eb === "") return -1;
    return ea < eb ? -1 : 1;
  }
  return a.guest_name.localeCompare(b.guest_name);
}

/**
 * Load the today board for a property: the day's arrivals/departures + anyone
 * currently in-house, plus the lifecycle ledger for those rows. One reservations
 * read (`check_in = today OR check_out = today OR status = checked_in`) + one
 * lifecycle_sends read scoped to those reservations.
 */
export async function loadTodayBoard(
  supabase: SupabaseClient,
  propertyId: string,
  today: string,
): Promise<TodayBoard> {
  const { data, error } = await supabase
    .from("reservations")
    .select(BOARD_RESERVATION_SELECT)
    .eq("property_id", propertyId)
    .or(`check_in.eq.${today},check_out.eq.${today},status.eq.checked_in`)
    .order("guest_name", { ascending: true })
    .limit(300);
  if (error) throw error;
  const reservations = z.array(boardReservationRowSchema).parse(data ?? []);

  const ids = reservations.map((r) => r.reservation_id);
  const sends = ids.length > 0 ? await loadLifecycleSends(supabase, propertyId, ids) : [];

  return buildTodayBoard(today, reservations, sends);
}

/** The lifecycle ledger rows for a set of reservations (RLS-scoped). */
export async function loadLifecycleSends(
  supabase: SupabaseClient,
  propertyId: string,
  reservationIds: string[],
): Promise<LifecycleSendRow[]> {
  const { data, error } = await supabase
    .from("lifecycle_sends")
    .select(LIFECYCLE_SEND_SELECT)
    .eq("property_id", propertyId)
    .in("reservation_id", reservationIds);
  if (error) throw error;
  return z.array(lifecycleSendRowSchema).parse(data ?? []);
}
