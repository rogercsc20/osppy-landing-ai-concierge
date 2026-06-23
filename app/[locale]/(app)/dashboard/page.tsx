import { getTranslations } from "next-intl/server";

export default async function DashboardHomePage() {
  const t = await getTranslations("dashboardApp.home");
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl">{t("title")}</h1>
      <p className="mt-3 text-ink/60">{t("body")}</p>
    </div>
  );
}
