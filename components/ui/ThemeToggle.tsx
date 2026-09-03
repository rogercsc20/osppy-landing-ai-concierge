"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

// The theme lives on <html data-theme> (set before paint by the layout's
// inline script); subscribing to that attribute keeps every toggle instance
// in sync without duplicated state.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const readTheme = () =>
  document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";

/**
 * Light/dark switch (HQA-D27): persists to localStorage and flips the
 * data-theme attribute the layout's inline script set before paint.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("theme");
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light");

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage unavailable (private mode): the choice just won't persist
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? t("toDark") : t("toLight")}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-text-2 transition-colors hover:text-text",
        className,
      )}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Sun className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
