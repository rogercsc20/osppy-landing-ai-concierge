"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "signing" | "error";

/** Only allow same-origin relative paths — never an attacker-supplied URL. */
function safeNext(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return "/es/dashboard";
}

export default function LoginPage() {
  const t = useTranslations("dashboardApp.login");
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // A stale magic-link callback can still bounce here with ?error=auth.
  const authError = params.get("error") === "auth";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("signing");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      return;
    }

    // signInWithPassword set the session cookie on the browser client. Do a
    // full navigation (not router.push) so the proxy re-reads the fresh auth
    // cookie server-side and the guard lets us through.
    window.location.assign(safeNext(params.get("next")));
  }

  return (
    <main className="bg-canvas text-ink flex min-h-screen items-center justify-center px-6">
      <div className="border-line bg-ink-panel w-full max-w-md rounded-2xl border p-8 shadow-2xl">
        <h1 className="font-display text-2xl">{t("title")}</h1>
        <p className="mt-2 text-sm text-ink/60">{t("subtitle")}</p>

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

          <div>
            <label htmlFor="password" className="text-sm text-ink/70">
              {t("passwordLabel")}
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
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
            disabled={status === "signing"}
            className="bg-turquoise-deep hover:bg-turquoise w-full rounded-lg px-4 py-2 font-medium text-white transition-colors disabled:opacity-60"
          >
            {status === "signing" ? t("signing") : t("submit")}
          </button>

          <p className="text-xs text-ink/50">{t("forgot")}</p>
        </form>
      </div>
    </main>
  );
}
