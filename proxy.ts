import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Marketing-only proxy: next-intl localization, nothing else. The operator
 * dashboard (and its Supabase session plumbing) moved to the cockpit at
 * app.osppy.com — Slice 8 retired the legacy `/dashboard` routes here, and
 * `next.config.ts` redirects the old login/dashboard URLs to the cockpit so
 * bookmarks keep working.
 */
export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for
    // - files with extensions (e.g. favicon.ico, sitemap.xml, robots.txt)
    // - Next.js internals (_next)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    "/(api|trpc)(.*)",
  ],
};
