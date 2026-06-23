import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Conversations read-model for the dashboard B4 slice (READ-ONLY).
 *
 * Every read goes through PostgREST under RLS (the mig-080 `has_dashboard_access`
 * SELECT policies on conversations / messages / tasks / guest_profiles). There
 * are no writes this slice, so no owner|staff gate is needed — a viewer can read.
 * The Supabase client is injected (server client for page reads, browser client
 * for nothing here — Realtime lives in `realtime.ts`) so this module imports
 * only `zod` and stays unit-testable outside a browser.
 *
 * Three filters (master plan §B4): `conversation_state`, `escalated`
 * (= the conversation has an OPEN `task_type='escalation'` task — escalation is
 * NOT a conversation column), and a date range on `last_message_at` resolved in
 * the property's local timezone (D-A11), not UTC, so the day boundary doesn't
 * slip at the Mexico offset.
 */

// ── Conversation states (mig 001 `conversation_state` CHECK comment) ──

// The lifecycle states a conversation moves through. Drives the filter dropdown
// and validates the `?state=` query param (an unknown value is ignored, not 500).
export const CONVERSATION_STATES = [
  "new",
  "inquiry",
  "booking_flow",
  "pending_staff_approval",
  "confirmed",
  "pre_arrival",
  "checked_in",
  "post_stay",
  "closed",
] as const;
export type ConversationState = (typeof CONVERSATION_STATES)[number];

// Open task statuses (mig 001 `tasks.status` CHECK). A conversation counts as
// "escalated" only while its escalation task is still open.
export const OPEN_TASK_STATUSES = ["pending", "in_progress"] as const;

export const DEFAULT_PAGE_SIZE = 20;

// ── Filter + pagination parsing (pure) ───────────────────────────────

export type ConversationFilters = {
  state: ConversationState | null;
  escalated: boolean;
  from: string | null; // YYYY-MM-DD (property-local civil date)
  to: string | null; // YYYY-MM-DD (inclusive)
};

const CIVIL_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function asString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Normalize raw search params into a validated filter set. Unknown states and
 * malformed dates are dropped (treated as "no filter") rather than trusted into
 * a query — the dropdown can only emit valid states, but a hand-typed URL can't
 * be allowed to reach PostgREST unchecked.
 */
export function normalizeFilters(
  raw: Record<string, string | string[] | undefined>,
): ConversationFilters {
  const rawState = asString(raw.state);
  const state =
    rawState && (CONVERSATION_STATES as readonly string[]).includes(rawState)
      ? (rawState as ConversationState)
      : null;
  const from = matchCivilDate(asString(raw.from));
  const to = matchCivilDate(asString(raw.to));
  return { state, escalated: asString(raw.escalated) === "1", from, to };
}

function matchCivilDate(value: string | undefined): string | null {
  return value && CIVIL_DATE_RE.test(value) ? value : null;
}

/** Clamp `?page=` to a 1-based integer (junk → page 1). */
export function parsePage(value: string | string[] | undefined): number {
  const n = Number(asString(value));
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export type PageMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  fromIndex: number; // 1-based index of the first row on this page (0 if empty)
  toIndex: number; // 1-based index of the last row on this page
};

/** Pagination math from the current page + the PostgREST exact `count`. Pure. */
export function buildPageMeta(page: number, pageSize: number, total: number): PageMeta {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clamped = Math.min(Math.max(1, page), totalPages);
  const fromIndex = total === 0 ? 0 : (clamped - 1) * pageSize + 1;
  const toIndex = Math.min(clamped * pageSize, total);
  return {
    page: clamped,
    pageSize,
    total,
    totalPages,
    hasPrev: clamped > 1,
    hasNext: clamped < totalPages,
    fromIndex,
    toIndex,
  };
}

// ── Property-local date range → UTC instants (D-A11) ─────────────────

/**
 * The wall-clock offset (ms) of `timeZone` at `instant`: (local time) − (UTC).
 * America/Mexico_City → −21_600_000 (−6h). Standard `formatToParts` round-trip.
 */
function zoneOffsetMs(timeZone: string, instant: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, number> = {};
  for (const p of dtf.formatToParts(instant)) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  const asUtc = Date.UTC(map.year, map.month - 1, map.day, map.hour, map.minute, map.second);
  return asUtc - instant.getTime();
}

