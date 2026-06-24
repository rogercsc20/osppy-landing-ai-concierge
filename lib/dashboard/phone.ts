import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

/**
 * Phone canonicalization for the dashboard — the JS twin of the backend's
 * `app.core.phone.to_e164` (api/app/core/phone.py).
 *
 * WHY this must match the Python exactly. The WhatsApp pipeline writes every
 * guest phone through `to_e164` at write time (mig 044 invariant), so the
 * canonical guest the bot resolves is keyed on that exact string. The
 * dashboard's manual-booking RPC (`create_manual_reservation`, mig 082) and
 * the complete-the-record write both go straight to the DB; if they store a
 * non-canonical phone the manually-booked guest becomes a DUPLICATE the
 * pipeline never resolves (`5213511477314`/`+5213511477314` vs the canonical
 * `+523511477314`), so every lifecycle send + board Replied/Sent silently
 * no-ops for that guest. Canonicalizing HERE, before the write, keeps the RPC
 * "dumb" and lets the backend's validating E.164 CHECK constraint stay a pure
 * format assertion that never rejects a legit booking.
 *
 * The algorithm mirrors `to_e164` line for line:
 *   1. Strip the legacy MX mobile "1" marker Meta still delivers
 *      (`521<10 digits>` → `52<10 digits>`) — libphonenumber does NOT
 *      auto-correct it (it returns invalid instead), exactly as the Python
 *      regex `_LEGACY_MX_MOBILE_PREFIX` compensates.
 *   2. Parse strictly; if a digits-only input fails the default-region
 *      validation, retry as `+<digits>` so a country-coded number without a
 *      leading `+` is still recognized.
 *   3. Return the E.164 string, or null if unparseable/invalid.
 *
 * `defaultRegion` is only consulted for input WITHOUT a leading `+`. The
 * dashboard forms require `+` (the E164 regex), so in practice the region is
 * never exercised — it is kept at the Python default ("MX") for parity and so
 * a future loosened form still has a sensible fallback. It is NOT a tenant
 * value (a `+`-prefixed number is self-describing); a non-MX tenant entering
 * `+1…`/`+34…` canonicalizes correctly regardless.
 */
const LEGACY_MX_MOBILE = /^(\+?)521(\d{10})$/;

export function toE164(
  raw: string | null | undefined,
  defaultRegion: CountryCode = "MX",
): string | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!s) return null;

  const hasPlus = s.startsWith("+");
  const digits = s.replace(/\D/g, "");
  if (!digits) return null;
  let compact = (hasPlus ? "+" : "") + digits;

  const legacy = LEGACY_MX_MOBILE.exec(compact);
  if (legacy) compact = legacy[1] + "52" + legacy[2];

  const candidates: Array<[string, CountryCode | undefined]> = [
    [compact, hasPlus ? undefined : defaultRegion],
  ];
  if (!hasPlus) candidates.push(["+" + digits, undefined]);

  for (const [candidate, region] of candidates) {
    const parsed = parsePhoneNumberFromString(candidate, region);
    if (parsed && parsed.isValid()) return parsed.number;
  }
  return null;
}

/** True when `toE164` can canonicalize the input — the zod validation gate. */
export function isCanonicalizablePhone(raw: string | null | undefined): boolean {
  return toE164(raw) !== null;
}
