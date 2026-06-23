import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Realtime for the today board (B3). A single channel subscribes to
 * `postgres_changes` on `reservations` + `lifecycle_sends`, filtered to the
 * active property, and fires `onChange` on any insert/update/delete so the
 * board can re-read (a chip flips, a guest checks in elsewhere).
 *
 * The `property_id` filter is an EFFICIENCY lever, not the fence: `postgres_changes`
 * enforces the table RLS (`has_dashboard_access` SELECT) on every streamed row,
 * re-checked on connect and token refresh (mig 081 sets `REPLICA IDENTITY FULL`
 * so the filtered UPDATE/DELETE events + the old-row RLS check carry the column).
 * A wrong/missing filter is therefore a perf bug, never a cross-tenant leak.
 *
 * Realtime is a browser concern → call this from a Client Component with the
 * browser client (anon key + the user's session); it returns an unsubscribe.
 */
export function subscribeToBoard(
  supabase: SupabaseClient,
  propertyId: string,
  onChange: () => void,
): () => void {
  const filter = `property_id=eq.${propertyId}`;
  const channel = supabase
    .channel(`board:${propertyId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "reservations", filter },
      () => onChange(),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "lifecycle_sends", filter },
      () => onChange(),
    )
    .subscribe();

  return () => {
    // Fire-and-forget; the channel is torn down on unmount / property switch.
    void supabase.removeChannel(channel);
  };
}