/** The UTC instant (ISO) of property-local 00:00:00 on `civilDate` (YYYY-MM-DD). */
export function zonedStartOfDayUtc(timeZone: string, civilDate: string): string {
  const guessMs = Date.parse(`${civilDate}T00:00:00Z`); // pretend local == UTC
  let offset: number;
  try {
    offset = zoneOffsetMs(timeZone, new Date(guessMs));
  } catch {
    offset = 0; // invalid tz → treat the civil date as UTC
  }
  return new Date(guessMs - offset).toISOString();
}

function nextCivilDate(civilDate: string): string {
  return new Date(Date.parse(`${civilDate}T00:00:00Z`) + 86_400_000)
    .toISOString()
    .slice(0, 10);
}

export type UtcRange = { gte: string | null; lt: string | null };

/**
 * Translate the inclusive `from`/`to` civil-date filter into a half-open UTC
 * range `[gte, lt)` on `last_message_at`, with both boundaries taken at
 * property-local midnight. `to` is inclusive → `lt` is the start of the day
 * AFTER `to`.
 */
export function zonedDayRangeToUtc(
  timeZone: string,
  from: string | null,
  to: string | null,
): UtcRange {
  return {
    gte: from ? zonedStartOfDayUtc(timeZone, from) : null,
    lt: to ? zonedStartOfDayUtc(timeZone, nextCivilDate(to)) : null,
  };
}

// ── Display formatting (property-local, D-A11) ───────────────────────

