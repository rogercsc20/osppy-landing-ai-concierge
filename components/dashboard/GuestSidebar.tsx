import { useTranslations } from "next-intl";
import {
  formatDateTime,
  type ConversationDetailRow,
} from "@/lib/dashboard/conversations";

/** Digits-only phone for a wa.me link (drops the leading "+" and any spacing). */
function waNumber(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

/**
 * Guest panel for the conversation detail (read-only): identity + contact
 * shortcuts + the lifetime counters carried on `guest_profiles`. All values are
 * RLS-scoped reads.
 */
export function GuestSidebar({
  guest,
  timeZone,
}: {
  guest: ConversationDetailRow["guest_profiles"];
  timeZone: string;
}) {
  const t = useTranslations("dashboardApp.conversations");

  return (
    <aside className="border-line bg-ink-panel space-y-4 rounded-2xl border p-4">
      <div>
        <h2 className="text-ink/60 text-xs font-medium tracking-wide uppercase">
          {t("detail.guest")}
        </h2>
        <p className="text-ink mt-1 font-medium">{guest?.name ?? t("unknownGuest")}</p>
        {guest?.phone && <p className="text-ink/50 text-sm">{guest.phone}</p>}
        {guest?.email && <p className="text-ink/50 text-sm break-words">{guest.email}</p>}
      </div>

      {guest?.phone && (
        <div className="flex flex-wrap gap-2">
          <a
            href={`tel:${guest.phone}`}
            className="border-line text-ink/70 hover:bg-canvas/60 rounded-lg border px-3 py-1.5 text-sm"
          >
            {t("detail.call")}
          </a>
          <a
            href={`https://wa.me/${waNumber(guest.phone)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border-line text-ink/70 hover:bg-canvas/60 rounded-lg border px-3 py-1.5 text-sm"
          >
            {t("detail.whatsapp")}
          </a>
        </div>
      )}

      <dl className="text-sm">
        <Row label={t("detail.language")} value={guest?.language_preference ?? "—"} />
        <Row label={t("detail.stays")} value={String(guest?.total_stays ?? 0)} />
        <Row label={t("detail.messages")} value={String(guest?.total_messages ?? 0)} />
        <Row
          label={t("detail.firstContact")}
          value={formatDateTime(guest?.first_contact_at, timeZone)}
        />
        <Row
          label={t("detail.lastContact")}
          value={formatDateTime(guest?.last_contact_at, timeZone)}
        />
      </dl>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-line flex justify-between gap-3 border-t py-1.5 first:border-t-0">
      <dt className="text-ink/50">{label}</dt>
      <dd className="text-ink/80 text-right">{value}</dd>
    </div>
  );
}
