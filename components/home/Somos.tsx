import { getTranslations } from "next-intl/server";

/* Who we are: a three-paragraph manifesto and the page's one editorial
   serif quote (guide §8.6 allows exactly one per page). */
export async function Somos() {
  const t = await getTranslations("home.somos");
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="eyebrow">{t("kicker")}</p>
      <div className="mt-4 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div>
          <h2 className="font-display max-w-xl text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {t("headline")}
          </h2>
          <div className="mt-6 max-w-xl space-y-5 leading-relaxed text-text-2">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
          </div>
        </div>
        <figure className="flex flex-col justify-center rounded-2xl bg-bg-alt p-8 lg:p-10">
          <blockquote className="font-editorial text-2xl leading-snug text-text">
            “{t("cita")}”
          </blockquote>
          <figcaption className="mt-4 text-sm text-text-2">
            {t("citaNota")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
