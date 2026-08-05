import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ACTIVE_PROPERTY_COOKIE,
  type PropertyOption,
} from "@/components/dashboard/PropertySwitcher";

/**
 * Shared dashboard membership resolution — used by the dashboard layout (shell
 * property switcher) and every data page (which needs the active property +
 * the caller's role on it). One copy so the two can never drift.
 *
 * Both queries run as role `authenticated` under RLS — but RLS alone does NOT
 * scope `dashboard_users` to the caller's own rows (the owner-read policy ORs
 * in every member's rows; see the comment inside `loadMemberships`), so the
 * explicit `user_id` fence there is load-bearing (TD-2 / inventory P1-7).
 */
export type Membership = PropertyOption & { role: string };

export async function loadMemberships(
  supabase: SupabaseClient,
  userId?: string,
): Promise<Membership[]> {
  // TD-2 (inventory P1-7, cockpit's fix backported): the user fence is
  // LOAD-BEARING, and RLS does not supply it. Two SELECT policies OR together
  // on dashboard_users: `dashboard_users_self_read` (mig 079 — your own rows)
  // and `dashboard_users_owner_read` (mig 080 — an owner reads EVERY row for
  // their property, which is what a future team screen needs). So for an
  // owner this query without a user filter returns one row per MEMBER: the
  // same property repeats, and `resolveActiveProperty` below would read its
  // role off a row belonging to someone else. The only visible symptom today
  // is a duplicate React key — but with one `staff` member on the property,
  // an owner's capabilities become a function of row order.
  //
  // Caller-supplied `userId` when the caller already has the user; otherwise
  // resolved here. Never omitted — an unfenced read is not a fallback, so a
  // failure to resolve throws.
  const uid = userId ?? (await supabase.auth.getUser()).data.user?.id;
  if (!uid) {
    throw new Error("loadMemberships: no authenticated user to scope the read");
  }

  // PostgREST returns failures IN-BAND as `error` (no throw), so a swallowed
  // `{ data }` would turn an RLS/network failure into [] — which the layout
  // renders as the permanent "no access" screen, indistinguishable from a
  // genuine zero-membership account. Surface real failures (they propagate to
  // the dashboard error.tsx boundary); reserve [] strictly for a true zero-row
  // read. Mirrors the `if (error) throw error` house pattern every other
  // lib/dashboard read follows.
  const [{ data: rows, error: rowsError }, { data: props, error: propsError }] =
    await Promise.all([
      supabase
        .from("dashboard_users")
        .select("property_id, role")
        .eq("user_id", uid)
        .eq("is_active", true),
      supabase.from("properties").select("property_id, name"),
    ]);
  if (rowsError) throw rowsError;
  if (propsError) throw propsError;

  const members = (rows ?? []) as Array<{ property_id: string; role: string }>;
  const names = new Map(
    ((props ?? []) as Array<{ property_id: string; name: string }>).map((p) => [
      p.property_id,
      p.name,
    ]),
  );
  return members.map((m) => ({
    property_id: m.property_id,
    role: m.role,
    name: names.get(m.property_id) ?? m.property_id,
  }));
}

export type ActiveContext = {
  activeId: string;
  role: string;
  memberships: Membership[];
};

/**
 * The active property for the current render: the cookie-pinned selection if
 * it's one the user actually has (validated against memberships), else the
 * first membership. Returns null when the user has no memberships at all.
 * Mirrors the layout's selection logic so a page and the shell agree.
 */
export async function resolveActiveProperty(
  supabase: SupabaseClient,
  userId?: string,
): Promise<ActiveContext | null> {
  const memberships = await loadMemberships(supabase, userId);
  if (memberships.length === 0) return null;

  const cookieStore = await cookies();
  const requested = cookieStore.get(ACTIVE_PROPERTY_COOKIE)?.value;
  const active =
    memberships.find((m) => m.property_id === requested) ?? memberships[0];

  return { activeId: active.property_id, role: active.role, memberships };
}

/** Capability gate mirroring the mig-080 reservations WITH CHECK (owner|staff). */
export function canWriteReservations(role: string): boolean {
  return role === "owner" || role === "staff";
}

/**
 * Settings-write gate — **owner only**, mirroring the mig-080
 * `property_configs_dashboard_update` policy (`USING (… ['owner'])`). NOT the
 * same as {@link canWriteReservations}: staff can write reservations but NOT
 * settings. The DB is the real fence; this just hides the form from non-owners.
 */
export function canWriteSettings(role: string): boolean {
  return role === "owner";
}
