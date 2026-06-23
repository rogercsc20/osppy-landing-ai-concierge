"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

/**
 * Error boundary for the whole dashboard route group. A read in lib/dashboard/*
 * that fails (PostgREST/RLS/network — now surfaced rather than swallowed) lands
 * here instead of Next's locale-less generic 500: a localized notice + a retry
 * that re-runs the failed Server Component render. The failure is logged so an
 * RLS regression or outage is observable, not silent.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("dashboardApp.errorBoundary");

  useEffect(() => {
    // Server-captured (Vercel logs) — keeps a read failure observable.
    console.error("dashboard_read_failed", error);
  }, [error]);

  return (
    <div className="max-w-md">
      <h1 className="font-display text-2xl">{t("title")}</h1>
      <p className="text-ink/60 mt-2 text-sm">{t("body")}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="bg-turquoise-deep hover:bg-turquoise mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
      >
        {t("retry")}
      </button>
    </div>
  );
}
