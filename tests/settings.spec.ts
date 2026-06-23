import { test, expect } from "@playwright/test";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  AUTONOMY_LEVELS,
  SETTINGS_COLUMNS,
  SETTINGS_SELECT,
  loadSettings,
  rowToFormValues,
  settingsFormSchema,
  settingsRowSchema,
  toSettingsUpdate,
  updateSettings,
  type SettingsFormValues,
  type SettingsRow,
} from "../lib/dashboard/settings";
import { canWriteReservations, canWriteSettings } from "../lib/dashboard/membership";

// A fully-populated, valid form value set (mutate per-test).
const validForm = (over: Partial<SettingsFormValues> = {}): SettingsFormValues => ({
  staff_whatsapp_phone: "+523300000000",
  autonomy_level: "assisted",
  check_in_time: "15:00",
  check_out_time: "11:00",
  breakfast_included: true,
  breakfast_cost_per_person_mxn: "100.00",
  breakfast_start_time: "08:00",
  breakfast_end_time: "12:00",
  breakfast_base_occupancy: "2",
  breakfast_hours_text: "8 AM – 12 PM",
  payment_bank_name: "Santander",
  payment_account_holder: "Aura SA de CV",
  payment_account_number: "65510543251",
  payment_clabe: "014320655105432513",
  payment_instructions_image_url: "",
  payment_extra_instructions: "",
  cancellation_policy: "flexible",
  pet_policy: "",
  smoking_policy: "",
  ...over,
});

// A loaded row as PostgREST returns it (TIME as HH:MM:SS, DECIMAL as string).
const dbRow = (over: Partial<SettingsRow> = {}): SettingsRow => ({
  property_id: "p1",
  staff_whatsapp_phone: "+523300000000",
  autonomy_level: "semi_auto",
  check_in_time: "15:00:00",
  check_out_time: "11:00:00",
  breakfast_included: true,
  breakfast_cost_per_person_mxn: "100.00",
  breakfast_start_time: "08:00:00",
  breakfast_end_time: "12:00:00",
  breakfast_base_occupancy: 2,
  breakfast_hours_text: "8 AM – 12 PM",
  payment_bank_name: "Santander",
  payment_account_holder: "Aura SA de CV",
  payment_account_number: "65510543251",
  payment_clabe: "014320655105432513",
  payment_instructions_image_url: null,
  payment_extra_instructions: null,
  cancellation_policy: "flexible",
  pet_policy: null,
  smoking_policy: null,
  ...over,
});

// ── The 19-column whitelist contract ─────────────────────────────────

test.describe("SETTINGS_COLUMNS whitelist", () => {
  test("is exactly the mig-080 PART E grant (19 columns)", () => {
    expect(SETTINGS_COLUMNS.length).toBe(19);
    // payment_methods + every JSONB block are deliberately NOT grantable.
    expect(SETTINGS_COLUMNS).not.toContain("payment_methods");
    expect(SETTINGS_COLUMNS).not.toContain("service_fee_policy");
    expect(SETTINGS_COLUMNS).not.toContain("family_amenities");
  });

  test("toSettingsUpdate keys are EXACTLY the whitelist (subset AND superset)", () => {
    const keys = Object.keys(toSettingsUpdate(validForm()));
    expect(new Set(keys)).toEqual(new Set(SETTINGS_COLUMNS));
    // No payload key escapes the grant → no PostgREST grant error from a stray column.
    for (const k of keys) {
      expect((SETTINGS_COLUMNS as readonly string[]).includes(k)).toBe(true);
    }
  });
});

// ── RC-1 projection contract ─────────────────────────────────────────

test.describe("projection contract", () => {
  test("SETTINGS_SELECT covers every read-schema field", () => {
    for (const field of Object.keys(settingsRowSchema.shape)) {
      expect(SETTINGS_SELECT).toContain(field);
    }
  });
});

// ── rowToFormValues (TIME slice + null coercions) ────────────────────

