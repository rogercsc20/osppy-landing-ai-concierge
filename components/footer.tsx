import type { Locale, Messages } from "@/lib/i18n";
import { otherLocale } from "@/lib/i18n";
import { Container } from "./container";

export function Footer({ locale, m }: { locale: Locale; m: Messages }) {
  const other = otherLocale(locale);
  return (
    <footer className="border-t border-linea py-14 md:py-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-display text-[1.75rem] leading-none text-tinta">{m.footer.marca}</p>
            <p className="mt-4 text-sm text-humo">{m.footer.lugar}</p>
            <a href={`mailto:${m.footer.contacto}`} className="mt-1 block text-sm text-petroleo-texto underline-offset-4 hover:underline">
              {m.footer.contacto}
            </a>
          </div>
          <div className="md:col-span-5">
            <p className="max-w-[44ch] text-sm leading-relaxed text-humo">{m.footer.productos.texto}</p>
            <a href={`mailto:${m.footer.contacto}`} className="mt-2 inline-block text-sm text-petroleo-texto underline-offset-4 hover:underline">
              {m.footer.productos.cta}
            </a>
          </div>
          <div className="text-sm text-humo md:col-span-3 md:text-right">
            <a href={`/${other}`} hrefLang={other} lang={other} className="underline-offset-4 hover:underline">
              {m.nav.idioma}
            </a>
            <p className="mt-4">{m.footer.legal.nombre}</p>
            <p className="mt-1">{m.footer.legal.copyright}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
