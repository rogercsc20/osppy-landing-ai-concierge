"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Locale, Messages } from "@/lib/i18n";
import { PHOTOS, type PhotoSlug } from "@/lib/photos.generated";

type Item = Messages["industrias"]["items"][number];
type Labels = Pick<Messages["industrias"], "encabezado" | "ver" | "anterior" | "siguiente" | "etiqueta">;

/**
 * Industrias con las que trabajamos (HQA-D155, D158, D160 to D162): one photo card per attested
 * industry, each a link to its page. A native horizontal scroll track with snap points carries
 * touch and trackpad; the two arrows move one card; the mouse can drag the track; no autoplay.
 * The links stay real links, so the keyboard walks the cards with Tab and the track follows.
 */
export function IndustriasCarrusel({ locale, items, labels, grupo }: { locale: Locale; items: Item[]; labels: Labels; grupo: string }) {
  const track = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  function step(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = 24;
    const width = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * width, behavior: reduce ? "auto" : "smooth" });
  }
  function down(e: React.PointerEvent<HTMLUListElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    el.style.scrollSnapType = "none";
    el.setPointerCapture(e.pointerId);
  }
  function move(e: React.PointerEvent<HTMLUListElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    e.currentTarget.scrollLeft = d.left - dx;
  }
  function up(e: React.PointerEvent<HTMLUListElement>) {
    const d = drag.current;
    if (!d) return;
    const el = e.currentTarget;
    el.releasePointerCapture(e.pointerId);
    el.style.scrollSnapType = "";
    // keep `moved` for the click that follows the release, then forget the drag
    setTimeout(() => {
      drag.current = null;
    }, 0);
  }
  function click(e: React.MouseEvent<HTMLUListElement>) {
    if (drag.current?.moved) e.preventDefault();
  }

  const flecha = "inline-flex h-11 w-11 items-center justify-center rounded-full border border-sobre-negro/40 text-sobre-negro transition-colors hover:border-azul hover:text-azul";
  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <h2 id="industrias-title" className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em]">
          {labels.encabezado}
        </h2>
        <div className="hidden shrink-0 gap-3 md:flex">
          <button type="button" onClick={() => step(-1)} aria-label={labels.anterior} className={flecha}>
            <Flecha dir="izq" />
          </button>
          <button type="button" onClick={() => step(1)} aria-label={labels.siguiente} className={flecha}>
            <Flecha dir="der" />
          </button>
        </div>
      </div>
      <ul
        ref={track}
        aria-label={labels.etiqueta}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onClickCapture={click}
        className="-mx-6 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:-mx-10 md:mt-16 md:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it) => {
          const p = PHOTOS[it.foto as PhotoSlug];
          const alt = locale === "en" ? p.altEn : p.altEs;
          return (
            <li key={it.slug} className="w-[78vw] shrink-0 snap-start sm:w-[22rem] lg:w-[24rem]">
              <article>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem]">
                  <Image src={p.src} alt={alt} fill sizes="(min-width: 1024px) 24rem, (min-width: 640px) 22rem, 78vw" placeholder="blur" blurDataURL={p.blurDataURL} className="object-cover" draggable={false} />
                </div>
                <h3 className="mt-5 font-display text-2xl md:text-[1.75rem]">{it.nombre}</h3>
                <a
                  href={`/${locale}/${grupo}/${it.slug}`}
                  className="mt-4 inline-flex items-center rounded-full border border-azul px-5 py-2.5 text-sm font-medium text-azul transition-colors hover:bg-azul hover:text-negro"
                  draggable={false}
                >
                  {labels.ver}
                </a>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** One stroke, mirrored for the two arrows; a control, not decoration (docs/v6-02 §2.5). */
function Flecha({ dir }: { dir: "izq" | "der" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={`h-5 w-5 ${dir === "izq" ? "-scale-x-100" : ""}`} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
