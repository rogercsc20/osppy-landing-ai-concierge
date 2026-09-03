import { getTranslations } from "next-intl/server";

/* Case work without names (HQA-D28, guide §7.3): seven work-type cards —
   no client, no figure, no logo. The sectors close the section as one
   collective line; the sources record no work-type × sector pairing, so
   the cards don't invent one. */
export async function Casos() {
  const t = await getTranslations("home.casos");
  const cards = (["t1", "t2", "t3", "t4", "t5", "t6", "t7"] as const).map(
    (k) => ({ titulo: t(`${k}Titulo`), body: t(`${k}Body`) }),
  );

  return (
    <section className="py-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow">{t("kicker")}</p>
        <h2 className="font-display mt-4 max-w-xl text-3xl font-bold tracking-tight text-text sm:text-4xl">
          {t("headline")}
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-text-2">{t("body")}</p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {cards.map((card) => (
            <li
              key={card.titulo}
              className="glass rounded-2xl p-6"
            >
              <h3 className="font-display text-lg font-bold text-text">
                {card.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-2">
                {card.body}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-8 border-t border-line pt-6 text-sm text-text-2">
          {t("giros")}
        </p>
      </div>
    </section>
  );
}
