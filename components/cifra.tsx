"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A figure that counts up when it scrolls into view (operator, 2026-09-08, HQA-D165: the
 * counter effect of the earlier site on every figure). Every number inside the text
 * counts from zero to its value over 1.4 s with an ease-out; the words stay still; years
 * (19xx, 20xx) stay still. Under `prefers-reduced-motion` nothing moves. The server
 * renders the final text, so the page reads right without JavaScript.
 *
 * ACCESSIBILITY (2026-09-08, FASE 4): the final text was carried in an `aria-label` on the
 * <p> / <dt>. That is a naming attribute on an element with no role that supports naming,
 * so Chrome ignores it and the accessibility tree read "Solo el 0%" while the figure was
 * still out of view. The final text now lives in a visually hidden span, and the animated
 * one is hidden from assistive technology: what is announced is always the real figure.
 */
type Part = { text: string } | { num: number; decimals: number; grouped: boolean; suffix: string };
const TOKEN = /\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/g;

function parse(texto: string): Part[] {
  const parts: Part[] = [];
  let last = 0;
  for (const m of texto.matchAll(TOKEN)) {
    const raw = m[0];
    const i = m.index ?? 0;
    if (i > last) parts.push({ text: texto.slice(last, i) });
    const grouped = raw.includes(",");
    const clean = raw.replace(/,/g, "");
    const isYear = /^(19|20)\d{2}$/.test(clean);
    if (isYear) parts.push({ text: raw });
    else {
      const decimals = clean.includes(".") ? clean.split(".")[1].length : 0;
      parts.push({ num: Number(clean), decimals, grouped, suffix: "" });
    }
    last = i + raw.length;
  }
  if (last < texto.length) parts.push({ text: texto.slice(last) });
  return parts;
}

function render(parts: Part[], progress: number): string {
  return parts
    .map((p) => {
      if ("text" in p) return p.text;
      const v = p.num * progress;
      const fixed = v.toFixed(p.decimals);
      if (!p.grouped) return fixed;
      const [int, dec] = fixed.split(".");
      const g = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return dec ? `${g}.${dec}` : g;
    })
    .join("");
}

export function Cifra({ texto, className, as = "p" }: { texto: string; className?: string; as?: "p" | "dt" }) {
  const node = useRef<HTMLElement | null>(null);
  const setNode = useCallback((el: HTMLElement | null) => {
    node.current = el;
  }, []);
  const [shown, setShown] = useState(texto);
  useEffect(() => {
    const el = node.current;
    const parts = parse(texto);
    if (!el || !parts.some((p) => "num" in p)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // the zero start is scheduled, not set synchronously in the effect
    let raf = requestAnimationFrame(() => setShown(render(parts, 0)));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(render(parts, eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [texto]);
  const contenido = (
    <>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{texto}</span>
    </>
  );
  if (as === "dt") {
    return (
      <dt ref={setNode} className={className}>
        {contenido}
      </dt>
    );
  }
  return (
    <p ref={setNode} className={className}>
      {contenido}
    </p>
  );
}
