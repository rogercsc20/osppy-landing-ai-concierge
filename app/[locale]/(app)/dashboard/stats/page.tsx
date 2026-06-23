import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { resolveActiveProperty } from "@/lib/dashboard/membership";
import { loadPropertyTimezone } from "@/lib/dashboard/board";
import { loadStats } from "@/lib/dashboard/stats";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { StatsPoller } from "@/components/dashboard/StatsPoller";

// getUser()/cookies() + PostgREST reads → always request-dynamic.
export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const t = await getTranslations("dashboardApp.stats");
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
  const stats = await loadStats(supabase, active.activeId, tz);

  return (
    <div className="space-y-6">
      <StatsPoller />

      <div>
        <h1 className="font-display text-2xl">{t("title")}</h1>
        <p className="text-ink/60 mt-1 text-sm">{t("subtitle")}</p>
      </div>

      <StatsCards stats={stats} />
    </div>
  );
}