/** A timestamptz rendered in the property's timezone (es-MX), e.g. "23 jun, 14:30". */
export function formatDateTime(iso: string | null | undefined, timeZone: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  try {
    return new Intl.DateTimeFormat("es-MX", {
      timeZone,
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 16).replace("T", " ");
  }
}

// ── Read boundaries (zod) + projection contracts (RC-1) ──────────────

const guestBriefSchema = z
  .object({
    name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

export const conversationListRowSchema = z.object({
  conversation_id: z.string(),
  conversation_state: z.string(),
  ai_handled: z.boolean(),
  staff_takeover_at: z.string().nullable().optional(),
  last_message_at: z.string(),
  last_guest_inbound_at: z.string().nullable().optional(),
  closed_at: z.string().nullable().optional(),
  created_at: z.string(),
  channel_type: z.string(),
  reservation_id: z.string().nullable().optional(),
  guest_id: z.string(),
  guest_profiles: guestBriefSchema,
});
export type ConversationListRow = z.infer<typeof conversationListRowSchema>;

// Every column the schema above reads MUST appear here (RC-1 projection contract).
export const CONVERSATION_LIST_SELECT =
  "conversation_id, conversation_state, ai_handled, staff_takeover_at, last_message_at, " +
  "last_guest_inbound_at, closed_at, created_at, channel_type, reservation_id, guest_id, " +
  "guest_profiles(name, phone)";

const guestDetailSchema = z
  .object({
    name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    language_preference: z.string().nullable().optional(),
    total_stays: z.number().nullable().optional(),
    total_messages: z.number().nullable().optional(),
    first_contact_at: z.string().nullable().optional(),
    last_contact_at: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

export const conversationDetailRowSchema = z.object({
  conversation_id: z.string(),
  property_id: z.string(),
  conversation_state: z.string(),
  ai_handled: z.boolean(),
  staff_takeover_at: z.string().nullable().optional(),
  first_message_at: z.string().nullable().optional(),
  last_message_at: z.string(),
  last_guest_inbound_at: z.string().nullable().optional(),
  closed_at: z.string().nullable().optional(),
  created_at: z.string(),
  channel_type: z.string(),
  reservation_id: z.string().nullable().optional(),
  guest_id: z.string(),
  guest_profiles: guestDetailSchema,
});
export type ConversationDetailRow = z.infer<typeof conversationDetailRowSchema>;

export const CONVERSATION_DETAIL_SELECT =
  "conversation_id, property_id, conversation_state, ai_handled, staff_takeover_at, " +
  "first_message_at, last_message_at, last_guest_inbound_at, closed_at, created_at, " +
  "channel_type, reservation_id, guest_id, " +
  "guest_profiles(name, phone, email, language_preference, total_stays, total_messages, " +
  "first_contact_at, last_contact_at)";

export const messageRowSchema = z.object({
  message_id: z.string(),
  sender_type: z.string(),
  text: z.string(),
  intent: z.string().nullable().optional(),
  ai_model: z.string().nullable().optional(),
  created_at: z.string(),
});
export type MessageRow = z.infer<typeof messageRowSchema>;

export const MESSAGE_SELECT = "message_id, sender_type, text, intent, ai_model, created_at";

export const taskRowSchema = z.object({
  task_id: z.string(),
  task_type: z.string(),
  status: z.string(),
  priority: z.string(),
  title: z.string(),
  due_at: z.string().nullable().optional(),
  created_at: z.string(),
});
export type TaskRow = z.infer<typeof taskRowSchema>;

export const TASK_SELECT = "task_id, task_type, status, priority, title, due_at, created_at";

// Cap a thread read so a runaway conversation can't pull unbounded rows.
export const MESSAGE_THREAD_LIMIT = 500;

// ── Reads ────────────────────────────────────────────────────────────

/**
 * The conversation_ids that currently have an OPEN escalation task (the
 * `escalated` filter set). RLS-scoped; deduped; nulls dropped. Returned to the
 * caller so a paginated `conversations` read can `.in()`-restrict to them.
 */
export async function loadEscalatedConversationIds(
  supabase: SupabaseClient,
  propertyId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("conversation_id")
    .eq("property_id", propertyId)
    .eq("task_type", "escalation")
    .in("status", OPEN_TASK_STATUSES as unknown as string[])
    .not("conversation_id", "is", null);
  if (error) throw error;
  const ids = new Set<string>();
  for (const row of (data ?? []) as Array<{ conversation_id: string | null }>) {
    if (row.conversation_id) ids.add(row.conversation_id);
  }
  return [...ids];
}

export type ConversationListParams = {
  state: ConversationState | null;
  restrictIds: string[] | null; // non-null → `.in(conversation_id, …)` (escalated filter)
  range: UtcRange;
  page: number;
  pageSize: number;
};

export type ConversationListResult = {
  rows: ConversationListRow[];
  total: number;
};

/**
 * A page of conversations for a property, RLS-scoped, newest-activity first,
 * with the filters applied and an exact total for pagination. The
 * `property_id` predicate is defense-in-depth; the RLS SELECT policy is the
 * tenant fence.
 */
export async function listConversations(
  supabase: SupabaseClient,
  propertyId: string,
  params: ConversationListParams,
): Promise<ConversationListResult> {
  const offset = (params.page - 1) * params.pageSize;
  let query = supabase
    .from("conversations")
    .select(CONVERSATION_LIST_SELECT, { count: "exact" })
    .eq("property_id", propertyId);

  if (params.state) query = query.eq("conversation_state", params.state);
  if (params.restrictIds) query = query.in("conversation_id", params.restrictIds);
  if (params.range.gte) query = query.gte("last_message_at", params.range.gte);
  if (params.range.lt) query = query.lt("last_message_at", params.range.lt);

  const { data, count, error } = await query
    .order("last_message_at", { ascending: false })
    .range(offset, offset + params.pageSize - 1);
  if (error) throw error;

  return {
    rows: z.array(conversationListRowSchema).parse(data ?? []),
    total: count ?? 0,
  };
}

/** A single conversation with its guest (RLS-scoped). `null` = absent or no access. */
export async function loadConversationDetail(
  supabase: SupabaseClient,
  conversationId: string,
): Promise<ConversationDetailRow | null> {
  const { data, error } = await supabase
    .from("conversations")
    .select(CONVERSATION_DETAIL_SELECT)
    .eq("conversation_id", conversationId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return conversationDetailRowSchema.parse(data);
}

/** A conversation's message thread, oldest first (RLS-scoped, capped). */
export async function loadConversationMessages(
  supabase: SupabaseClient,
  conversationId: string,
): Promise<MessageRow[]> {
  const { data, error } = await supabase
    .from("messages")
    .select(MESSAGE_SELECT)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(MESSAGE_THREAD_LIMIT);
  if (error) throw error;
  return z.array(messageRowSchema).parse(data ?? []);
}

/** A conversation's tasks, newest first (RLS-scoped). */
export async function loadConversationTasks(
  supabase: SupabaseClient,
  conversationId: string,
): Promise<TaskRow[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_SELECT)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return z.array(taskRowSchema).parse(data ?? []);
}

/** True while a task is still open (drives the escalated badge in the panel). */
export function isOpenTask(status: string): boolean {
  return (OPEN_TASK_STATUSES as readonly string[]).includes(status);
}

/**
 * The querystring (no leading "?") that re-applies the current filters at a
 * given page — used for the pagination links so paging keeps the filter set.
 * Empty filters + page 1 → "" (a clean URL). Pure.
 */
export function buildFilterQuery(filters: ConversationFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.state) params.set("state", filters.state);
  if (filters.escalated) params.set("escalated", "1");
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (page > 1) params.set("page", String(page));
  return params.toString();
}
