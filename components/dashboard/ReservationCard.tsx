"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { isPermissionError } from "@/lib/dashboard/errors";
import {
  availableActions,
  updateReservationStatus,
  type BoardAction,
  type BoardCard,
  type LifecycleTrigger,
} from "@/lib/dashboard/board";
import { isIncomplete } from "@/lib/dashboard/complete-record";
import { StatusChip } from "./StatusChip";
import { StatusBadge } from "./StatusBadge";

/** Digits-only phone for a wa.me link (drops the leading "+" and any spacing). */
function waNumber(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

const ACTION_TONE: Record<BoardAction, string> = {
  checked_in: "bg-turquoise-deep hover:bg-turquoise text-white",
  checked_out: "bg-turquoise-deep hover:bg-turquoise text-white",
  no_show: "border-line text-ink/70 hover:bg-canvas/60 border",
};

/**
 * One reservation on the today board (client — it owns the status write +
 * one-tap contact). Shows the guest, room, dates/ETA, the lifecycle chips for
 * its column, and the transitions its status allows (owner|staff only). A
 * status write goes through the `reservations_dashboard_update` RLS policy; a
 * viewer / cross-tenant denial surfaces as a friendly notice, not a stack trace.
 */
export function ReservationCard({
  card,
  propertyId,
  canWrite,
  triggers,
}: {
  card: BoardCard;
  propertyId: string;
  canWrite: boolean;
  triggers: readonly LifecycleTrigger[];
}) {
  const t = useTranslations("dashboardApp.today");
  const router = useRouter();
  const [pending, setPending] = useState<BoardAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const actions = canWrite ? availableActions(card.status) : [];
  // An iCal-ingested arrival/departure still missing a contactable guest — link
  // staff to the dedicated needs-info screen to complete it (B6).
  const needsInfo = isIncomplete(card);

  async function act(next: BoardAction) {
    setPending(next);
    setError(null);
    try {
      const supabase = createClient();
      await updateReservationStatus(supabase, card.reservation_id, propertyId, next);
      router.refresh(); // re-read the board (Realtime also nudges other clients)
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : String(caught);
      setError(isPermissionError(message) ? t("permissionError") : t("actionError"));
    } finally {
      setPending(null);
    }
  }

  return (
    <li className="border-line bg-ink-panel rounded-2xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-ink truncate font-medium">{card.guest_name}</p>
          <p className="text-ink/50 text-xs">
            {card.room_code ? `${t("card.room")} ${card.room_code} · ` : ""}
            {t("card.guests", { count: card.num_guests })}
            {card.arrival_eta ? ` · ${t("card.eta")} ${card.arrival_eta.slice(0, 5)}` : ""}
          </p>
          <p className="text-ink/40 text-xs">
            {card.check_in} → {card.check_out}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <StatusBadge status={card.status} label={t(`statusBadge.${card.status}`)} />
          {needsInfo && (
            <Link
              href="/dashboard/needs-info"
              className="bg-coral/15 text-coral hover:bg-coral/25 rounded-full px-2.5 py-0.5 text-xs transition-colors"
            >
              {t("needsInfoBadge")}
            </Link>
          )}
        </div>
      </div>

      {/* lifecycle chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {triggers.map((trigger) => (
          <StatusChip
            key={trigger}
            label={t(`chips.${trigger}`)}
            state={card.chips[trigger]}
            stateLabel={t(`chipState.${card.chips[trigger]}`)}
          />
        ))}
      </div>

      {/* contact + actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {card.guest_phone && (
          <>
            <a
              href={`tel:${card.guest_phone}`}
              aria-label={t("card.call")}
              className="border-line text-ink/70 hover:bg-canvas/60 rounded-lg border px-3 py-1.5 text-sm"
            >
              {t("card.call")}
            </a>
            <a
              href={`https://wa.me/${waNumber(card.guest_phone)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("card.whatsapp")}
              className="border-line text-ink/70 hover:bg-canvas/60 rounded-lg border px-3 py-1.5 text-sm"
            >
              {t("card.whatsapp")}
            </a>
          </>
        )}

        {actions.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => act(action)}
            disabled={pending !== null}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${ACTION_TONE[action]}`}
          >
            {pending === action ? t("actions.saving") : t(`actions.${action}`)}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-coral mt-2 text-xs">
          {error}
        </p>
      )}
    </li>
  );
}

