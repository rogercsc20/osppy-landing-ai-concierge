"use client";

import { useSyncExternalStore } from "react";

const EVENT = "osppy-theme";
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};
const getSnapshot = () => document.documentElement.getAttribute("data-theme") === "dark";
const getServerSnapshot = () => false;

/**
 * Dark mode switch (HQA-D152, D158): light by default; the choice lives in localStorage("theme")
 * and the inline script in the layout applies it before paint. The button shows a moon (to go
 * dark) or a sun (to come back to light) as inline strokes, with the action as its accessible
 * name in the page's language. It is a control, not decoration: the visual system's "zero
 * iconography" rule (docs/v6-02 §2.5) does not reach it.
 */
export function ThemeToggle({ oscuro, claro, tono }: { oscuro: string; claro: string; tono: string }) {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  function toggle() {
    const next = !dark;
    if (next) document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }
  const label = dark ? claro : oscuro;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-azul hover:text-azul ${tono}`}
    >
      {dark ? <Sol /> : <Luna />}
    </button>
  );
}

const trazo = { fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** The sun: a disc and eight rays. Shown in dark mode, where pressing it returns to light. */
function Sol() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="h-[1.1rem] w-[1.1rem]" {...trazo}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5" />
    </svg>
  );
}

/** The moon: one crescent. Shown in light mode, where pressing it turns the dark mode on. */
function Luna() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="h-[1.1rem] w-[1.1rem]" {...trazo}>
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
    </svg>
  );
}
