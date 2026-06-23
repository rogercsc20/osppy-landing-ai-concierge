// Tone per reservations.status (mig 001). Unknown statuses fall back to neutral —
// the label carries the meaning, so the colour is never the only signal. Shared
// by ReservationCard + ReservationsList (was a verbatim copy in each). Sits
// alongside ConversationStateBadge, the same pattern for conversation_state.
const STATUS_TONE: Record<string, string> = {
  tentative: "bg-canvas/60 text-ink/70",
  confirmed: "bg-turquoise-deep/20 text-turquoise-ink",
  checked_in: "bg-turquoise-deep/30 text-turquoise-ink",
  checked_out: "bg-canvas/60 text-ink/50",
  cancelled: "bg-coral/15 text-coral",
  no_show: "bg-coral/15 text-coral",
};

/** A small pill for a reservation's status. Label = the real signal. */
export function StatusBadge({ status, label }: { status: string; label: string }) {
  const tone = STATUS_TONE[status] ?? "bg-canvas/60 text-ink/60";
  return (
    <span className={`inline-block shrink-0 rounded-full px-2.5 py-0.5 text-xs ${tone}`}>
      {label}
    </span>
  );
}
