import { getTranslations } from "next-intl/server";
import { Reveal, Stagger } from "@/components/fx/Reveal";
import { SplitText } from "@/components/fx/SplitText";
import { PaginaServicio } from "./PaginaServicio";
import { Seccion, Encaja, Precio, Faq, Cierre } from "./bloques";

/* /asesoria — the page that CARRIES AN ARGUMENT.

   Its heavy block is the convictions, and the plan says so in as many words:
   "el corazón de esta página, no un adorno". So they are not a card grid.
   Each conviction takes a full row, numbered, with the statement large enough
   to be read as a claim rather than as a feature. That is the shape:
   /capacitacion walks down a catalog, /implementacion groups an inventory,
   and this page makes a case.

   The three OUTCOMES that follow are deliberately built the other way, as a
   three-column grid, so the reader does not meet the same object twice on one
   page. "Todavía no" is the third of them and is not softened: source of
   truth §3.1 and the guide both make the honest no part of the product, and
   in the house that sentence was buried at the end of a five-paragraph block.

   Process structuring sits on THIS page by E5a's decision 4, closed
   2026-09-04. The reason is not that oferta.md §2 says so: it is that the
   convictions block above already promises "lo primero que entregamos es el
   proceso, no el sistema", so moving it to /implementacion would leave the
   site contradicting itself one click apart. */

const CONVICCIONES = ["c1", "c2", "c3"] as const;
const SALIDAS = ["s1", "s2", "s3"] as const;
const PREGUNTAS = [0, 1, 2, 3] as const;

export async function PaginaAsesoria({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "servicios.asesoria" });

  return (
    <main>
      <PaginaServicio slug="asesoria" locale={locale} />

      {/* 2 · Lo que creemos — the heart. Full-width rows, not a grid. */}
      <Seccion>
        <Reveal>
          <p className="eyebrow">{t("creemos.kicker")}</p>
          <h2 className="font-display mt-5 max-w-4xl text-h2 font-semibold text-text">
            <SplitText text={t("creemos.headline")} />
          </h2>
        </Reveal>

        <Stagger className="mt-16 space-y-12" variant="fade-up">
          {CONVICCIONES.map((k, i) => (
            <div
              key={k}
              className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10"
            >
              <span
                className="font-display text-h3 font-extrabold leading-none text-warm-text"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="max-w-3xl">
                <h3 className="font-display text-h3 font-semibold leading-snug text-text">
                  {t(`creemos.${k}Titulo`)}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-text-2">
                  {t(`creemos.${k}Body`)}
                </p>
              </div>
            </div>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-14">
          <p className="max-w-3xl border-t border-line pt-6 text-sm leading-relaxed text-text-2">
            {t("creemos.nota")}
          </p>
        </Reveal>
      </Seccion>

      {/* 3 · El diagnóstico — a paragraph and the four questions it opens with. */}
      <Seccion titulo={t("diagnostico.titulo")}>
        <Reveal delay={0.05} className="mt-8 max-w-3xl">
          <p className="text-lg leading-relaxed text-text-2">
            {t("diagnostico.body")}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-12 max-w-3xl">
          <div className="glass rounded-2xl p-8">
            <p className="font-medium text-text">
              {t("diagnostico.preguntasTitulo")}
            </p>
            <ul className="mt-5 space-y-3">
              {PREGUNTAS.map((i) => (
                <li key={i} className="flex gap-3 leading-relaxed text-text-2">
                  <span aria-hidden="true" className="text-accent-text">
                    ·
                  </span>
                  {t(`diagnostico.preguntas.${i}`)}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Seccion>

      {/* 4 · Tres salidas — a grid, on purpose, so the page does not repeat the
          shape it used for the convictions eight hundred pixels earlier. */}
      <Seccion titulo={t("salidas.titulo")}>
        <Stagger
          className="mt-12 grid gap-5 lg:grid-cols-3"
          variant="scale-in"
          itemClassName="h-full"
        >
          {SALIDAS.map((k) => (
            <div key={k} className="glass flex h-full flex-col rounded-2xl p-8">
              <h3 className="font-display text-h4 font-semibold text-text">
                {t(`salidas.${k}Titulo`)}
              </h3>
              <p className="mt-4 leading-relaxed text-text-2">
                {t(`salidas.${k}Body`)}
              </p>
            </div>
          ))}
        </Stagger>
      </Seccion>

      {/* 5 · Estructuración de procesos — decision 4. */}
      <Seccion titulo={t("estructuracion.titulo")}>
        <Reveal delay={0.1} className="mt-8 max-w-3xl">
          <p className="text-lg leading-relaxed text-text-2">
            {t("estructuracion.body")}
          </p>
        </Reveal>
      </Seccion>

      <Encaja slug="asesoria" href="/implementacion" />
      <Precio slug="asesoria" />
      <Faq slug="asesoria" />
      <Cierre slug="asesoria" />
    </main>
  );
}
