import { getTranslations } from "next-intl/server";

/* Illustrative voices (HQA-D28, kit §5): the three quotes anonymized — no
   name, no property, no stars — each visibly labeled as illustrative. */
export async function Testimonios() {
  const t = await getTranslations("home.testimonios");
  const quotes = (["q1", "q2", "q3"] as const).map((k) => t(k));

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="eyebrow">{t("kicker")}</p>
      <h2 className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight text-text sm:text-4xl">
        {t("headline")}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-2">
        {t("nota")}
      </p>
      <ul className="mt-10 grid gap-3 md:grid-cols-3 lg:gap-4">
        {quotes.map((quote) => (
          <li
            key={quote}
            className="flex flex-col rounded-2xl border border-line bg-surface p-6"
          >
            <span className="w-fit rounded-full border border-line px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-text-2">
              {t("etiqueta")}
            </span>
            <blockquote className="mt-4 leading-relaxed text-text">
              “{quote}”
            </blockquote>
          </li>
        ))}
      </ul>
    </section>
  );
}
