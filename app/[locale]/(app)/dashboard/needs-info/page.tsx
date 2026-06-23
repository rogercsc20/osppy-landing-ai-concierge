import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import {
  canWriteReservations,
  resolveActiveProperty,
} from "@/lib/dashboard/membership";
import { listIncompleteReservations } from "@/lib/dashboard/complete-record";
import { NeedsInfoList } from "@/components/dashboard/NeedsInfoList";

// getUser()/cookies() + PostgREST reads → always request-dynamic.
export const dynamic = "force-dynamic";

export default async function NeedsInfoPage() {
  const t = await getTranslations("dashboardApp.needsInfo");
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

  const rows = await listIncompleteReservations(supabase, active.activeId);
  const canWrite = canWriteReservations(active.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">{t("title")}</h1>
        <p className="text-ink/60 mt-1 text-sm">{t("subtitle")}</p>
      </div>

      {!canWrite && rows.length > 0 && (
        <p className="border-line text-ink/60 rounded-2xl border border-dashed p-4 text-sm">
          {t("viewerNotice")}
        </p>
      )}

      <NeedsInfoList rows={rows} propertyId={active.activeId} canWrite={canWrite} />
    </div>
  );
}
