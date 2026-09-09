"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale, Messages } from "@/lib/i18n";
import { PHOTOS, type PhotoSlug } from "@/lib/photos.generated";

type Area = Messages["ayudamos"]["areas"][keyof Messages["ayudamos"]["areas"]];

/**
 * Cómo ayudamos (HQA-D152): eight areas, each a link to its page; on hover or focus its
 * photograph fills the whole right side. On small screens every area shows its photo above.
 */
export function AreasHover({ locale, areas, ver }: { locale: Locale; areas: Area[]; ver: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <ul className="lg:col-span-6">
        {areas.map((a, i) => {
          const p = PHOTOS[a.foto as PhotoSlug];
          const alt = locale === "en" ? p.altEn : p.altEs;
          return (
            <li key={a.slug} className="border-t border-sobre-profundo/25">
              <a
                href={`/${locale}/${a.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-current={active === i ? "true" : undefined}
                className="group block py-6 transition-colors md:py-7"
              >
                <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-[1rem] lg:hidden">
                  <Image src={p.src} alt={alt} fill sizes="100vw" quality={90} placeholder="blur" blurDataURL={p.blurDataURL} className="object-cover" />
                </div>
                <h3 className="font-display text-2xl text-sobre-profundo transition-colors group-hover:text-azul md:text-[1.9rem]">
                  {a.nombre}
                </h3>
                <p className="mt-2 max-w-[44ch] text-[1.05rem] leading-relaxed text-sobre-profundo-2">{a.texto}</p>
                <span className="mt-3 inline-block text-sm font-medium text-azul opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {ver}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <div className="relative hidden lg:col-span-6 lg:block">
        <div className="sticky top-0 h-[100svh]">
          {areas.map((a, i) => {
            const p = PHOTOS[a.foto as PhotoSlug];
            const alt = locale === "en" ? p.altEn : p.altEs;
            return (
              <div
                key={a.slug}
                aria-hidden={active !== i}
                className={`absolute inset-0 transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-0"}`}
              >
                <Image src={p.src} alt={alt} fill sizes="50vw" quality={90} placeholder="blur" blurDataURL={p.blurDataURL} className="object-cover" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
