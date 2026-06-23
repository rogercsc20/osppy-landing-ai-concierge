import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Settings data layer for the dashboard B5 slice.
 *
 * The read goes through PostgREST under RLS (the `property_configs` SELECT
 * policy — any dashboard role can read). The WRITE is **owner-only**: mig 080
 * REVOKEd the table-wide UPDATE on `property_configs` from `authenticated` then
 * column-level GRANTed UPDATE on EXACTLY the 19 editable columns, and the
 * `property_configs_dashboard_update` policy is `USING (… ['owner'])`. So a
 * staff/viewer caller, a cross-tenant caller, OR an UPDATE that touches any
 * non-granted column all fail at PostgREST — surfaced as a friendly notice by
 * the form, never a stack trace.
 *
 * {@link SETTINGS_COLUMNS} mirrors the mig-080 PART E grant exactly; the write
 * payload is built from it so it can never reach for a column the grant doesn't
 * cover. Validation here mirrors the DB CHECKs (autonomy enum, TIME HH:MM, money
 * ≥0) — the DB is the real gate, zod is the fast, friendly first line.
 *
 * The Supabase client is injected (server client for the read, browser client
 * for the write) so this module imports only `zod` and stays unit-testable.
 */

// ── The editable column whitelist (mirrors mig-080 PART E exactly) ───

// The 19 columns mig 080 column-level GRANTed UPDATE on. An UPDATE payload MUST
// be a subset of these — touching any other column is a PostgREST grant error.
export const SETTINGS_COLUMNS = [
  "staff_whatsapp_phone",
  "autonomy_level",
  "check_in_time",
  "check_out_time",
  "breakfast_included",
  "breakfast_cost_per_person_mxn",
  "breakfast_start_time",
  "breakfast_end_time",
  "breakfast_base_occupancy",
  "breakfast_hours_text",
  "payment_bank_name",
  "payment_account_holder",
  "payment_account_number",
  "payment_clabe",
  "payment_instructions_image_url",
  "payment_extra_instructions",
  "cancellation_policy",
  "pet_policy",
  "smoking_policy",
] as const;
export type SettingsColumn = (typeof SETTINGS_COLUMNS)[number];

// autonomy_level CHECK (mig 017 chk_autonomy_level). Not hard-coded Aura data —
// these are the platform-wide enum values, the same for every tenant.
export const AUTONOMY_LEVELS = [
  "faq_only",
  "assisted",
  "semi_auto",
  "full_auto",
] as const;
export type AutonomyLevel = (typeof AUTONOMY_LEVELS)[number];

// ── Validation patterns (mirror the DB column types) ─────────────────

const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/; // TIME columns, input type=time
const MONEY = /^\d+(\.\d{1,2})?$/; // DECIMAL(10,2) ≥ 0
const INT = /^\d+$/; // INTEGER ≥ 0
const E164 = /^\+[1-9]\d{1,14}$/; // staff_whatsapp_phone (VARCHAR(50))
const CLABE = /^\d{18}$/; // Mexican CLABE is exactly 18 digits

// ── Read boundary (zod) + projection contract (RC-1) ─────────────────

// PostgREST returns TIME as "HH:MM:SS", DECIMAL as a string, BOOLEAN as bool,
// INTEGER as number. The read schema is lenient on the wire shapes; the form
// schema (below) is strict on what the owner may submit.
export const settingsRowSchema = z.object({
  property_id: z.string(),
  staff_whatsapp_phone: z.string().nullable().optional(),
  autonomy_level: z.string(),
  check_in_time: z.string().nullable().optional(),
  check_out_time: z.string().nullable().optional(),
  breakfast_included: z.boolean(),
  breakfast_cost_per_person_mxn: z
    .union([z.string(), z.number()])
    .nullable()
    .optional(),
  breakfast_start_time: z.string().nullable().optional(),
  breakfast_end_time: z.string().nullable().optional(),
  breakfast_base_occupancy: z.number().nullable().optional(),
  breakfast_hours_text: z.string().nullable().optional(),
  payment_bank_name: z.string().nullable().optional(),
  payment_account_holder: z.string().nullable().optional(),
  payment_account_number: z.string().nullable().optional(),
  payment_clabe: z.string().nullable().optional(),
  payment_instructions_image_url: z.string().nullable().optional(),
  payment_extra_instructions: z.string().nullable().optional(),
  cancellation_policy: z.string().nullable().optional(),
  pet_policy: z.string().nullable().optional(),
  smoking_policy: z.string().nullable().optional(),
});
export type SettingsRow = z.infer<typeof settingsRowSchema>;

