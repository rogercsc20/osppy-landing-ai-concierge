import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { ShineButton } from "@/components/ui/ShineButton";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { whatsappHref } from "@/lib/site";
import type { ServicioSlug } from "./PaginaServicio";

/* The blocks the plan §4.5 gives ALL THREE pages the same shape: 6 (where it
   fits), 7 (pricing), 8 (FAQ) and 9 (close). They are shared because the plan
   made them identical, not because sharing was convenient — the rule that no
   page may repeat another's structure is about blocks 2 to 5, which is where
   each page's own body lives and where nothing is shared.

   The height rule: check-sections.mjs fails on `min-h-screen` inside a
   <section>, so any full-height wrapper goes on an inner div. Nothing here
   asks for one. */

/** The section shell every service block sits in: one rhythm down the page. */
export function Seccion({
  id,
  titulo,
  children,
  className = "",
}: {
  id?: string;
  titulo?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative px-4 py-section sm:px-6 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        {titulo ? (
          <Reveal>
            <h2 className="font-display max-w-3xl text-h2 font-semibold text-text">
              {titulo}
            </h2>
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/** Block 6 — where the service sits in the five-phase method, and the link to
    the next phase. The link is a real route, not an anchor: since E3c the
    method IS navigation, and this is the same edge read from the other end. */
export async function Encaja({
  slug,
  href,
}: {
  slug: ServicioSlug;
  href: AppPathname;
}) {
  const t = await getTranslations(`servicios.${slug}.encaja`);
  return (
    <Seccion>
      <Reveal>
        <div className="glass rounded-2xl p-8 sm:p-10">
          <h2 className="font-display text-h3 font-semibold text-text">
            {t("titulo")}
          </h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-text-2">
            {t("body")}
          </p>
          <Link
            href={href}
            className="link-underline group mt-8 inline-flex items-center gap-2 text-base font-medium text-accent-text"
          >
            <span>
              {t("enlaceTitulo")}: {t("enlaceCta")}
            </span>
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </Reveal>
    </Seccion>
  );
}

/** Block 7 — structure and not one figure (pricing.md §6). The closing line is
    the same in all three because pricing.md wrote it once, for the site. */
export async function Precio({ slug }: { slug: ServicioSlug }) {
  const t = await getTranslations(`servicios.${slug}.precio`);
  return (
    <Seccion titulo={t("titulo")}>
      <Reveal delay={0.1}>
        <p className="font-display mt-8 max-w-3xl text-h3 font-semibold leading-snug text-text">
          {t("body")}
        </p>
        <p className="mt-6 text-sm text-text-2">{t("cierre")}</p>
      </Reveal>
    </Seccion>
  );
}

/** Block 8 — the same native accordion the house uses: <details>/<summary>
    needs no JS and is keyboard-operable by default. The shared `name` makes
    the open panel exclusive; it is scoped per page, so two pages never fight
    over one group name. */
export async function Faq({ slug }: { slug: ServicioSlug }) {
  const t = await getTranslations(`servicios.${slug}.faq`);
  const items = (["1", "2", "3", "4"] as const).map((i) => ({
    q: t(`q${i}`),
    a: t(`a${i}`),
  }));

  return (
    <Seccion titulo={t("titulo")}>
      <Reveal delay={0.1} className="mt-12 max-w-3xl">
        {items.map((item) => (
          <details
            key={item.q}
            name={`faq-${slug}`}
            className="group border-b border-line py-2"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium text-text [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-text-2 transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <p className="max-w-2xl pb-4 leading-relaxed text-text-2">
              {item.a}
            </p>
          </details>
        ))}
      </Reveal>
    </Seccion>
  );
}

/** Block 9 — one close, one button, no paragraph. `whatsappHref` falls back to
    mailto while WHATSAPP_NUMBER is empty, which is still the case. */
export async function Cierre({ slug }: { slug: ServicioSlug }) {
  const t = await getTranslations(`servicios.${slug}`);
  return (
    <Seccion>
      <Reveal>
        <div className="flex flex-col items-start gap-8 border-t border-line pt-14">
          <h2 className="font-display max-w-3xl text-h2 font-semibold text-text">
            {t("cierre.titulo")}
          </h2>
          <ShineButton href={whatsappHref(t("ctaMessage"))}>
            {t("cierre.cta")}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </ShineButton>
        </div>
      </Reveal>
    </Seccion>
  );
}
