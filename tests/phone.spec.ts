import { test, expect } from "@playwright/test";
import { isCanonicalizablePhone, toE164 } from "../lib/dashboard/phone";

// toE164 is the JS twin of the backend's app.core.phone.to_e164. These cases
// mirror the Python's behaviour exactly — the canonical string the dashboard
// stores MUST equal what the WhatsApp pipeline writes, or a manually-booked
// guest becomes a duplicate the bot never resolves (the 2026-06-23 incident).

test.describe("toE164 — parity with Python to_e164", () => {
  test("strips the legacy MX mobile '1' (the duplicate-guest bug)", () => {
    // What Meta delivers / a hotelier pastes, with and without the '+'.
    expect(toE164("+5213511477314")).toBe("+523511477314");
    expect(toE164("5213511477314")).toBe("+523511477314");
  });

  test("is idempotent on an already-canonical number", () => {
    expect(toE164("+523511477314")).toBe("+523511477314");
    expect(toE164("523511477314")).toBe("+523511477314"); // canonical digits, no '+'
  });

  test("canonicalizes a US/CA number (no '+' via leading country code)", () => {
    expect(toE164("12365124067")).toBe("+12365124067");
    expect(toE164("+12365124067")).toBe("+12365124067");
  });

  test("tolerates spacing / punctuation around the digits", () => {
    expect(toE164(" +52 (351) 147-7314 ")).toBe("+523511477314");
  });

  test("returns null for unparseable / invalid / empty input", () => {
    expect(toE164("+10000000000")).toBeNull(); // format-valid but not a real number
    expect(toE164("nope")).toBeNull();
    expect(toE164("")).toBeNull();
    expect(toE164("   ")).toBeNull();
    expect(toE164(null)).toBeNull();
    expect(toE164(undefined)).toBeNull();
  });

  test("isCanonicalizablePhone is the boolean gate the zod refine uses", () => {
    expect(isCanonicalizablePhone("+5213511477314")).toBe(true);
    expect(isCanonicalizablePhone("+10000000000")).toBe(false);
    expect(isCanonicalizablePhone("")).toBe(false);
  });
});