// Every column the schema reads MUST be in this SELECT (RC-1 projection contract).
export const SETTINGS_SELECT = ["property_id", ...SETTINGS_COLUMNS].join(", ");

// ── Form schema (strict; mirrors the DB CHECKs) ──────────────────────

/**
 * Form values are all strings (HTML input values) except the two booleans, so
 * `z.input === z.output` and react-hook-form's typing stays clean. Coercion to
 * the DB types happens in {@link toSettingsUpdate}. Nullable columns accept "".
 */
export const settingsFormSchema = z.object({
  // general
  staff_whatsapp_phone: z.string().trim().refine((v) => v === "" || E164.test(v), "phone"),
  autonomy_level: z.enum(AUTONOMY_LEVELS),
  check_in_time: z.string().regex(HH_MM, "time"), // NOT NULL in the DB
  check_out_time: z.string().regex(HH_MM, "time"), // NOT NULL in the DB
  // breakfast
  breakfast_included: z.boolean(),
  breakfast_cost_per_person_mxn: z.string().refine((v) => v === "" || MONEY.test(v), "money"),
  breakfast_start_time: z.string().refine((v) => v === "" || HH_MM.test(v), "time"),
  breakfast_end_time: z.string().refine((v) => v === "" || HH_MM.test(v), "time"),
  breakfast_base_occupancy: z
    .string()
    .refine((v) => v === "" || (INT.test(v) && Number(v) >= 1), "occupancy"),
  breakfast_hours_text: z.string().trim(),
  // payment
  payment_bank_name: z.string().trim(),
  payment_account_holder: z.string().trim(),
  payment_account_number: z.string().trim(),
  payment_clabe: z.string().trim().refine((v) => v === "" || CLABE.test(v), "clabe"),
  payment_instructions_image_url: z
    .string()
    .trim()
    .refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), "url"),
  payment_extra_instructions: z.string().trim(),
  // policies
  cancellation_policy: z.string().trim().min(1, "required"), // NOT NULL in the DB
  pet_policy: z.string().trim(),
  smoking_policy: z.string().trim(),
});
export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// ── Row → form values (pure) ─────────────────────────────────────────

/** "HH:MM:SS"/"HH:MM" → "HH:MM" for the time input; "" when absent. */
function toTimeInput(value: string | null | undefined): string {
  if (!value) return "";
  return value.length >= 5 ? value.slice(0, 5) : value;
}

/** Numeric/decimal → its string input form; "" when absent. */
function toNumberInput(value: string | number | null | undefined): string {
  if (value == null || value === "") return "";
  return String(value);
}

const blankIfNull = (v: string | null | undefined): string => v ?? "";

/**
 * Map a loaded settings row to form values. Pure → exercised directly by a unit
 * test (the TIME slice + the null→"" coercions are the bug-prone bits).
 */
