import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

/**
 * Refresh the Supabase session for a request and return the user (or null).
 *
 * Writes refreshed auth cookies onto BOTH the request (so a downstream read in
 * the same request sees them) and `response` (so the browser receives the
 * Set-Cookie). The caller owns `response` — next-intl produced it — and this
 * is the cookie/response handoff that, done wrong, logs users out
 * intermittently (see docs A2 §2 in the backend repo).
 *
 * Fails closed: if Supabase is unreachable / misconfigured, returns null so the
 * route guard redirects to login rather than the proxy throwing.
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse,
): Promise<User | null> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
