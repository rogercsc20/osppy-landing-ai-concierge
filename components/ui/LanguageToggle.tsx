"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  // The i18n-aware pathname (the internal key, e.g. "/hoteles"), so the
  // switch lands on the localized slug of the same page (/en/hotels).
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const otherLocale = locale === "es" ? "en" : "es";

  const switchLocale = () => {
    startTransition(() => {
      router.replace(pathname as never, { locale: otherLocale });
    });
  };

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        "border-line text-text-2 hover:border-text-2 hover:text-text",
        isPending && "cursor-not-allowed opacity-50",
      )}
      aria-label={t("langLabel")}
    >
      {t("lang")}
    </button>
  );
}
