import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/* Two UNEQUAL product cards (master §8 L4a): Diana Hoteles as a dark
   object — the product's world is dark — and Diana Citas typographic,
   dashed, under construction. Dark here is an object, not a mode. */
export async function Productos() {
  const t = await getTranslations("home.productos");

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="eyebrow">{t("kicker")}</p>
      <h2 className="font-display mt-4 max-w-xl text-3xl font-bold tracking-tight text-text sm:text-4xl">
        {t("headline")}
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-text-2">{t("body")}</p>

      <div className="mt-12 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        {/* Diana Hoteles — the dark object */}
        <div className="flex flex-col rounded-2xl bg-pizarra p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-2xl font-bold text-white">
              {t("hoteles.nombre")}
            </h3>
            <span className="rounded-full border border-white/25 px-3 py-1 text-xs font-medium text-verde-claro">
              {t("hoteles.estado")}
            </span>
          </div>
          <p className="mt-4 max-w-lg leading-relaxed text-verde-claro/90">
            {t("hoteles.body")}
          </p>
          <Link
            href="/hoteles"
            className="mt-8 inline-flex w-fit items-center rounded-full bg-verde-claro px-5 py-2.5 text-sm font-semibold text-pizarra transition-opacity hover:opacity-90"
          >
            {t("hoteles.cta")}
          </Link>
        </div>

        {/* Diana Citas — typographic, under construction */}
        <div className="flex flex-col rounded-2xl border border-dashed border-line bg-surface p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-2xl font-bold text-text">
              {t("citas.nombre")}
            </h3>
            <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-text-2">
              {t("citas.estado")}
            </span>
          </div>
          <p className="mt-4 leading-relaxed text-text-2">{t("citas.body")}</p>
          <Link
            href="/citas"
            className="mt-8 inline-flex w-fit items-center rounded-full border border-accent px-5 py-2.5 text-sm font-semibold text-accent-text transition-colors hover:bg-accent hover:text-primary-foreground"
          >
            {t("citas.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
