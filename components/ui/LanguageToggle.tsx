"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const otherLocale = locale === "es" ? "en" : "es";

  const switchLocale = () => {
    const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className={cn(
        "text-sm font-medium px-3 py-1.5 rounded-full border transition-colors",
        "border-ink/20 text-ink/70 hover:text-ink hover:border-ink/40",
        isPending && "opacity-50 cursor-not-allowed"
      )}
      aria-label={`Switch to ${otherLocale === "es" ? "Spanish" : "English"}`}
    >
      {otherLocale.toUpperCase()}
    </button>
  );
}
