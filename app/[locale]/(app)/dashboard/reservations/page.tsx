import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import {
  canWriteReservations,
  resolveActiveProperty,
} from "@/lib/dashboard/membership";
import { listReservations, listRooms } from "@/lib/dashboard/reservations";
import { ReservationForm } from "@/components/dashboard/ReservationForm";
import { ReservationsList } from "@/components/dashboard/ReservationsList";

// getUser()/cookies() + PostgREST reads → always request-dynamic.
export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const t = await getTranslations("dashboardApp.reservations");
  const supabase = await createClient();

  const active = await resolveActiveProperty(supabase);
  if (!active) {
    return (
      <div className="max-w-md">
        <h1 className="font-display text-2xl">{t("title")}</h1>
        <p className="text-ink/60 mt-2 text-sm">{t("noProperty")}</p>
      </div>
    );
  }

  const [rows, rooms] = await Promise.all([
    listReservations(supabase, active.activeId),
    listRooms(supabase, active.activeId),
  ]);
  const canWrite = canWriteReservations(active.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">{t("title")}</h1>
        <p className="text-ink/60 mt-1 text-sm">{t("subtitle")}</p>
      </div>

      {canWrite ? (
        <ReservationForm propertyId={active.activeId} rooms={rooms} />
      ) : (
        <p className="border-line text-ink/60 rounded-2xl border border-dashed p-4 text-sm">
          {t("viewerNotice")}
        </p>
      )}

      <ReservationsList rows={rows} />
    </div>
  );
}
