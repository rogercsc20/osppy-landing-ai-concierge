import type { ChipState } from "@/lib/dashboard/board";

const TONE: Record<ChipState, string> = {
  replied: "bg-turquoise-deep/25 text-turquoise-ink",
  sent: "bg-turquoise-deep/10 text-ink/70",
  absent: "bg-canvas/60 text-ink/35",
};

const GLYPH: Record<ChipState, string> = {
  replied: "✓",
  sent: "•",
  absent: "—",
};

/**
 * One lifecycle chip: a labelled pill whose tone + glyph encode the
 * `lifecycle_sends` state for a single (reservation, trigger). The state is
 * exposed to assistive tech via the visually-hidden `stateLabel` and `title`
 * (the colour/glyph alone are never the only signal).
 */
export function StatusChip({
  label,
  state,
  stateLabel,
}: {
  label: string;
  state: ChipState;
  stateLabel: string;
}) {
  return (
    <span
      title={`${label}: ${stateLabel}`}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${TONE[state]}`}
    >
      <span aria-hidden="true">{GLYPH[state]}</span>
      <span>{label}</span>
      <span className="sr-only">— {stateLabel}</span>
    </span>
  );
}
