import { expect, test } from "@playwright/test";
import { DashboardPermissionError, isPermissionError } from "@/lib/dashboard/errors";

/**
 * TD-2 (2026-08-04 tech-debt inventory) — ported from cockpit's
 * postgrest-error.spec. The trap this pins: a PostgREST error from
 * supabase-js is a PLAIN OBJECT, not an `Error` — `String(error)` is
 * "[object Object]", so the old string-typed classifier
 * (`isPermissionError(message: string)` fed by
 * `caught instanceof Error ? caught.message : String(caught)`) silently
 * never matched, and even a loud 42501 refusal rendered the generic
 * error copy instead of the friendly "no permission" copy.
 */

test("classifies the OBJECT-shaped PostgREST 42501 (the actual wire shape)", () => {
  expect(
    isPermissionError({
      code: "42501",
      message: 'permission denied for column "payment_clabe" of relation "property_configs"',
      details: null,
      hint: null,
    }),
  ).toBe(true);
  // Even when the message alone would not match, the code does.
  expect(isPermissionError({ code: "42501", message: "" })).toBe(true);
});

test("classifies Error-shaped and string-shaped refusals too", () => {
  expect(isPermissionError(new Error("new row violates row-level security"))).toBe(true);
  expect(isPermissionError("permission denied for table property_configs")).toBe(true);
  // The mig-082 RPC RAISE shape ("only the property owner…") keeps matching —
  // the pre-TD-2 token set was preserved on purpose.
  expect(isPermissionError(new Error("only the property owner may do this"))).toBe(true);
});

test("classifies the silent-refusal sentinel", () => {
  // Thrown by the write seams when the TD-2 select-back returns zero rows
  // (an RLS USING-filtered UPDATE: PostgREST 204, no error).
  expect(isPermissionError(new DashboardPermissionError())).toBe(true);
});

test("does not classify unrelated failures as permission problems", () => {
  expect(isPermissionError(new Error("fetch failed"))).toBe(false);
  expect(isPermissionError({ code: "23505", message: "duplicate key value" })).toBe(false);
  expect(isPermissionError(null)).toBe(false);
});
