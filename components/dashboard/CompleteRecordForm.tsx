"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import {
  completeRecord,
  completeRecordFormSchema,
  emptyCompleteRecordForm,
  type CompleteRecordFormValues,
} from "@/lib/dashboard/complete-record";

type Status = "idle" | "saving" | "error";

/**
 * Targeted complete-the-record form (client). Only the missing guest identity —
 * real name + E.164 phone — for ONE iCal-ingested reservation. On save it writes
 * the denormalized `reservations.guest_*` columns through the
 * `reservations_dashboard_update` RLS policy (owner|staff) and calls
 * `router.refresh()`; the now-complete row drops off the needs-info list on the
 * server re-read. A permission error (viewer / cross-tenant) surfaces as a
 * friendly notice, not a stack trace.
 */
export function CompleteRecordForm({
  reservationId,
  propertyId,
}: {
  reservationId: string;
  propertyId: string;
}) {
  const t = useTranslations("dashboardApp.needsInfo.form");
  const te = useTranslations("dashboardApp.needsInfo.form.errors");
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteRecordFormValues>({
    resolver: zodResolver(completeRecordFormSchema),
    defaultValues: emptyCompleteRecordForm,
  });

  function err(field: keyof CompleteRecordFormValues): string | null {
    const message = errors[field]?.message;
    return message ? te(message) : null;
  }

  async function onSubmit(values: CompleteRecordFormValues) {
    setStatus("saving");
    setFormError(null);
    try {
      const supabase = createClient();
      await completeRecord(supabase, propertyId, reservationId, values);
      router.refresh(); // re-read → the completed row leaves the list
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : String(caught);
      setStatus("error");
      setFormError(
        /42501|permission|owner\/staff|row-level/i.test(message)
          ? t("permissionError")
          : t("genericError"),
      );
    }
  }

  const fieldClass =
    "border-line mt-1 w-full rounded-lg border bg-canvas/60 px-3 py-2 text-ink outline-none focus:border-turquoise-ink";
  const labelClass = "text-sm text-ink/70";
  const errorClass = "mt-1 text-xs text-coral";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={t("legend")}
      className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <div>
        <label htmlFor={`guestName-${reservationId}`} className={labelClass}>
          {t("guestName")}
        </label>
        <input
          id={`guestName-${reservationId}`}
          {...register("guestName")}
          className={fieldClass}
        />
        {err("guestName") && <p className={errorClass}>{err("guestName")}</p>}
      </div>

      <div>
        <label htmlFor={`guestPhone-${reservationId}`} className={labelClass}>
          {t("guestPhone")}
        </label>
        <input
          id={`guestPhone-${reservationId}`}
          type="tel"
          inputMode="tel"
          placeholder="+52..."
          {...register("guestPhone")}
          className={fieldClass}
        />
        {err("guestPhone") ? (
          <p className={errorClass}>{err("guestPhone")}</p>
        ) : (
          <p className="mt-1 text-xs text-ink/40">{t("guestPhoneHint")}</p>
        )}
      </div>

      <div className="col-span-full flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="bg-turquoise-deep hover:bg-turquoise rounded-lg px-4 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-60"
        >
          {status === "saving" ? t("saving") : t("save")}
        </button>
        {status === "error" && formError && (
          <span role="alert" className="text-coral text-sm">
            {formError}
          </span>
        )}
      </div>
    </form>
  );
}
