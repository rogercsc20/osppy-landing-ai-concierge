import type { Locale, Messages } from "@/lib/i18n";
import { otherLocale } from "@/lib/i18n";
import { Container } from "./container";
import { Logo } from "./logo";

export function Footer({ locale, m }: { locale: Locale; m: Messages }) {
  const other = otherLocale(locale);
  return (
    <footer className="bg-negro py-14 text-sobre-negro md:py-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <Logo className="h-9 w-9 rounded-[0.6rem] ring-1 ring-sobre-negro/15" />
              <p className="font-display text-[1.75rem] leading-none">{m.footer.marca}</p>
            </div>
            <p className="mt-5 text-sm text-sobre-negro-2">{m.footer.lugar}</p>
            <a href={`mailto:${m.footer.contacto}`} className="mt-1 block text-sm text-azul underline-offset-4 hover:underline">
              {m.footer.contacto}
            </a>
          </div>
          <div className="md:col-span-5">
            <p className="max-w-[44ch] text-sm leading-relaxed text-sobre-negro-2">{m.footer.productos.texto}</p>
            <a href={`mailto:${m.footer.contacto}`} className="mt-2 inline-block text-sm text-azul underline-offset-4 hover:underline">
              {m.footer.productos.cta}
            </a>
          </div>
          <div className="text-sm text-sobre-negro-2 md:col-span-3 md:text-right">
            <a href={`/${other}`} hrefLang={other} lang={other} className="text-azul underline-offset-4 hover:underline">
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
