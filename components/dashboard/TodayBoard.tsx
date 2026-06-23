"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { subscribeToBoard } from "@/lib/dashboard/realtime";
import {
  ARRIVAL_CHIP_TRIGGERS,
  DEPARTURE_CHIP_TRIGGERS,
  type BoardCard,
  type LifecycleTrigger,
  type TodayBoard as BoardData,
} from "@/lib/dashboard/board";
import { ReservationCard } from "./ReservationCard";

/**
 * The today board (client — it owns the live Realtime subscription). Server
 * fetches the board under RLS and hands it down as props; this subscribes to
 * `reservations` + `lifecycle_sends` changes for the property and calls
 * `router.refresh()` (debounced) so the server re-reads and a chip / status
 * flips within seconds. Status writes live in `ReservationCard`.
 */
export function TodayBoard({
  board,
  propertyId,
  canWrite,
}: {
  board: BoardData;
  propertyId: string;
  canWrite: boolean;
}) {
  const t = useTranslations("dashboardApp.today");
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const refresh = () => {
      // Coalesce bursts (e.g. an UPDATE that touches both tables) into one read.
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => router.refresh(), 250);
    };
    const unsubscribe = subscribeToBoard(supabase, propertyId, refresh);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      unsubscribe();
    };
  }, [propertyId, router]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">{t("title")}</h1>
          <p className="text-ink/60 mt-1 text-sm">{t("subtitle", { date: board.today })}</p>
        </div>
        <dl className="flex gap-3 text-sm">
          <Stat label={t("summary.inHouse")} value={board.inHouseCount} />
          <Stat label={t("summary.arrivals")} value={board.arrivals.length} />
          <Stat label={t("summary.departures")} value={board.departures.length} />
        </dl>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Column
          title={t("arrivalsTitle")}
          empty={t("emptyArrivals")}
          cards={board.arrivals}
          triggers={ARRIVAL_CHIP_TRIGGERS}
          propertyId={propertyId}
          canWrite={canWrite}
        />
        <Column
          title={t("departuresTitle")}
          empty={t("emptyDepartures")}
          cards={board.departures}
          triggers={DEPARTURE_CHIP_TRIGGERS}
          propertyId={propertyId}
          canWrite={canWrite}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-line bg-ink-panel rounded-xl border px-3 py-1.5 text-center">
      <dt className="text-ink/50 text-xs">{label}</dt>
      <dd className="text-ink font-display text-lg leading-tight">{value}</dd>
    </div>
  );
}

function Column({
  title,
  empty,
  cards,
  triggers,
  propertyId,
  canWrite,
}: {
  title: string;
  empty: string;
  cards: BoardCard[];
  triggers: readonly LifecycleTrigger[];
  propertyId: string;
  canWrite: boolean;
}) {
  return (
    <section aria-label={title} className="space-y-3">
      <h2 className="text-ink/70 text-sm font-medium tracking-wide uppercase">
        {title} <span className="text-ink/40">({cards.length})</span>
      </h2>
      {cards.length === 0 ? (
        <p className="border-line text-ink/50 rounded-2xl border border-dashed p-6 text-sm">
          {empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {cards.map((card) => (
            <ReservationCard
              key={card.reservation_id}
              card={card}
              propertyId={propertyId}
              canWrite={canWrite}
              triggers={triggers}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
