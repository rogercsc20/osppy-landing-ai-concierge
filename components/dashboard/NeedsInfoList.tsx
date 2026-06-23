import { useTranslations } from "next-intl";
import type { IncompleteReservationRow } from "@/lib/dashboard/complete-record";
import { CompleteRecordForm } from "./CompleteRecordForm";

// Known OTA sources get a friendly i18n label; anything else falls back to the
// raw booking_source value (never a guessed string — and never a t() call on a
// missing key, which would throw MISSING_MESSAGE).
const KNOWN_SOURCES = new Set(["booking_com", "airbnb", "other"]);

const SOURCE_TONE: Record<string, string> = {
  booking_com: "bg-turquoise-deep/20 text-turquoise-ink",
  airbnb: "bg-coral/15 text-coral",
  other: "bg-canvas/60 text-ink/60",
};

/**
 * The needs-info list (server): one card per iCal-ingested reservation still
 * lacking a contactable guest identity. Each card shows the read-only feed
 * context (OTA source, dates, room, current placeholder name) and — for
 * owner|staff — the targeted {@link CompleteRecordForm}. Non-writers see the
 * rows but no form (a viewer notice is rendered by the page). On complete, the
 * row drops off after the form's `router.refresh()`.
 */
export function NeedsInfoList({
  rows,
  propertyId,
  canWrite,
}: {
  rows: IncompleteReservationRow[];
  propertyId: string;
  canWrite: boolean;
}) {
  const t = useTranslations("dashboardApp.needsInfo");

  if (rows.length === 0) {
    return (
      <p className="border-line text-ink/50 rounded-2xl border border-dashed p-6 text-sm">
        {t("empty")}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {rows.map((row) => {
        const src = row.booking_source ?? "";
        const known = KNOWN_SOURCES.has(src);
        const label = known ? t(`source.${src}`) : src || t("source.other");
        const tone = SOURCE_TONE[src] ?? "bg-canvas/60 text-ink/60";
        return (
          <li
            key={row.reservation_id}
            className="border-line bg-ink-panel rounded-2xl border p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-ink/50 text-xs">
                  {t("row.currentName")}{" "}
                  <span className="text-ink/80">{row.guest_name || "—"}</span>
                </p>
                <p className="text-ink/40 mt-0.5 text-xs">
                  {row.room_code ? `${t("row.room")} ${row.room_code} · ` : ""}
                  {t("row.guests", { count: row.num_guests })} · {row.check_in} →{" "}
                  {row.check_out}
                </p>
              </div>
              <span
                className={`inline-block shrink-0 rounded-full px-2.5 py-0.5 text-xs ${tone}`}
              >
                {label}
              </span>
            </div>

            {canWrite && (
              <CompleteRecordForm reservationId={row.reservation_id} propertyId={propertyId} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
