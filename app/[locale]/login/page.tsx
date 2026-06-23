"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

export default function LoginPage() {
  const t = useTranslations("dashboardApp.login");
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const authError = params.get("error") === "auth";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const next = params.get("next") ?? "";
    const redirectTo = `${window.location.origin}/auth/callback${
      next ? `?next=${encodeURIComponent(next)}` : ""
    }`;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="bg-canvas text-ink flex min-h-screen items-center justify-center px-6">
      <div className="border-line bg-ink-panel w-full max-w-md rounded-2xl border p-8 shadow-2xl">
        <h1 className="font-display text-2xl">{t("title")}</h1>
        <p className="mt-2 text-sm text-ink/60">{t("subtitle")}</p>

        {status === "sent" ? (
          <div className="border-line mt-6 rounded-xl border bg-canvas/40 p-4">
            <p className="font-medium">{t("sentTitle")}</p>
            <p className="mt-1 text-sm text-ink/60">{t("sentBody")}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm text-ink/70">
                {t("emailLabel")}
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className="border-line mt-1 w-full rounded-lg border bg-canvas/60 px-3 py-2 text-ink outline-none focus:border-turquoise-ink"
              />
            </div>

            {(status === "error" || authError) && (
              <p className="text-sm text-coral">
                {authError ? t("authError") : t("error")}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="bg-turquoise-deep hover:bg-turquoise w-full rounded-lg px-4 py-2 font-medium text-white transition-colors disabled:opacity-60"
            >
              {status === "sending" ? t("sending") : t("submit")}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
