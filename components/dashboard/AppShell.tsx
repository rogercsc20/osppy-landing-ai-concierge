import Link from "next/link";
import { useTranslations } from "next-intl";
import { SignOutButton } from "./SignOutButton";
import { PropertySwitcher, type PropertyOption } from "./PropertySwitcher";

const NAV_ITEMS = [
  "today",
  "reservations",
  "needsInfo",
  "conversations",
  "stats",
  "settings",
] as const;
// Screens shipped so far (the rest render as muted "soon" labels). today = B3,
// reservations = B2, needsInfo = B6, conversations = B4, stats + settings = B5.
const LIVE_NAV: Partial<Record<(typeof NAV_ITEMS)[number], string>> = {
  today: "dashboard/today",
  reservations: "dashboard/reservations",
  needsInfo: "dashboard/needs-info",
  conversations: "dashboard/conversations",
  stats: "dashboard/stats",
  settings: "dashboard/settings",
};

/**
 * Obsidian-panel dashboard shell: sidebar nav + top bar (property switcher /
 * name + sign-out) + main. Nav items render as muted labels for now — the
 * operational screens land in later slices (B2–B5).
 */
export function AppShell({
  locale,
  email,
  properties,
  activeId,
  children,
}: {
  locale: string;
  email: string;
  properties: PropertyOption[];
  activeId: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("dashboardApp");
  const active = properties.find((p) => p.property_id === activeId);

  return (
    <div className="bg-canvas text-ink flex min-h-screen flex-col md:flex-row">
      <aside className="border-line bg-ink-panel border-b md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="px-5 py-4">
          <span className="font-display text-lg">{t("shell.brand")}</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:gap-0.5 md:overflow-visible md:pb-0">
          {NAV_ITEMS.map((item) =>
            LIVE_NAV[item] ? (
              <Link
                key={item}
                href={`/${locale}/${LIVE_NAV[item]}`}
                className="hover:bg-canvas/60 rounded-lg px-3 py-2 text-sm whitespace-nowrap text-ink/80 transition-colors"
              >
                {t(`shell.nav.${item}`)}
              </Link>
            ) : (
              <span
                key={item}
                aria-disabled="true"
                title={t("shell.soon")}
                className="rounded-lg px-3 py-2 text-sm whitespace-nowrap text-ink/40"
              >
                {t(`shell.nav.${item}`)}
              </span>
            ),
          )}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-line flex items-center justify-between gap-3 border-b px-5 py-3">
          <div className="flex min-w-0 items-center gap-3">
            {properties.length > 1 ? (
              <PropertySwitcher
                label={t("property.label")}
                properties={properties}
                activeId={activeId}
              />
            ) : (
              <span className="truncate text-sm text-ink/70">{active?.name}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden truncate text-sm text-ink/50 sm:inline">{email}</span>
            <SignOutButton label={t("shell.signOut")} locale={locale} />
          </div>
        </header>
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
