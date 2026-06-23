import { useTranslations } from "next-intl";
import type { ReservationRow } from "@/lib/dashboard/reservations";
import { StatusBadge } from "./StatusBadge";

function formatMoney(value: ReservationRow["total_price_mxn"]): string {
  if (value === null || value === undefined) return "—";
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Read-only roster of a property's reservations. Server-rendered from the
 * RLS-scoped list; the form's router.refresh() re-runs the page to fold in a
 * new row. Mobile-first cards; a denser table from `sm:` up.
 */
export function ReservationsList({ rows }: { rows: ReservationRow[] }) {
  const t = useTranslations("dashboardApp.reservations");

  if (rows.length === 0) {
    return (
      <p className="border-line text-ink/50 rounded-2xl border border-dashed p-6 text-sm">
        {t("empty")}
      </p>
    );
  }

  return (
    <div className="border-line overflow-hidden rounded-2xl border">
      {/* table (sm+) */}
      <table className="hidden w-full text-left text-sm sm:table">
        <thead className="bg-ink-panel text-ink/50">
          <tr>
            <th className="px-4 py-3 font-medium">{t("list.guest")}</th>
            <th className="px-4 py-3 font-medium">{t("list.dates")}</th>
            <th className="px-4 py-3 font-medium">{t("list.room")}</th>
            <th className="px-4 py-3 font-medium">{t("list.guests")}</th>
            <th className="px-4 py-3 font-medium">{t("list.total")}</th>
            <th className="px-4 py-3 font-medium">{t("list.statusLabel")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.reservation_id} className="border-line border-t">
              <td className="px-4 py-3">
                <div className="text-ink">{r.guest_name}</div>
                {r.guest_phone && <div className="text-ink/40 text-xs">{r.guest_phone}</div>}
              </td>
              <td className="text-ink/70 px-4 py-3 whitespace-nowrap">
                {r.check_in} → {r.check_out}
              </td>
              <td className="text-ink/70 px-4 py-3">{r.room_code ?? "—"}</td>
              <td className="text-ink/70 px-4 py-3">{r.num_guests}</td>
              <td className="text-ink px-4 py-3 whitespace-nowrap">
                {formatMoney(r.total_price_mxn)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status} label={t(`statusBadge.${r.status}`)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* cards (mobile) */}
      <ul className="divide-line divide-y sm:hidden">
        {rows.map((r) => (
          <li key={r.reservation_id} className="bg-ink-panel p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-ink truncate">{r.guest_name}</div>
                <div className="text-ink/50 text-xs">
                  {r.check_in} → {r.check_out}
                </div>
              </div>
              <StatusBadge status={r.status} label={t(`statusBadge.${r.status}`)} />
            </div>
            <div className="text-ink/60 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span>
                {t("list.room")}: {r.room_code ?? "—"}
              </span>
              <span>
                {t("list.guests")}: {r.num_guests}
              </span>
              <span>{formatMoney(r.total_price_mxn)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
