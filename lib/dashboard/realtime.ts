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

/**
 * Realtime for the conversations LIST (B4). One channel on `messages` + `tasks`
 * inserts/updates, filtered to the active property, so a new inbound message or
 * a fresh task nudges the list to re-read (newest activity floats up, a new
 * escalation appears). Same fence as `subscribeToBoard`: the `property_id`
 * filter is efficiency, table RLS (`has_dashboard_access` SELECT) is the
 * boundary — a missing filter is a perf bug, never a cross-tenant leak.
 */
export function subscribeToConversationsList(
  supabase: SupabaseClient,
  propertyId: string,
  onChange: () => void,
): () => void {
  const filter = `property_id=eq.${propertyId}`;
  const channel = supabase
    .channel(`conversations:${propertyId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages", filter },
      () => onChange(),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks", filter },
      () => onChange(),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

/**
 * Realtime for a single conversation THREAD (B4 detail). Subscribes to
 * `messages` + `tasks` scoped to one `conversation_id`, so a new inbound/outbound
 * message or task appears live. RLS still fences every streamed row.
 */
export function subscribeToConversationThread(
  supabase: SupabaseClient,
  conversationId: string,
  onChange: () => void,
): () => void {
  const filter = `conversation_id=eq.${conversationId}`;
  const channel = supabase
    .channel(`conversation:${conversationId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages", filter },
      () => onChange(),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks", filter },
      () => onChange(),
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
