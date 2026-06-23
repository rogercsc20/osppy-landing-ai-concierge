"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  subscribeToConversationsList,
  subscribeToConversationThread,
} from "@/lib/dashboard/realtime";

/**
 * The conversations slice is READ-ONLY, so the only client concern is staying
 * live: this owns the Supabase Realtime subscription and calls `router.refresh()`
 * (debounced) when a message/task changes, so the server re-reads under RLS and
 * a new bubble / task / list-reorder appears within seconds. Renders nothing.
 *
 * `propertyId` → the list (all conversations for the property); `conversationId`
 * → one thread. Exactly one is passed by the page that mounts it.
 */
export function ConversationsRealtime({
  propertyId,
  conversationId,
}: {
  propertyId?: string;
  conversationId?: string;
}) {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const refresh = () => {
      // Coalesce bursts (an insert that also bumps a task) into one re-read.
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => router.refresh(), 250);
    };
    const unsubscribe = conversationId
      ? subscribeToConversationThread(supabase, conversationId, refresh)
      : propertyId
        ? subscribeToConversationsList(supabase, propertyId, refresh)
        : () => {};
    return () => {
      if (timer.current) clearTimeout(timer.current);
      unsubscribe();
    };
  }, [propertyId, conversationId, router]);

  return null;
}
