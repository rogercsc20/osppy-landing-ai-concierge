import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client (anon key + the user's session cookie).
 * Runs as Postgres role `authenticated`; RLS is the tenant fence. The
 * service-role key never reaches the browser (CI guard enforces this).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
