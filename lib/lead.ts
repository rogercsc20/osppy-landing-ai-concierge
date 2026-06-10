export interface LeadResult {
  ok: boolean;
  /** true when no endpoint is configured (e.g. local dev before setup) */
  unconfigured?: boolean;
}

/**
 * POSTs a lead to the configured form endpoint (Formspree / Getform / similar).
 * Set NEXT_PUBLIC_LEAD_ENDPOINT to your form URL (e.g. https://formspree.io/f/xxxx).
 * The endpoint is a public submission URL, not a secret — NEXT_PUBLIC_ is fine.
 */
export async function submitLead(
  data: Record<string, string>,
): Promise<LeadResult> {
  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;

  if (!endpoint) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[lead] NEXT_PUBLIC_LEAD_ENDPOINT not set — lead not delivered:", data);
    }
    return { ok: false, unconfigured: true };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10_000),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
