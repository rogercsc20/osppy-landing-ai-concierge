import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  CONVERSATION_STATES,
  buildFilterQuery,
  formatDateTime,
  type ConversationFilters,
  type ConversationListRow,
  type PageMeta,
} from "@/lib/dashboard/conversations";
import { ConversationStateBadge } from "./ConversationStateBadge";

/**
 * Read-only roster of a property's conversations: a filter bar (state /
 * escalated / date, submitted as a plain GET `<form>` so it needs no client JS),
 * the RLS-scoped page of rows newest-activity first, and pagination. Live
 * updates are owned by `<ConversationsRealtime>` mounted on the page.
 */
export function ConversationsList({
  rows,
  filters,
  page,
  locale,
  timeZone,
}: {
  rows: ConversationListRow[];
  filters: ConversationFilters;
  page: PageMeta;
  locale: string;
  timeZone: string;
}) {
  const t = useTranslations("dashboardApp.conversations");
  const basePath = `/${locale}/dashboard/conversations`;

  return (
    <div className="space-y-5">
      <FilterBar filters={filters} />

      {rows.length === 0 ? (
        <p className="border-line text-ink/50 rounded-2xl border border-dashed p-6 text-sm">
          {t("empty")}
        </p>
      ) : (
        <>
          <ul className="border-line divide-line divide-y overflow-hidden rounded-2xl border">
            {rows.map((row) => (
              <li key={row.conversation_id} className="bg-ink-panel">
                <Link
                  href={`${basePath}/${row.conversation_id}`}
                  className="hover:bg-canvas/40 flex items-center justify-between gap-3 px-4 py-3 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-ink truncate font-medium">
                      {row.guest_profiles?.name ?? t("unknownGuest")}
                    </p>
                    <p className="text-ink/40 text-xs">
                      {row.guest_profiles?.phone ?? t("noPhone")} · {row.channel_type}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {row.staff_takeover_at && (
                      <span className="bg-coral/15 text-coral rounded-full px-2 py-0.5 text-xs">
                        {t("staffBadge")}
                      </span>
                    )}
                    <ConversationStateBadge
                      state={row.conversation_state}
                      label={t(`states.${row.conversation_state}`)}
                    />
                    <time
                      dateTime={row.last_message_at}
                      className="text-ink/40 hidden w-24 text-right text-xs sm:inline"
                    >
                      {formatDateTime(row.last_message_at, timeZone)}
                    </time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <Pagination page={page} basePath={basePath} filters={filters} />
        </>
      )}
    </div>
  );
}

function FilterBar({ filters }: { filters: ConversationFilters }) {
  const t = useTranslations("dashboardApp.conversations");
  return (
    <form
      method="get"
      className="border-line bg-ink-panel flex flex-wrap items-end gap-3 rounded-2xl border p-4"
      aria-label={t("filters.label")}
    >
      <label className="flex flex-col gap-1 text-xs">
        <span className="text-ink/60">{t("filters.state")}</span>
        <select
          name="state"
          defaultValue={filters.state ?? ""}
          className="border-line bg-canvas text-ink rounded-lg border px-2 py-1.5 text-sm"
        >
          <option value="">{t("filters.allStates")}</option>
          {CONVERSATION_STATES.map((s) => (
            <option key={s} value={s}>
              {t(`states.${s}`)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs">
        <span className="text-ink/60">{t("filters.from")}</span>
        <input
          type="date"
          name="from"
          defaultValue={filters.from ?? ""}
          className="border-line bg-canvas text-ink rounded-lg border px-2 py-1.5 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs">
        <span className="text-ink/60">{t("filters.to")}</span>
        <input
          type="date"
          name="to"
          defaultValue={filters.to ?? ""}
          className="border-line bg-canvas text-ink rounded-lg border px-2 py-1.5 text-sm"
        />
      </label>

      <label className="flex items-center gap-2 self-center text-sm">
        <input
          type="checkbox"
          name="escalated"
          value="1"
          defaultChecked={filters.escalated}
          className="accent-turquoise-deep h-4 w-4"
        />
        <span className="text-ink/70">{t("filters.escalated")}</span>
      </label>

      <div className="ml-auto flex gap-2">
        <button
          type="submit"
          className="bg-turquoise-deep hover:bg-turquoise rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors"
        >
          {t("filters.apply")}
        </button>
        <Link
          href="?"
          className="border-line text-ink/70 hover:bg-canvas/60 rounded-lg border px-3 py-1.5 text-sm"
        >
          {t("filters.clear")}
        </Link>
      </div>
    </form>
  );
}

function Pagination({
  page,
  basePath,
  filters,
}: {
  page: PageMeta;
  basePath: string;
  filters: ConversationFilters;
}) {
  const t = useTranslations("dashboardApp.conversations");
  const href = (p: number) => {
    const qs = buildFilterQuery(filters, p);
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav
      className="flex items-center justify-between gap-3 text-sm"
      aria-label={t("pagination.label")}
    >
      <span className="text-ink/50 text-xs">
        {t("pagination.showing", {
          from: page.fromIndex,
          to: page.toIndex,
          total: page.total,
        })}
      </span>
      <div className="flex gap-2">
        {page.hasPrev ? (
          <Link
            href={href(page.page - 1)}
            rel="prev"
            className="border-line text-ink/80 hover:bg-canvas/60 rounded-lg border px-3 py-1.5"
          >
            {t("pagination.prev")}
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="border-line text-ink/30 rounded-lg border px-3 py-1.5"
          >
            {t("pagination.prev")}
          </span>
        )}
        {page.hasNext ? (
          <Link
            href={href(page.page + 1)}
            rel="next"
            className="border-line text-ink/80 hover:bg-canvas/60 rounded-lg border px-3 py-1.5"
          >
            {t("pagination.next")}
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="border-line text-ink/30 rounded-lg border px-3 py-1.5"
          >
            {t("pagination.next")}
          </span>
        )}
      </div>
    </nav>
  );
}
