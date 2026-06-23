import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Magic-link / invite landing. Supabase redirects here with a PKCE `code`;
 * exchange it for a session cookie, then continue into the dashboard (or the
 * `next` path the login flow stashed). Excluded from the proxy (`/auth/*`), so
 * no locale prefix is applied.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/es/login?error=auth`);
}

/** Only allow same-origin relative paths — never an attacker-supplied URL. */
function safeNext(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return "/es/dashboard";
}
