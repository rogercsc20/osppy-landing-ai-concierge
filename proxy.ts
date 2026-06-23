import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

// /dashboard with or without a leading locale segment (/dashboard, /es/dashboard…).
const DASHBOARD_RE = /^\/(?:(?:es|en)\/)?dashboard(?:\/|$)/;

function isDashboardPath(pathname: string): boolean {
  return DASHBOARD_RE.test(pathname);
}

function localeOf(pathname: string): "es" | "en" {
  return pathname.startsWith("/en/") || pathname === "/en" ? "en" : "es";
}

/**
 * Single Next 16 proxy chaining (1) the Supabase session-refresh and
 * (2) next-intl localization, plus a /dashboard route guard. Marketing routes
 * keep next-intl's exact behavior with zero Supabase work; only dashboard
 * routes refresh the session and gate on auth.
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth callback (PKCE code exchange) is a route handler — skip i18n + guard.
  if (pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }

  // Marketing routes: unchanged next-intl behavior, no Supabase call.
  if (!isDashboardPath(pathname)) {
    return intlMiddleware(request);
  }

  // Dashboard: localize first — this is the response we attach cookies to.
  const response = intlMiddleware(request);

  // next-intl is redirecting (e.g. /dashboard → /es/dashboard); let it. The
  // guard fires on the localized follow-up request.
  if (response.headers.has("location")) {
    return response;
  }

  // Refresh the session (writes cookies onto `response`) and guard.
  const user = await updateSession(request, response);
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${localeOf(pathname)}/login`;
    url.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(url);
    // Carry the just-refreshed auth cookies onto the bounce so we don't drop a
    // session mid-refresh.
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - files with extensions (e.g. favicon.ico, sitemap.xml, robots.txt)
    // - Next.js internals (_next)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    "/(api|trpc)(.*)",
  ],
};
