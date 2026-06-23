"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Stats refresh is **polling**, not Realtime (master plan §B5) — a low-frequency
 * client interval that `router.refresh()`es so the server re-reads the aggregates
 * under RLS. Pauses while the tab is hidden (no point refreshing an unwatched
 * page) and resumes on focus. Renders nothing.
 */
export function StatsPoller({ intervalMs = 60_000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (timer) return;
      timer = setInterval(() => router.refresh(), intervalMs);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else {
        router.refresh(); // catch up immediately on return, then resume polling
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [router, intervalMs]);

  return null;
}
