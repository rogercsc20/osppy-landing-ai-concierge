"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { isPermissionError } from "@/lib/dashboard/errors";
import {
  AUTONOMY_LEVELS,
  settingsFormSchema,
  updateSettings,
  type SettingsFormValues,
} from "@/lib/dashboard/settings";

type Status = "idle" | "saving" | "saved" | "error";

const fieldClass =
  "border-line mt-1 w-full rounded-lg border bg-canvas/60 px-3 py-2 text-ink outline-none focus:border-turquoise-ink";
const labelClass = "text-sm text-ink/70";
const errorClass = "mt-1 text-xs text-coral";
const sectionClass = "border-line bg-ink-panel rounded-2xl border p-5";
const gridClass = "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2";

type Field = keyof SettingsFormValues;

// Module-level field components (defining them inside the form would reset their
// state every render — react-hooks/static-components).
function TextField({
  field,
  label,
  register,
  error,
  type = "text",
  placeholder,
  hint,
  colSpan,
}: {
  field: Field;
  label: string;
  register: UseFormRegister<SettingsFormValues>;
  error: string | null;
  type?: string;
  placeholder?: string;
  hint?: string;
  colSpan?: boolean;
}) {
  return (
    <div className={colSpan ? "sm:col-span-2" : ""}>
      <label htmlFor={field} className={labelClass}>
        {label}
      </label>
      <input id={field} type={type} placeholder={placeholder} {...register(field)} className={fieldClass} />
      {error ? (
        <p className={errorClass}>{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink/40">{hint}</p>
      ) : null}
    </div>
  );
}

function TextArea({
  field,
  label,
  register,
  error,
}: {
  field: Field;
  label: string;
  register: UseFormRegister<SettingsFormValues>;
  error: string | null;
}) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor={field} className={labelClass}>
        {label}
      </label>
      <textarea id={field} rows={3} {...register(field)} className={fieldClass} />
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

/**
 * Hotel settings form (client) — owner-only. Edits the 19-column editable
 * `property_configs` subset and writes through PostgREST under RLS. The DB is
 * the real fence (mig-080 owner-only policy + the 19-column grant); a
 * permission/grant error (somehow a non-owner, a cross-tenant caller, or a
 * non-whitelisted column) surfaces as a friendly notice, not a stack trace.
 */
export function SettingsForm({
  propertyId,
  initialValues,
}: {
  propertyId: string;
  initialValues: SettingsFormValues;
}) {
  const t = useTranslations("dashboardApp.settings");
  const te = useTranslations("dashboardApp.settings.errors");
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: initialValues,
  });

  function err(field: Field): string | null {
    const message = errors[field]?.message;
    return message ? te(message) : null;
  }

  async function onSubmit(values: SettingsFormValues) {
    setStatus("saving");
    try {
      const supabase = createClient();
      await updateSettings(supabase, propertyId, values);
      setStatus("saved");
      reset(values); // new baseline → the form is "clean" again
      router.refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : String(caught);
      setStatus("error");
      setFormError(isPermissionError(message) ? t("permissionError") : t("genericError"));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label={t("title")} className="space-y-6">
      {/* General */}
      <section className={sectionClass}>
        <h2 className="font-display text-lg">{t("sections.general")}</h2>
        <div className={gridClass}>
          <TextField field="staff_whatsapp_phone" label={t("fields.staffPhone")} register={register} error={err("staff_whatsapp_phone")} type="tel" placeholder="+52..." hint={t("hints.staffPhone")} />
          <div>
            <label htmlFor="autonomy_level" className={labelClass}>
              {t("fields.autonomyLevel")}
            </label>
            <select id="autonomy_level" {...register("autonomy_level")} className={fieldClass}>
              {AUTONOMY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {t(`autonomy.${level}`)}
                </option>
              ))}
            </select>
          </div>
          <TextField field="check_in_time" label={t("fields.checkInTime")} register={register} error={err("check_in_time")} type="time" />
          <TextField field="check_out_time" label={t("fields.checkOutTime")} register={register} error={err("check_out_time")} type="time" />
        </div>
      </section>

      {/* Breakfast */}
      <section className={sectionClass}>
        <h2 className="font-display text-lg">{t("sections.breakfast")}</h2>
        <div className={gridClass}>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" {...register("breakfast_included")} className="size-4" />
            <span className={labelClass}>{t("fields.breakfastIncluded")}</span>
          </label>
          <TextField field="breakfast_cost_per_person_mxn" label={t("fields.breakfastCost")} register={register} error={err("breakfast_cost_per_person_mxn")} placeholder="0.00" />
          <TextField field="breakfast_base_occupancy" label={t("fields.breakfastBaseOccupancy")} register={register} error={err("breakfast_base_occupancy")} type="number" placeholder="2" />
          <TextField field="breakfast_start_time" label={t("fields.breakfastStart")} register={register} error={err("breakfast_start_time")} type="time" />
          <TextField field="breakfast_end_time" label={t("fields.breakfastEnd")} register={register} error={err("breakfast_end_time")} type="time" />
          <TextField field="breakfast_hours_text" label={t("fields.breakfastHoursText")} register={register} error={err("breakfast_hours_text")} colSpan hint={t("hints.breakfastHoursText")} />
        </div>
      </section>

      {/* Payment */}
      <section className={sectionClass}>
        <h2 className="font-display text-lg">{t("sections.payment")}</h2>
        <div className={gridClass}>
          <TextField field="payment_bank_name" label={t("fields.bankName")} register={register} error={err("payment_bank_name")} />
          <TextField field="payment_account_holder" label={t("fields.accountHolder")} register={register} error={err("payment_account_holder")} />
          <TextField field="payment_account_number" label={t("fields.accountNumber")} register={register} error={err("payment_account_number")} />
          <TextField field="payment_clabe" label={t("fields.clabe")} register={register} error={err("payment_clabe")} hint={t("hints.clabe")} />
          <TextField field="payment_instructions_image_url" label={t("fields.instructionsImageUrl")} register={register} error={err("payment_instructions_image_url")} type="url" colSpan placeholder="https://..." />
          <TextArea field="payment_extra_instructions" label={t("fields.extraInstructions")} register={register} error={err("payment_extra_instructions")} />
        </div>
      </section>

      {/* Policies */}
      <section className={sectionClass}>
        <h2 className="font-display text-lg">{t("sections.policies")}</h2>
        <div className={gridClass}>
          <TextArea field="cancellation_policy" label={t("fields.cancellationPolicy")} register={register} error={err("cancellation_policy")} />
          <TextArea field="pet_policy" label={t("fields.petPolicy")} register={register} error={err("pet_policy")} />
          <TextArea field="smoking_policy" label={t("fields.smokingPolicy")} register={register} error={err("smoking_policy")} />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="bg-turquoise-deep hover:bg-turquoise rounded-lg px-5 py-2 font-medium text-white transition-colors disabled:opacity-60"
        >
          {status === "saving" ? t("saving") : t("save")}
        </button>
        {status === "saved" && (
          <span role="status" className="text-sm text-turquoise-ink">
            {t("savedToast")}
          </span>
        )}
        {status === "error" && formError && (
          <span role="alert" className="text-sm text-coral">
            {formError}
          </span>
        )}
      </div>
    </form>
  );
}
