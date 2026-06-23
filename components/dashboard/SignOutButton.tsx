"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({ label, locale }: { label: string; locale: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await createClient().auth.signOut();
    router.replace(`/${locale}/login`);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="border-line rounded-lg border px-3 py-1.5 text-sm text-ink/70 transition-colors hover:text-ink disabled:opacity-60"
    >
      {label}
    </button>
  );
}
