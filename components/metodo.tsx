import type { Locale, Messages } from "@/lib/i18n";
import { Container } from "./container";
import { Photo } from "./photo";
import { Ribbon } from "./ribbon";

export function Metodo({ locale, m }: { locale: Locale; m: Messages }) {
  return (
    <section id="metodo" aria-labelledby="metodo-title" className="py-24 md:py-36">
      <Container>
        <h2
          id="metodo-title"
          className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-texto"
        >
          {m.metodo.encabezado}
        </h2>
      </Container>
      <div className="relative mt-12 h-[60svh] min-h-[420px] md:mt-16 md:h-[78svh]">
        <Photo slug="asesoria" locale={locale} fill sizes="100vw" className="object-cover" />
      </div>
      <div className="relative overflow-hidden">
        <Ribbon variant="b" opacity={0.22} width={40} />
        <Container className="relative pt-16 md:pt-24">
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {m.metodo.etapas.map((e, i) => (
            /* The ghost numeral (2026-09-09, HQA-D183): the resource of the deleted Diana Hoteles page,
               components/hoteles/Problema.tsx at commit 34b0767, brought back behind the four stages. It is
               NOT text: the digits travel in `data-num` and are painted by `after:content-[attr(...)]`, so
               with `aria-hidden` and `select-none` they stay out of the accessibility tree, out of a
               selection and out of anything that extracts the page's text. Still, not animated: v5 drifted it
               with motion/react, which this site does not carry.
               The size is measured against the COLUMN, not the viewport: the box changed from a full-width
               row to a track of a four-column grid (270 px above 1280, 206 px at 1024, 324 px at 768), so the
               22vw of v5 would eat the neighbours. `@container` on the <li> makes 85cqw resolve to 0.85 of
               its own width at every breakpoint — the ghost is 1.09 times the column wide and crosses the
               hairline by 40 px, always, and 18rem caps it on the phone. */
            <li key={e.titulo} className="@container relative max-w-[40ch] border-t border-linea pt-6">
              <span
                aria-hidden="true"
                data-num={String(i + 1).padStart(2, "0")}
                className="pointer-events-none absolute -top-10 right-0 select-none font-display text-[clamp(9rem,85cqw,18rem)] font-semibold leading-none text-texto/[0.045] after:content-[attr(data-num)]"
              />
              <span aria-hidden="true" className="font-display text-sm tracking-[0.12em] text-azul-texto">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-2xl text-texto md:text-[1.75rem]">{e.titulo}</h3>
              <p className="mt-3 text-lg leading-relaxed text-texto-2">{e.texto}</p>
            </li>
          ))}
        </ol>
        </Container>
      </div>
    </section>
  );
}
