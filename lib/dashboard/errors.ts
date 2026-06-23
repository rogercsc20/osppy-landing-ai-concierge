/**
 * Classify a thrown PostgREST / RLS error message as a permission denial — the
 * shape an owner|staff|viewer write hits when the DB gate rejects it (the
 * mig-082 RPC `RAISE … ERRCODE 42501`, an RLS policy `WITH CHECK` failure, or a
 * column-grant denial). Centralized so every form handler classifies denials
 * identically (was four drifting inline regexes).
 *
 * RLS is the real fence; this only decides whether to show the friendly
 * "no permission" copy vs. the generic error copy.
 */
export function isPermissionError(message: string): boolean {
  return /42501|permission|denied|owner|row-level/i.test(message);
}
