import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { resolveActiveProperty } from "@/lib/dashboard/membership";
import { loadPropertyTimezone } from "@/lib/dashboard/board";
import {
  DEFAULT_PAGE_SIZE,
  buildPageMeta,
  listConversations,
  loadEscalatedConversationIds,
  normalizeFilters,
  parsePage,
  zonedDayRangeToUtc,
} from "@/lib/dashboard/conversations";
import { ConversationsList } from "@/components/dashboard/ConversationsList";
import { ConversationsRealtime } from "@/components/dashboard/ConversationsRealtime";

// getUser()/cookies() + PostgREST reads → always request-dynamic.
export const dynamic = "force-dynamic";

export default async function ConversationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const t = await getTranslations("dashboardApp.conversations");
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

  const raw = await searchParams;
  const filters = normalizeFilters(raw);
  const page = parsePage(raw.page);
  const tz = await loadPropertyTimezone(supabase, active.activeId);
  const range = zonedDayRangeToUtc(tz, filters.from, filters.to);

  // "escalated" = the conversation has an OPEN escalation task (mig 001 tasks),
  // not a conversation column — restrict the page to those ids, or short-circuit
  // to empty when none exist (no wasted unbounded read).
  const restrictIds = filters.escalated
    ? await loadEscalatedConversationIds(supabase, active.activeId)
    : null;

  const { rows, total } =
    restrictIds && restrictIds.length === 0
      ? { rows: [], total: 0 }
      : await listConversations(supabase, active.activeId, {
          state: filters.state,
          restrictIds,
          range,
          page,
          pageSize: DEFAULT_PAGE_SIZE,
        });

  const pageMeta = buildPageMeta(page, DEFAULT_PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <ConversationsRealtime propertyId={active.activeId} />

      <div>
        <h1 className="font-display text-2xl">{t("title")}</h1>
        <p className="text-ink/60 mt-1 text-sm">{t("subtitle")}</p>
      </div>

      <ConversationsList
        rows={rows}
        filters={filters}
        page={pageMeta}
        locale={locale}
        timeZone={tz}
      />
    </div>
  );
}
