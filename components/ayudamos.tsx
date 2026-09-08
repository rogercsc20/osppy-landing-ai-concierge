import type { Locale, Messages } from "@/lib/i18n";
import { AreasHover } from "./areas-hover";
import { LogoRing } from "./logo";

/**
 * Cómo ayudamos (HQA-D152, D154): the band's format, deep teal with Osppy watermarks; the areas on
 * the left, their photographs filling the right side on hover. The watermarks live in their own
 * cropped layer (2026-09-08): an `overflow-hidden` ancestor turns `position: sticky` off, and the
 * hover photograph is a sticky panel, so the crop cannot sit on the content wrapper.
 */
export function Ayudamos({ locale, m }: { locale: Locale; m: Messages }) {
  const areas = Object.values(m.ayudamos.areas);
  return (
    <section id="ayudamos" aria-labelledby="ayudamos-title" className="bg-profundo text-sobre-profundo">
      <div className="relative py-24 md:py-36">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <LogoRing className="absolute -left-[14%] top-[6%] h-[70%] w-auto opacity-[0.22]" />
          <LogoRing className="absolute -bottom-[10%] right-[38%] h-[46%] w-auto opacity-[0.16]" />
        </div>
        <div className="relative mx-auto w-full max-w-[100rem] px-6 md:px-10 lg:pr-0">
          <h2
            id="ayudamos-title"
            className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em] lg:pl-[max(0px,calc((100vw-80rem)/2-2.5rem))]"
          >
            {m.ayudamos.encabezado}
          </h2>
          <div className="mt-12 md:mt-16 lg:pl-[max(0px,calc((100vw-80rem)/2-2.5rem))]">
            <AreasHover locale={locale} areas={areas} ver={m.ayudamos.ver} />
          </div>
          <div className="mt-20 max-w-7xl md:mt-28 lg:pl-[max(0px,calc((100vw-80rem)/2-2.5rem))]">
            <h3 className="font-display text-2xl md:text-[1.75rem]">{m.construido.encabezado}</h3>
            <ul className="mt-6 grid gap-x-12 gap-y-3 text-lg leading-relaxed text-sobre-profundo-2 md:grid-cols-2">
              {m.construido.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.85em] h-1.5 w-1.5 shrink-0 rounded-full bg-azul" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
