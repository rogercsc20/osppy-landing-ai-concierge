import { getTranslations } from "next-intl/server";
import { Reveal, Stagger } from "@/components/fx/Reveal";
import { PaginaServicio } from "./PaginaServicio";
import { Seccion, Encaja, Precio, Faq, Cierre } from "./bloques";

/* /capacitacion — the page that CARRIES A CATALOG.

   Its heavy block is the routes, and that is what gives it a shape none of
   the other two has: a numbered vertical list, each row with its own status
   line, read top to bottom. /asesoria argues in three stacked convictions and
   /implementacion inventories in three grouped families; neither is a list
   you walk down. Three pages with the same skeleton and different words is
   the trap the v3 plan named by name.

   NO WORKSHOP IS MARKED ✅ here, and none can be until the operator says
   which (catalog §1.2, correction of 2026-09-03). The two status lines are
   E5a's decision 3: they are derived from the catalog's own legend, because
   the catalog marks FICHAS and never ROUTES, so a route's status does not
   exist in any source and had to be derived rather than invented. What the
   legend also allows in conversation and this page deliberately does NOT
   publish: the "two to three weeks" preparation lead time, and the entry
   talk's "no cost or nominal cost". A lead time on a page is a commitment to
   whoever reads it; "no cost" is a commercial promise, not a price
   structure. */

const RUTAS = ["r1", "r2", "r3", "r4"] as const;
const PERFILES = ["q1", "q2", "q3"] as const;

export async function PaginaCapacitacion({ locale }: { locale: string }) {
  const t = await getTranslations({
    locale,
    namespace: "servicios.capacitacion",
  });

  return (
    <main>
      <PaginaServicio slug="capacitacion" locale={locale} />

      {/* 2 · Qué es — two paragraphs, no ornament. */}
      <Seccion titulo={t("queEs.titulo")}>
        <Reveal delay={0.1} className="mt-8 max-w-3xl space-y-6">
          <p className="text-lg leading-relaxed text-text-2">{t("queEs.p1")}</p>
          <p className="text-lg leading-relaxed text-text-2">{t("queEs.p2")}</p>
        </Reveal>
      </Seccion>

      {/* 3 · Para quién — three objects, not three cards (plan §4.5). A row of
          three separated by rules: lighter than the card grid the house uses
          for its three doors, so the eye does not read them as links. */}
      <Seccion titulo={t("paraQuien.titulo")}>
        <Stagger
          className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3"
          variant="fade-up"
          itemClassName="h-full"
        >
          {PERFILES.map((k) => (
            <div key={k} className="h-full bg-bg p-7">
              <h3 className="font-display text-h4 font-semibold text-text">
                {t(`paraQuien.${k}Titulo`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-2">
                {t(`paraQuien.${k}Body`)}
              </p>
            </div>
          ))}
        </Stagger>
      </Seccion>

      {/* 4 · Las rutas — the page's heavy block, and its whole visual identity. */}
      <Seccion titulo={t("rutas.titulo")}>
        <Reveal delay={0.05}>
          <p className="mt-5 max-w-2xl leading-relaxed text-text-2">
            {t("rutas.intro")}
          </p>
        </Reveal>

        <Stagger
          className="mt-12 divide-y divide-line border-y border-line"
          variant="fade-up"
        >
          {RUTAS.map((k, i) => (
            <div
              key={k}
              className="grid gap-4 py-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8"
            >
              <span
                className="font-display text-h3 font-extrabold leading-none text-warm-text"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-h4 font-semibold text-text">
                  {t(`rutas.${k}Titulo`)}
                </h3>
                <p className="mt-3 max-w-3xl leading-relaxed text-text-2">
                  {t(`rutas.${k}Body`)}
                </p>
                <p className="mt-4 text-sm font-medium text-accent-text">
                  {t(`rutas.${k}Estado`)}
                </p>
              </div>
            </div>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-10 max-w-3xl">
          <h3 className="font-display text-h4 font-semibold text-text">
            {t("rutas.continuosTitulo")}
          </h3>
          <p className="mt-3 leading-relaxed text-text-2">
            {t("rutas.continuosBody")}
          </p>
          <p className="mt-8 border-t border-line pt-6 text-sm leading-relaxed text-text-2">
            {t("rutas.nota")}
          </p>
        </Reveal>
      </Seccion>

      {/* 5 · Lo que se ha hecho — one row, and one row is the honest amount.
          It is the only one of the ten kinds §3.3 routes to this page, and the
          source of truth §3.1 forbids publishing HOW MANY sessions have been
          delivered, which is the figure a track-record block would beg for. */}
      <Seccion titulo={t("hecho.titulo")}>
        <Reveal delay={0.1}>
          <div className="glass mt-8 max-w-3xl rounded-2xl p-8">
            <h3 className="font-display text-h4 font-semibold text-text">
              {t("hecho.t1Titulo")}
            </h3>
            <p className="mt-3 leading-relaxed text-text-2">
              {t("hecho.t1Body")}
            </p>
          </div>
        </Reveal>
      </Seccion>

      <Encaja slug="capacitacion" href="/asesoria" />
      <Precio slug="capacitacion" />
      <Faq slug="capacitacion" />
      <Cierre slug="capacitacion" />
    </main>
  );
}
