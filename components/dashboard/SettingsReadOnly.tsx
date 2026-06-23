import { useTranslations } from "next-intl";
import type { SettingsFormValues } from "@/lib/dashboard/settings";

/**
 * Read-only settings view for non-owners (staff / viewer). The mig-080 policy
 * makes the write owner-only, so a staff/viewer sees the current values but no
 * form — the page renders this instead of {@link SettingsForm}. Server,
 * presentational.
 */
export function SettingsReadOnly({ values }: { values: SettingsFormValues }) {
  const t = useTranslations("dashboardApp.settings");

  const show = (v: string | boolean): string => {
    if (typeof v === "boolean") return v ? t("yes") : t("no");
    return v.trim() === "" ? "—" : v;
  };

  const sections: Array<{ title: string; rows: Array<[string, string]> }> = [
    {
      title: t("sections.general"),
      rows: [
        [t("fields.staffPhone"), show(values.staff_whatsapp_phone)],
        [t("fields.autonomyLevel"), t(`autonomy.${values.autonomy_level}`)],
        [t("fields.checkInTime"), show(values.check_in_time)],
        [t("fields.checkOutTime"), show(values.check_out_time)],
      ],
    },
    {
      title: t("sections.breakfast"),
      rows: [
        [t("fields.breakfastIncluded"), show(values.breakfast_included)],
        [t("fields.breakfastCost"), show(values.breakfast_cost_per_person_mxn)],
        [t("fields.breakfastBaseOccupancy"), show(values.breakfast_base_occupancy)],
        [t("fields.breakfastStart"), show(values.breakfast_start_time)],
        [t("fields.breakfastEnd"), show(values.breakfast_end_time)],
        [t("fields.breakfastHoursText"), show(values.breakfast_hours_text)],
      ],
    },
    {
      title: t("sections.payment"),
      rows: [
        [t("fields.bankName"), show(values.payment_bank_name)],
        [t("fields.accountHolder"), show(values.payment_account_holder)],
        [t("fields.accountNumber"), show(values.payment_account_number)],
        [t("fields.clabe"), show(values.payment_clabe)],
        [t("fields.instructionsImageUrl"), show(values.payment_instructions_image_url)],
        [t("fields.extraInstructions"), show(values.payment_extra_instructions)],
      ],
    },
    {
      title: t("sections.policies"),
      rows: [
        [t("fields.cancellationPolicy"), show(values.cancellation_policy)],
        [t("fields.petPolicy"), show(values.pet_policy)],
        [t("fields.smokingPolicy"), show(values.smoking_policy)],
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <p className="border-line text-ink/60 rounded-2xl border border-dashed p-4 text-sm">
        {t("viewerNotice")}
      </p>
      {sections.map((section) => (
        <section key={section.title} className="border-line bg-ink-panel rounded-2xl border p-5">
          <h2 className="font-display text-lg">{section.title}</h2>
          <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {section.rows.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3 border-b border-line/40 py-1">
                <dt className="text-ink/60 text-sm">{label}</dt>
                <dd className="text-ink text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
