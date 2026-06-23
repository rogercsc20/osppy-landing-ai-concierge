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
 * Both queries run as role `authenticated` under RLS: `dashboard_users` is
 * filtered to the caller's own rows by `dashboard_users_self_read`, and
 * `properties` to readable ones by `has_dashboard_access` — so this can only
 * ever surface the caller's own memberships.
 */
export type Membership = PropertyOption & { role: string };

export async function loadMemberships(
  supabase: SupabaseClient,
): Promise<Membership[]> {
  try {
    const [{ data: rows }, { data: props }] = await Promise.all([
      supabase
        .from("dashboard_users")
        .select("property_id, role")
        .eq("is_active", true),
      supabase.from("properties").select("property_id, name"),
    ]);
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
  } catch {
    return [];
  }
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
): Promise<ActiveContext | null> {
  const memberships = await loadMemberships(supabase);
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
