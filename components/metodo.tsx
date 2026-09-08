import type { Locale, Messages } from "@/lib/i18n";
import { Container } from "./container";
import { Photo } from "./photo";

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
      <Container className="pt-16 md:pt-24">
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {m.metodo.etapas.map((e, i) => (
            <li key={e.titulo} className="max-w-[40ch] border-t border-linea pt-6">
              <span aria-hidden="true" className="font-display text-sm tracking-[0.12em] text-azul-texto">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-2xl text-texto md:text-[1.75rem]">{e.titulo}</h3>
              <p className="mt-3 text-lg leading-relaxed text-texto-2">{e.texto}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
