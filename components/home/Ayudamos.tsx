import { getTranslations } from "next-intl/server";

/* Who we help: the six HQA-D32 sectors as a typographic mosaic on the
   Verde claro ground, closed by the house line (HQA-D16). Photos (HQA-D31)
   can replace tiles later; typography is the honest default. */
export async function Ayudamos() {
  const t = await getTranslations("home.ayudamos");
  const giros = t.raw("giros") as string[];

  return (
    <section id="ayudamos" className="bg-bg-alt py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow">{t("kicker")}</p>
        <h2 className="font-display mt-4 max-w-xl text-3xl font-bold tracking-tight text-text sm:text-4xl">
          {t("headline")}
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-text-2">{t("body")}</p>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {giros.map((giro, i) => (
            <li
              key={giro}
              className="rounded-2xl border border-hairline-verde bg-surface p-6 sm:p-8"
            >
              <span className="text-xs font-medium tabular-nums text-text-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-display mt-3 text-lg font-bold leading-tight text-text sm:text-xl">
                {giro}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-xl text-lg font-medium text-text">
          {t("fraseCasa")}
        </p>
      </div>
    </section>
  );
}