test.describe("rowToFormValues", () => {
  test("slices HH:MM:SS → HH:MM for time inputs", () => {
    const v = rowToFormValues(dbRow());
    expect(v.check_in_time).toBe("15:00");
    expect(v.check_out_time).toBe("11:00");
    expect(v.breakfast_start_time).toBe("08:00");
  });

  test("null columns become empty strings; numbers stringify", () => {
    const v = rowToFormValues(dbRow({ pet_policy: null, breakfast_base_occupancy: 4, breakfast_cost_per_person_mxn: "150.50" }));
    expect(v.pet_policy).toBe("");
    expect(v.payment_instructions_image_url).toBe("");
    expect(v.breakfast_base_occupancy).toBe("4");
    expect(v.breakfast_cost_per_person_mxn).toBe("150.50");
  });

  test("an unknown autonomy_level falls back to 'assisted'", () => {
    expect(rowToFormValues(dbRow({ autonomy_level: "weird" })).autonomy_level).toBe("assisted");
    expect(rowToFormValues(dbRow({ autonomy_level: "full_auto" })).autonomy_level).toBe("full_auto");
  });
});

// ── toSettingsUpdate (type coercions + ""→null) ──────────────────────

test.describe("toSettingsUpdate", () => {
  test("coerces money/occupancy to numbers and blanks to null", () => {
    const u = toSettingsUpdate(validForm({ breakfast_cost_per_person_mxn: "150.5", breakfast_base_occupancy: "3", pet_policy: "  ", payment_clabe: "" }));
    expect(u.breakfast_cost_per_person_mxn).toBe(150.5);
    expect(u.breakfast_base_occupancy).toBe(3);
    expect(u.pet_policy).toBe(null); // whitespace-only → null
    expect(u.payment_clabe).toBe(null);
  });

  test("keeps the NOT-NULL columns as non-null values", () => {
    const u = toSettingsUpdate(validForm());
    expect(u.check_in_time).toBe("15:00");
    expect(u.cancellation_policy).toBe("flexible");
    expect(u.breakfast_included).toBe(true);
  });
});

// ── settingsFormSchema (mirrors the DB CHECKs) ───────────────────────

test.describe("settingsFormSchema validation", () => {
  test("accepts a well-formed form", () => {
    expect(settingsFormSchema.safeParse(validForm()).success).toBe(true);
  });

  test("rejects an out-of-enum autonomy level", () => {
    expect(settingsFormSchema.safeParse(validForm({ autonomy_level: "turbo" as never })).success).toBe(false);
  });

  test("requires HH:MM check-in/out times", () => {
    expect(settingsFormSchema.safeParse(validForm({ check_in_time: "" })).success).toBe(false);
    expect(settingsFormSchema.safeParse(validForm({ check_in_time: "9am" })).success).toBe(false);
    expect(settingsFormSchema.safeParse(validForm({ check_in_time: "25:00" })).success).toBe(false);
  });

  test("rejects negative / malformed money and sub-1 occupancy", () => {
    expect(settingsFormSchema.safeParse(validForm({ breakfast_cost_per_person_mxn: "-5" })).success).toBe(false);
    expect(settingsFormSchema.safeParse(validForm({ breakfast_cost_per_person_mxn: "abc" })).success).toBe(false);
    expect(settingsFormSchema.safeParse(validForm({ breakfast_base_occupancy: "0" })).success).toBe(false);
  });

  test("allows blank optional fields but requires cancellation policy", () => {
    expect(settingsFormSchema.safeParse(validForm({ breakfast_cost_per_person_mxn: "", breakfast_start_time: "", payment_clabe: "" })).success).toBe(true);
    expect(settingsFormSchema.safeParse(validForm({ cancellation_policy: "" })).success).toBe(false);
  });

  test("validates phone, CLABE and URL when present, ignores when blank", () => {
    expect(settingsFormSchema.safeParse(validForm({ staff_whatsapp_phone: "33-00" })).success).toBe(false);
    expect(settingsFormSchema.safeParse(validForm({ staff_whatsapp_phone: "" })).success).toBe(true);
    expect(settingsFormSchema.safeParse(validForm({ payment_clabe: "123" })).success).toBe(false);
    expect(settingsFormSchema.safeParse(validForm({ payment_instructions_image_url: "not a url" })).success).toBe(false);
    expect(settingsFormSchema.safeParse(validForm({ payment_instructions_image_url: "https://x.io/a.png" })).success).toBe(true);
  });
});

