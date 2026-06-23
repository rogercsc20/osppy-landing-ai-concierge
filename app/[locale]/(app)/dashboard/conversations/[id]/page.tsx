import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { loadPropertyTimezone } from "@/lib/dashboard/board";
import {
  formatDateTime,
  loadConversationDetail,
  loadConversationMessages,
  loadConversationTasks,
} from "@/lib/dashboard/conversations";
import { ConversationStateBadge } from "@/components/dashboard/ConversationStateBadge";
import { ConversationThread } from "@/components/dashboard/ConversationThread";
import { ConversationsRealtime } from "@/components/dashboard/ConversationsRealtime";
import { GuestSidebar } from "@/components/dashboard/GuestSidebar";
import { TaskPanel } from "@/components/dashboard/TaskPanel";

// getUser()/cookies() + PostgREST reads → always request-dynamic.
export const dynamic = "force-dynamic";

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("dashboardApp.conversations");
  const supabase = await createClient();
  const backHref = `/${locale}/dashboard/conversations`;

  // RLS-scoped: a cross-tenant / unknown id reads back null (no access), not an error.
  const conversation = await loadConversationDetail(supabase, id);
  if (!conversation) {
    return (
      <div className="max-w-md space-y-3">
        <Link href={backHref} className="text-turquoise-ink text-sm">
          ← {t("detail.back")}
        </Link>
        <p className="text-ink/60 text-sm">{t("detail.notFound")}</p>
      </div>
    );
  }

  const tz = await loadPropertyTimezone(supabase, conversation.property_id);
  const [messages, tasks] = await Promise.all([
    loadConversationMessages(supabase, id),
    loadConversationTasks(supabase, id),
  ]);

  return (
    <div className="space-y-5">
      <ConversationsRealtime conversationId={id} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={backHref} className="text-turquoise-ink text-sm">
            ← {t("detail.back")}
          </Link>
          <h1 className="font-display mt-1 truncate text-2xl">
            {conversation.guest_profiles?.name ?? t("unknownGuest")}
          </h1>
          <p className="text-ink/50 mt-1 text-xs">
            {conversation.channel_type} · {t("detail.started")}{" "}
            {formatDateTime(conversation.first_message_at, tz)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {conversation.staff_takeover_at && (
            <span className="bg-coral/15 text-coral rounded-full px-2.5 py-0.5 text-xs">
              {t("staffBadge")}
            </span>
          )}
          <ConversationStateBadge
            state={conversation.conversation_state}
            label={t(`states.${conversation.conversation_state}`)}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
        <ConversationThread messages={messages} timeZone={tz} />
        <div className="space-y-5">
          <GuestSidebar guest={conversation.guest_profiles} timeZone={tz} />
          <TaskPanel tasks={tasks} timeZone={tz} />
        </div>
      </div>
    </div>
  );
}
