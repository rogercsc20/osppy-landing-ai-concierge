import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/dashboard/AppShell";
import {
  ACTIVE_PROPERTY_COOKIE,
  type PropertyOption,
} from "@/components/dashboard/PropertySwitcher";

// getUser() + cookies() make this request-dynamic; never statically generated.
export const dynamic = "force-dynamic";

type Membership = PropertyOption & { role: string };

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function loadMemberships(
  supabase: SupabaseServerClient,
): Promise<Membership[]> {
  try {
    const [{ data: rows }, { data: props }] = await Promise.all([
      // self_read RLS → only this user's own membership rows
      supabase.from("dashboard_users").select("property_id, role").eq("is_active", true),
      // has_dashboard_access RLS → only the properties this user may read
      supabase.from("properties").select("property_id, name"),
    ]);
    const members = (rows ?? []) as Array<{ property_id: string; role: string }>;
    const names = new Map(
      ((props ?? []) as Array<{ property_id: string; name: string }>).map((p) => [
        p.property_id,
        p.name,
      ]),
    );
    return members.map((m) => ({
      property_id: m.property_id,
      role: m.role,
      name: names.get(m.property_id) ?? m.property_id,
    }));
  } catch {
    return [];
  }
}

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
