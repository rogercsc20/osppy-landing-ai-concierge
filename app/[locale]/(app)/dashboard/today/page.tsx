import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { canWriteReservations, resolveActiveProperty } from "@/lib/dashboard/membership";
import {
  loadPropertyTimezone,
  loadTodayBoard,
  todayInTimeZone,
} from "@/lib/dashboard/board";
import { TodayBoard } from "@/components/dashboard/TodayBoard";

// getUser()/cookies() + PostgREST reads → always request-dynamic.
export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const t = await getTranslations("dashboardApp.today");
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

  const tz = await loadPropertyTimezone(supabase, active.activeId);
  const today = todayInTimeZone(tz);
  const board = await loadTodayBoard(supabase, active.activeId, today);
  const canWrite = canWriteReservations(active.role);

  return <TodayBoard board={board} propertyId={active.activeId} canWrite={canWrite} />;
}