// ── The owner-only gate ──────────────────────────────────────────────

test.describe("canWriteSettings", () => {
  test("only owner may write settings (NOT staff/viewer)", () => {
    expect(canWriteSettings("owner")).toBe(true);
    expect(canWriteSettings("staff")).toBe(false);
    expect(canWriteSettings("viewer")).toBe(false);
  });
  test("is strictly narrower than reservations-write (staff can write reservations)", () => {
    expect(canWriteReservations("staff")).toBe(true);
    expect(canWriteSettings("staff")).toBe(false);
  });
});

// ── A chainable fake Supabase client that captures the update payload ─

function fakeSupabase(opts: {
  row?: unknown;
  updateError?: Error;
  selectError?: Error;
  onUpdate?: (payload: Record<string, unknown>) => void;
}) {
  class Builder {
    select() {
      return this;
    }
    eq() {
      return this;
    }
    maybeSingle() {
      return Promise.resolve({ data: opts.row ?? null, error: opts.selectError ?? null });
    }
    update(payload: Record<string, unknown>) {
      opts.onUpdate?.(payload);
      // .update(...).eq(...).eq(...) resolves to { error }
      return {
        eq() {
          return this;
        },
        then<R>(onFulfilled: (v: { error: Error | null }) => R) {
          return Promise.resolve({ error: opts.updateError ?? null }).then(onFulfilled);
        },
      };
    }
  }
  return {
    from() {
      return new Builder();
    },
  } as unknown as SupabaseClient;
}

// ── loadSettings (read seam) ─────────────────────────────────────────

test.describe("loadSettings", () => {
  test("parses the row through the zod boundary", async () => {
    const client = fakeSupabase({ row: dbRow({ autonomy_level: "full_auto" }) });
    const row = await loadSettings(client, "p1");
    expect(row?.autonomy_level).toBe("full_auto");
    expect(row?.property_id).toBe("p1");
  });

  test("returns null when the row is absent / not accessible", async () => {
    expect(await loadSettings(fakeSupabase({ row: null }), "p1")).toBe(null);
  });

  test("propagates a PostgREST read error", async () => {
    await expect(loadSettings(fakeSupabase({ selectError: new Error("boom") }), "p1")).rejects.toThrow(/boom/);
  });
});

// ── updateSettings (write seam) ──────────────────────────────────────

test.describe("updateSettings", () => {
  test("sends only whitelisted columns in the payload", async () => {
    let captured: Record<string, unknown> | null = null;
    const client = fakeSupabase({ onUpdate: (p) => (captured = p) });
    await updateSettings(client, "p1", validForm());
    expect(captured).not.toBeNull();
    const keys = Object.keys(captured!);
    expect(new Set(keys)).toEqual(new Set(SETTINGS_COLUMNS));
  });

  test("surfaces an RLS / grant error (e.g. 42501) for the form to translate", async () => {
    const client = fakeSupabase({ updateError: new Error("permission denied (42501)") });
    await expect(updateSettings(client, "p1", validForm())).rejects.toThrow(/42501/);
  });

  test("rejects an invalid form before touching the network", async () => {
    let touched = false;
    const client = fakeSupabase({ onUpdate: () => (touched = true) });
    await expect(updateSettings(client, "p1", validForm({ autonomy_level: "nope" as never }))).rejects.toThrow();
    expect(touched).toBe(false);
  });
});

// ── Sanity: the autonomy enum the form offers ────────────────────────

test("AUTONOMY_LEVELS matches the mig-017 chk_autonomy_level set", () => {
  expect([...AUTONOMY_LEVELS]).toEqual(["faq_only", "assisted", "semi_auto", "full_auto"]);
});

// ── Route guard (e2e) ────────────────────────────────────────────────

test.describe("settings route guard", () => {
  test("unauthenticated /es/dashboard/settings redirects to login", async ({ page }) => {
    await page.goto("/es/dashboard/settings");
    await expect(page).toHaveURL(/\/es\/login(\?|$)/);
  });
});
