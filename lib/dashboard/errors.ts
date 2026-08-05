/**
 * Permission-refusal classification for dashboard writes (TD-2, 2026-08-04
 * tech-debt inventory P0-3 — the cockpit pattern, backported).
 *
 * Two refusal shapes exist:
 *
 *  - SILENT: an UPDATE whose RLS policy USING clause matched zero rows gets a
 *    PostgREST 204 with NO error — the write seams detect this via the
 *    load-bearing `.select()` (zero rows back = refusal) and throw
 *    `DashboardPermissionError`. Pre-fix, this case reported "Guardado" while
 *    the bot kept quoting the old data.
 *
 *  - LOUD: SQLSTATE 42501 (the mig-082 RPC `RAISE`, a `WITH CHECK` failure, a
 *    column-grant denial) arrives as a thrown PostgREST error.
 *    `isPermissionError(cause)` classifies it. The trap (verified in cockpit
 *    Slice 6, `lib/cockpit/postgrest-error.ts`): a supabase-js PostgREST error
 *    is a PLAIN OBJECT, not an `Error` — `String(cause)` is
 *    "[object Object]", so the old string-typed classifier silently never
 *    matched. Read `message` + `code` off the object shape too.
 *
 * RLS is the real fence; this module only decides whether to show the
 * friendly "no permission" copy vs. the generic error copy.
 */

export class DashboardPermissionError extends Error {
  constructor(
    message = "permission denied: row-level security matched zero rows (silent refusal)",
  ) {
    super(message);
    this.name = "DashboardPermissionError";
  }
}

export function isPermissionError(cause: unknown): boolean {
  if (cause instanceof DashboardPermissionError) return true;
  let source: string;
  if (cause instanceof Error) {
    source = cause.message;
  } else if (typeof cause === "object" && cause !== null) {
    const { code, message } = cause as { code?: unknown; message?: unknown };
    source = `${code ?? ""} ${message ?? ""}`;
  } else {
    source = String(cause);
  }
  // Same token set as the pre-TD-2 classifier (kept for the mig-082 RPC
  // message shapes), now applied to the real error content.
  return /42501|permission|denied|owner|row-level/i.test(source);
}
