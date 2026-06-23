import { useTranslations } from "next-intl";
import { formatDateTime, type MessageRow } from "@/lib/dashboard/conversations";

// guest | ai | staff (mig 001 sender_type); anything else renders the raw token.
const KNOWN_SENDERS = new Set(["guest", "ai", "staff"]);

/**
 * The message thread (read-only). Guest messages sit left; AI / staff replies
 * sit right with the model that produced them. Server-rendered from the
 * RLS-scoped read; `<ConversationsRealtime>` on the page re-reads it live.
 */
export function ConversationThread({
  messages,
  timeZone,
}: {
  messages: MessageRow[];
  timeZone: string;
}) {
  const t = useTranslations("dashboardApp.conversations");

  if (messages.length === 0) {
    return (
      <p className="border-line text-ink/50 rounded-2xl border border-dashed p-6 text-sm">
        {t("detail.emptyThread")}
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {messages.map((m) => {
        const fromGuest = m.sender_type === "guest";
        return (
          <li key={m.message_id} className={fromGuest ? "flex" : "flex justify-end"}>
            <div
              className={`max-w-[85%] rounded-2xl border px-3 py-2 text-sm ${
                fromGuest
                  ? "border-line bg-ink-panel text-ink"
                  : "border-turquoise-deep/30 bg-turquoise-deep/10 text-ink"
              }`}
            >
              <p className="text-ink/45 mb-1 flex flex-wrap items-center gap-x-2 text-[11px]">
                <span>
                  {KNOWN_SENDERS.has(m.sender_type)
                    ? t(`detail.sender.${m.sender_type}`)
                    : m.sender_type}
                </span>
                {m.ai_model && <span className="text-ink/35">· {m.ai_model}</span>}
                {m.intent && <span className="text-ink/35">· {m.intent}</span>}
                <time dateTime={m.created_at}>· {formatDateTime(m.created_at, timeZone)}</time>
              </p>
              <p className="whitespace-pre-wrap break-words">{m.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
