import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { canWriteSettings, resolveActiveProperty } from "@/lib/dashboard/membership";
import { loadSettings, rowToFormValues } from "@/lib/dashboard/settings";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { SettingsReadOnly } from "@/components/dashboard/SettingsReadOnly";

// getUser()/cookies() + PostgREST reads → always request-dynamic.
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const t = await getTranslations("dashboardApp.settings");
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

  const row = await loadSettings(supabase, active.activeId);
  if (!row) {
    return (
      <div className="max-w-md">
        <h1 className="font-display text-2xl">{t("title")}</h1>
        <p className="text-ink/60 mt-2 text-sm">{t("noConfig")}</p>
      </div>
    );
  }

  const values = rowToFormValues(row);
  const canWrite = canWriteSettings(active.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">{t("title")}</h1>
        <p className="text-ink/60 mt-1 text-sm">{t("subtitle")}</p>
      </div>

      {canWrite ? (
        <SettingsForm propertyId={active.activeId} initialValues={values} />
      ) : (
        <SettingsReadOnly values={values} />
      )}
    </div>
  );
}
