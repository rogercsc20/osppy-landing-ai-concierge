"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/fx/motion-hooks";
import { cn } from "@/lib/utils";
import { DUR, EASE_LUXE } from "@/lib/motion";

const THEME_COLOR = { dark: "#0a0f0e", light: "#f7f5f0" } as const;

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
  document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";

/**
 * Light/dark switch (HQA-D38, D42): one control for the whole site — the
 * product pages follow it too, since the hotel world is an accent override
 * now and not a theme of its own.
 *
 * The flip opens as a circle from this button when the browser supports view
 * transitions; otherwise a 400 ms colour cross-fade (.theme-fade) carries it.
 * Neither runs under prefers-reduced-motion.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("theme");
  const reduce = useReducedMotion();
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark");

  const apply = (next: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", next);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLOR[next]);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage unavailable (private mode): the choice just won't persist
    }
  };

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = theme === "light" ? "dark" : "light";
    const root = document.documentElement;

    if (reduce) {
      apply(next);
      return;
    }

    const start = (
      document as Document & {
        startViewTransition?: (cb: () => void) => { finished: Promise<void> };
      }
    ).startViewTransition;

    if (typeof start !== "function") {
      // No view transitions: cross-fade the painted colours for the length of
      // the flip, then take the transition rule back off so ordinary hover
      // states stay instant.
      root.classList.add("theme-fade");
      apply(next);
      window.setTimeout(() => root.classList.remove("theme-fade"), 450);
      return;
    }

    // The circle opens from the button and has to reach the far corner.
    const r = event.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    root.style.setProperty("--vt-x", `${x}px`);
    root.style.setProperty("--vt-y", `${y}px`);
    root.style.setProperty("--vt-r", `${radius}px`);
    root.dataset.vt = "theme";

    start.call(document, () => apply(next)).finished.finally(() => {
      delete root.dataset.vt;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? t("toDark") : t("toLight")}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line text-text-2 transition-colors hover:border-accent-text/40 hover:text-text",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={reduce ? false : { y: 12, opacity: 0, rotate: -35 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={reduce ? undefined : { y: -12, opacity: 0, rotate: 35 }}
          transition={{ duration: DUR.fast, ease: EASE_LUXE }}
          className="flex items-center justify-center"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Sun className="h-4 w-4" aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
