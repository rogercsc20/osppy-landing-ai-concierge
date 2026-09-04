import { getTranslations } from "next-intl/server";
import { Reveal, Stagger } from "@/components/fx/Reveal";
import { PaginaServicio } from "./PaginaServicio";
import { Agentes } from "./Agentes";
import { Seccion, Precio, Faq, Cierre } from "./bloques";

/* /implementacion — the page that CARRIES AN INVENTORY.

   It opens with the diagram that came down from the house's hero (E0-2), and
   its heavy block is what has been built: nine kinds of work grouped into
   THREE FAMILIES rather than laid out as nine identical cards, which is what
   the plan §4.5 asked for and what keeps this page from looking like the
   other two. /capacitacion walks down a numbered catalog and /asesoria argues
   in full-width claims; this page groups.

   **Seven of the nine kinds are here, and the two missing ones did not get
   lost.** Claude Enterprise adoption went to /capacitacion and process
   structuring to /asesoria, both by plan §3.3. Seven plus two is nine and no
   page repeats another's row. Worth writing down because the plan's three
   families silently ASSUMED that routing: had E5a's decision 4 sent process
   structuring here instead, the first family would be four rows, not three.

   Everything the source of truth forbids is absent and stays absent: no ERP
   or invoicing brand (naming one requires a delivered instance, oferta.md §2),
   no client, no quantity, no date.

   **This page has no "where it fits" block, and that is deliberate**, not an
   omission: plan §4.5 gives it to /capacitacion and /asesoria only, because
   each of those points at the phase that FOLLOWS it. Implementation is the
   last stop of the method, so the block would have to point backwards, and a
   page whose job is to end the journey should not send the reader back up it.
   Its blocks 5 and 6 already say where it sits. */

const FAMILIAS = [
  { key: "f1", items: ["f1i1", "f1i2", "f1i3"] },
  { key: "f2", items: ["f2i1", "f2i2", "f2i3"] },
  { key: "f3", items: ["f3i1"] },
] as const;

const FASES = ["f1", "f2", "f3"] as const;

export async function PaginaImplementacion({ locale }: { locale: string }) {
  const t = await getTranslations({
    locale,
    namespace: "servicios.implementacion",
  });

  return (
    <main>
      <PaginaServicio slug="implementacion" locale={locale} />

      {/* 2 · Agentes de IA — the diagram opens the page. */}
      <Seccion titulo={t("agentes.titulo")}>
        <Reveal delay={0.05} className="mt-8 max-w-3xl">
          <p className="text-lg leading-relaxed text-text-2">
            {t("agentes.body")}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-16">
          <Agentes />
        </Reveal>
        <Reveal delay={0.15} className="mt-14 max-w-3xl">
          <p className="border-t border-line pt-6 leading-relaxed text-text-2">
            {t("agentes.revision")}
          </p>
        </Reveal>
      </Seccion>

      {/* 3 · Lo que se ha construido — three families, each a group and not a
          card, so nine kinds read as an inventory rather than as a menu. */}
      <Seccion titulo={t("construido.titulo")}>
        <div className="mt-12 space-y-14">
          {FAMILIAS.map((familia) => (
            <div key={familia.key}>
              <Reveal>
                <h3 className="font-display border-b border-line pb-4 text-h4 font-semibold text-warm-text">
                  {t(`construido.${familia.key}Titulo`)}
                </h3>
              </Reveal>
              <Stagger
                className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
                variant="fade-up"
                itemClassName="h-full"
              >
                {familia.items.map((item) => (
                  <div key={item} className="h-full">
                    <h4 className="font-medium text-text">
                      {t(`construido.${item}Titulo`)}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-text-2">
                      {t(`construido.${item}Body`)}
                    </p>
                  </div>
                ))}
              </Stagger>
            </div>
          ))}
        </div>
      </Seccion>

      {/* 4 · Cómo se conecta — in generic terms, and the note says why. */}
      <Seccion titulo={t("conecta.titulo")}>
        <Reveal delay={0.1} className="mt-8 max-w-3xl">
          <p className="text-lg leading-relaxed text-text-2">
            {t("conecta.body")}
          </p>
          <p className="mt-8 border-t border-line pt-6 text-sm leading-relaxed text-text-2">
            {t("conecta.nota")}
          </p>
        </Reveal>
      </Seccion>

      {/* 5 · Las tres fases — the destination of three of the method's five
          clicks in the house. */}
      <Seccion titulo={t("fases.titulo")}>
        <Stagger
          className="mt-12 grid gap-5 lg:grid-cols-3"
          variant="fade-up"
          itemClassName="h-full"
        >
          {FASES.map((k, i) => (
            <div key={k} className="glass flex h-full flex-col rounded-2xl p-8">
              <span className="eyebrow" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-4 text-h4 font-semibold text-text">
                {t(`fases.${k}Titulo`)}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-text-2">
                {t(`fases.${k}Body`)}
              </p>
            </div>
          ))}
        </Stagger>
      </Seccion>

      {/* 6 · Después de entregar. */}
      <Seccion titulo={t("despues.titulo")}>
        <Reveal delay={0.1} className="mt-8 max-w-3xl">
          <p className="text-lg leading-relaxed text-text-2">
            {t("despues.body")}
          </p>
        </Reveal>
      </Seccion>

      <Precio slug="implementacion" />
      <Faq slug="implementacion" />
      <Cierre slug="implementacion" />
    </main>
  );
}
