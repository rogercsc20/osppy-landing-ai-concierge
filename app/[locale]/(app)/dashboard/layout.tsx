import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/dashboard/AppShell";
import { ACTIVE_PROPERTY_COOKIE } from "@/components/dashboard/PropertySwitcher";
import { loadMemberships } from "@/lib/dashboard/membership";

// getUser() + cookies() make this request-dynamic; never statically generated.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  // Defense-in-depth beyond the proxy guard (a matcher change must not silently
  // expose the dashboard). NOTE: keep redirect() OUTSIDE the try — it signals
  // via a thrown NEXT_REDIRECT that a catch would swallow.
  let email: string | null = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? (user ? "" : null);
  } catch {
    email = null;
  }
  if (email === null) {
    redirect(`/${locale}/login`);
  }

  const memberships = await loadMemberships(supabase);

  if (memberships.length === 0) {
    const t = await getTranslations("dashboardApp.property");
    return (
      <main className="bg-canvas text-ink flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-2xl">{t("noAccessTitle")}</h1>
          <p className="mt-2 text-sm text-ink/60">{t("noAccessBody")}</p>
        </div>
      </main>
    );
  }

  const cookieStore = await cookies();
  const requested = cookieStore.get(ACTIVE_PROPERTY_COOKIE)?.value;
  const activeId =
    memberships.find((m) => m.property_id === requested)?.property_id ??
    memberships[0].property_id;

  return (
    <AppShell
      locale={locale}
      email={email}
      properties={memberships}
      activeId={activeId}
    >
      {children}
    </AppShell>
  );
}
