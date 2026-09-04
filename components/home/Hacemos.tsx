import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger } from "@/components/fx/Reveal";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";

/* WHAT — three ways in, now three CLICKABLE cards (HQA-D88, and the
   operator's dictation: "que cada una de estas tres áreas sean unos
   recuadros que cuando haces hover pase alguna animación… y que te lleve a
   la página").

   The house keeps only the name, the status pill, one short line and the
   link. Everything that used to hang off each one — the training spec sheet,
   the four diagnosis questions, the nine kinds built — moved to the service
   page it belongs to, and the text of every one of those rows is in
   docs/2026-09-04-copy-mudado-a-servicios.md so E5 does not rebuild it from
   git history.

   The WHOLE CARD is the link and the arrow is decorative, rather than a card
   with a link inside it: one target, one focus stop, and a keyboard reader
   does not have to find the small text at the bottom. The three cards ARE
   equal here on purpose, which is the opposite of what this section used to
   do — they are equal because they are now three doors to three pages, and
   the page behind each one is where they stop being alike. */

const SERVICIOS = [
  { key: "capacitacion", href: "/capacitacion" },
  { key: "asesoria", href: "/asesoria" },
  { key: "implementacion", href: "/implementacion" },
] as const;

export async function Hacemos() {
  const t = await getTranslations("home.hacemos");

  return (
    <section id="hacemos" className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow">{t("kicker")}</p>
          <h2 className="font-display mt-5 max-w-3xl text-h2 font-semibold text-text">
            {t("headline")}
          </h2>
        </Reveal>

        <Stagger
          className="mt-14 grid gap-5 lg:grid-cols-3"
          variant="fade-up"
          itemClassName="h-full"
        >
          {SERVICIOS.map(({ key, href }) => (
            <Link
              key={key}
              href={href as AppPathname}
              className="glass group flex h-full flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent-text/40 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"
            >
              <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary-foreground">
                {t(`${key}.estado`)}
              </span>
              <h3 className="font-display mt-6 text-h3 font-semibold text-text">
                {t(`${key}.titulo`)}
              </h3>
              <p className="mt-4 leading-relaxed text-text-2">{t(`${key}.body`)}</p>
              <span className="mt-auto flex items-center gap-1.5 pt-8 text-sm font-medium text-accent-text">
                {t(`${key}.cta`)}
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