export function rowToFormValues(row: SettingsRow): SettingsFormValues {
  return {
    staff_whatsapp_phone: blankIfNull(row.staff_whatsapp_phone),
    autonomy_level: (AUTONOMY_LEVELS as readonly string[]).includes(row.autonomy_level)
      ? (row.autonomy_level as AutonomyLevel)
      : "assisted",
    check_in_time: toTimeInput(row.check_in_time),
    check_out_time: toTimeInput(row.check_out_time),
    breakfast_included: row.breakfast_included,
    breakfast_cost_per_person_mxn: toNumberInput(row.breakfast_cost_per_person_mxn),
    breakfast_start_time: toTimeInput(row.breakfast_start_time),
    breakfast_end_time: toTimeInput(row.breakfast_end_time),
    breakfast_base_occupancy: toNumberInput(row.breakfast_base_occupancy),
    breakfast_hours_text: blankIfNull(row.breakfast_hours_text),
    payment_bank_name: blankIfNull(row.payment_bank_name),
    payment_account_holder: blankIfNull(row.payment_account_holder),
    payment_account_number: blankIfNull(row.payment_account_number),
    payment_clabe: blankIfNull(row.payment_clabe),
    payment_instructions_image_url: blankIfNull(row.payment_instructions_image_url),
    payment_extra_instructions: blankIfNull(row.payment_extra_instructions),
    cancellation_policy: blankIfNull(row.cancellation_policy),
    pet_policy: blankIfNull(row.pet_policy),
    smoking_policy: blankIfNull(row.smoking_policy),
  };
}

// ── Form values → UPDATE payload (pure; whitelist-bound) ─────────────

export type SettingsUpdate = Record<SettingsColumn, string | number | boolean | null>;

const numOrNull = (v: string): number | null => (v.trim() === "" ? null : Number(v));
const strOrNull = (v: string): string | null => (v.trim() === "" ? null : v.trim());

/**
 * Build the UPDATE payload. Keys are EXACTLY {@link SETTINGS_COLUMNS} (a unit
 * test asserts `keys ⊆ SETTINGS_COLUMNS`), coercing the string inputs to the
 * DB types and "" → null for the nullable columns. The two NOT-NULL columns
 * (check_in_time / check_out_time / cancellation_policy) are validated non-empty
 * by the form schema, so they never reach here blank.
 */
export function toSettingsUpdate(values: SettingsFormValues): SettingsUpdate {
  return {
    staff_whatsapp_phone: strOrNull(values.staff_whatsapp_phone),
    autonomy_level: values.autonomy_level,
    check_in_time: values.check_in_time,
    check_out_time: values.check_out_time,
    breakfast_included: values.breakfast_included,
    breakfast_cost_per_person_mxn: numOrNull(values.breakfast_cost_per_person_mxn),
    breakfast_start_time: strOrNull(values.breakfast_start_time),
    breakfast_end_time: strOrNull(values.breakfast_end_time),
    breakfast_base_occupancy: numOrNull(values.breakfast_base_occupancy),
    breakfast_hours_text: strOrNull(values.breakfast_hours_text),
    payment_bank_name: strOrNull(values.payment_bank_name),
    payment_account_holder: strOrNull(values.payment_account_holder),
    payment_account_number: strOrNull(values.payment_account_number),
    payment_clabe: strOrNull(values.payment_clabe),
    payment_instructions_image_url: strOrNull(values.payment_instructions_image_url),
    payment_extra_instructions: strOrNull(values.payment_extra_instructions),
    cancellation_policy: values.cancellation_policy.trim(),
    pet_policy: strOrNull(values.pet_policy),
    smoking_policy: strOrNull(values.smoking_policy),
  };
}

// ── Reads / writes ───────────────────────────────────────────────────

/** The property's settings row (RLS-scoped). `null` = absent or no access. */
export async function loadSettings(
  supabase: SupabaseClient,
  propertyId: string,
): Promise<SettingsRow | null> {
  const { data, error } = await supabase
    .from("property_configs")
    .select(SETTINGS_SELECT)
    .eq("property_id", propertyId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return settingsRowSchema.parse(data);
}

/**
 * Persist the editable settings subset for a property. Validates (fast,
 * friendly), then the UPDATE goes through PostgREST under RLS — owner-only by
 * the mig-080 policy + the 19-column grant. A non-owner / cross-tenant / out-of-
 * whitelist write fails there; the error propagates for the form to translate.
 */
export async function updateSettings(
  supabase: SupabaseClient,
  propertyId: string,
  values: SettingsFormValues,
): Promise<void> {
  const parsed = settingsFormSchema.parse(values);
  const payload = toSettingsUpdate(parsed);
  const { error } = await supabase
    .from("property_configs")
    .update(payload)
    .eq("property_id", propertyId);
  if (error) throw error;
}
