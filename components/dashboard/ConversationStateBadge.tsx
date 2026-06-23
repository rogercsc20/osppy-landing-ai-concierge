// Tone per conversation_state (mig 001). Unknown states fall back to neutral —
// the label carries the meaning, so the colour is never the only signal.
const STATE_TONE: Record<string, string> = {
  new: "bg-turquoise-deep/20 text-turquoise-ink",
  inquiry: "bg-turquoise-deep/15 text-turquoise-ink",
  booking_flow: "bg-turquoise-deep/25 text-turquoise-ink",
  pending_staff_approval: "bg-coral/15 text-coral",
  confirmed: "bg-turquoise-deep/30 text-turquoise-ink",
  pre_arrival: "bg-turquoise-deep/15 text-ink/70",
  checked_in: "bg-turquoise-deep/30 text-turquoise-ink",
  post_stay: "bg-canvas/60 text-ink/60",
  closed: "bg-canvas/60 text-ink/45",
};

/** A small pill for a conversation's lifecycle state. Label = the real signal. */
export function ConversationStateBadge({ state, label }: { state: string; label: string }) {
  const tone = STATE_TONE[state] ?? "bg-canvas/60 text-ink/60";
  return (
    <span className={`inline-block shrink-0 rounded-full px-2.5 py-0.5 text-xs ${tone}`}>
      {label}
    </span>
  );
}
