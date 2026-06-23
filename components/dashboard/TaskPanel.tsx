import { useTranslations } from "next-intl";
import { formatDateTime, isOpenTask, type TaskRow } from "@/lib/dashboard/conversations";

// task_type / status / priority value sets (mig 001). Used to look up labels and
// pick a tone; an unexpected value renders its raw token, never crashes.
const KNOWN_TYPES = new Set([
  "escalation",
  "booking_approval",
  "service_request",
  "maintenance",
  "review_request",
]);
const KNOWN_STATUSES = new Set(["pending", "in_progress", "completed", "cancelled"]);
const KNOWN_PRIORITIES = new Set(["low", "normal", "high", "urgent"]);

const PRIORITY_TONE: Record<string, string> = {
  urgent: "bg-coral/20 text-coral",
  high: "bg-coral/15 text-coral",
  normal: "bg-turquoise-deep/15 text-turquoise-ink",
  low: "bg-canvas/60 text-ink/50",
};

/**
 * Tasks attached to a conversation (read-only). Open tasks (pending /
 * in_progress) carry a marker; the escalation task is what drives the list's
 * "escalated" filter. Newest first.
 */
export function TaskPanel({ tasks, timeZone }: { tasks: TaskRow[]; timeZone: string }) {
  const t = useTranslations("dashboardApp.conversations");

  return (
    <section className="border-line bg-ink-panel space-y-3 rounded-2xl border p-4">
      <h2 className="text-ink/60 text-xs font-medium tracking-wide uppercase">
        {t("detail.tasks")}
      </h2>

      {tasks.length === 0 ? (
        <p className="text-ink/45 text-sm">{t("detail.noTasks")}</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => {
            const open = isOpenTask(task.status);
            return (
              <li key={task.task_id} className="border-line rounded-xl border p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-ink text-sm font-medium">{task.title}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                      PRIORITY_TONE[task.priority] ?? "bg-canvas/60 text-ink/50"
                    }`}
                  >
                    {KNOWN_PRIORITIES.has(task.priority)
                      ? t(`detail.priority.${task.priority}`)
                      : task.priority}
                  </span>
                </div>
                <p className="text-ink/45 mt-1 flex flex-wrap items-center gap-x-2 text-[11px]">
                  <span>
                    {KNOWN_TYPES.has(task.task_type)
                      ? t(`detail.taskType.${task.task_type}`)
                      : task.task_type}
                  </span>
                  <span className={open ? "text-turquoise-ink" : "text-ink/35"}>
                    ·{" "}
                    {KNOWN_STATUSES.has(task.status)
                      ? t(`detail.taskStatus.${task.status}`)
                      : task.status}
                  </span>
                  {task.due_at && (
                    <time dateTime={task.due_at}>
                      · {t("detail.due")} {formatDateTime(task.due_at, timeZone)}
                    </time>
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
