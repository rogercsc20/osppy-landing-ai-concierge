import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for RSC reads + route handlers. Bound to the
 * Next 16 async cookie store. Reads run as role `authenticated` under RLS.
 *
 * The `setAll` try/catch covers being called from a Server Component, where
 * the cookie store is read-only — the proxy's session-refresh
 * (`lib/supabase/middleware.ts`) owns the cookie write on the response, so
 * swallowing here is safe.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — read-only cookie store. The
            // proxy refreshes the session cookie on the response instead.
          }
        },
      },
    },
  );
}
