import type { Locale, Messages } from "@/lib/i18n";
import { AreasHover } from "./areas-hover";

/** Cómo ayudamos (HQA-D152): the areas on the left, their photographs filling the right side on hover; the photo column bleeds to the viewport edge. */
export function Ayudamos({ locale, m }: { locale: Locale; m: Messages }) {
  const areas = Object.values(m.ayudamos.areas);
  return (
    <section id="ayudamos" aria-labelledby="ayudamos-title" className="py-24 md:py-36">
      <div className="mx-auto w-full max-w-[100rem] px-6 md:px-10 lg:pr-0">
        <h2
          id="ayudamos-title"
          className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-texto lg:pl-[max(0px,calc((100vw-80rem)/2-2.5rem))]"
        >
          {m.ayudamos.encabezado}
        </h2>
        <div className="mt-12 md:mt-16 lg:pl-[max(0px,calc((100vw-80rem)/2-2.5rem))]">
          <AreasHover locale={locale} areas={areas} ver={m.ayudamos.ver} />
        </div>
        <div className="mt-20 max-w-7xl md:mt-28 lg:pl-[max(0px,calc((100vw-80rem)/2-2.5rem))]">
          <h3 className="font-display text-2xl text-texto md:text-[1.75rem]">{m.construido.encabezado}</h3>
          <ul className="mt-6 grid gap-x-12 gap-y-3 text-lg leading-relaxed text-texto-2 md:grid-cols-2">
            {m.construido.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.85em] h-1.5 w-1.5 shrink-0 rounded-full bg-azul" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
