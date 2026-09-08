"use client";

import { useSyncExternalStore } from "react";

const EVENT = "osppy-theme";
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};
const getSnapshot = () => document.documentElement.getAttribute("data-theme") === "dark";
const getServerSnapshot = () => false;

/** Dark mode switch (HQA-D152): light by default; the choice lives in localStorage("theme") and the inline script in the layout applies it before paint. */
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
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-azul hover:text-azul ${tono}`}
    >
      {dark ? claro : oscuro}
    </button>
  );
}
