import type { Messages } from "@/lib/i18n";
import { Container } from "./container";

export function Datos({ m }: { m: Messages }) {
  return (
    <section id="datos" aria-labelledby="datos-title" className="py-24 md:py-36">
      <Container>
        <h2
          id="datos-title"
          className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-[-0.02em] text-tinta"
        >
          {m.datos.encabezado}
        </h2>
        <ul className="mt-12 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-10">
          {m.datos.items.map((d) => (
            <li key={d.fuente} className="border-t border-linea pt-6">
              <p className="font-display text-[clamp(2rem,3.5vw,2.75rem)] leading-[1.05] tracking-[-0.015em] text-petroleo-texto">
                {d.cifra}
              </p>
              <p className="mt-4 max-w-[36ch] text-lg leading-relaxed text-tinta">{d.texto}</p>
              <p className="mt-5 text-sm text-humo">
                <span className="sr-only">{m.datos.fuenteLabel}: </span>
                {d.fuente}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
