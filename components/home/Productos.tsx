import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/fx/Reveal";

/* WHAT, last beat — the products, deliberately SECOND (HQA-D37): this page
   sells work inside other companies' operations; Diana is what we build for
   ourselves. Two unequal cards (trap 11): the one in production carries the
   accent, the one under construction is typographic and dashed. The dark
   slab is gone — the product's world now arrives with its route, as an
   accent override (HQA-D38). */
export async function Productos() {
  const t = await getTranslations("home.productos");

  return (
    <section className="relative px-4 py-section sm:px-6">
      <div className="mx-auto max-w-6xl">
      <Reveal>
        <p className="eyebrow">{t("kicker")}</p>
        <h2 className="font-display mt-5 max-w-3xl text-h2 font-semibold text-text">
          {t("headline")}
        </h2>
        <p className="mt-6 max-w-2xl text-lead text-text-2">{t("body")}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-14 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        {/* Diana Hoteles — in production, so it carries the accent */}
        <div className="glass flex flex-col rounded-2xl p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-h3 font-semibold text-text">
              {t("hoteles.nombre")}
            </h3>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary-foreground">
              {t("hoteles.estado")}
            </span>
          </div>
          <p className="mt-4 max-w-lg leading-relaxed text-text-2">
            {t("hoteles.body")}
          </p>
          <Link
            href="/hoteles"
            className="mt-8 inline-flex w-fit items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("hoteles.cta")}
          </Link>
        </div>

        {/* Diana Citas — typographic, under construction */}
        <div className="flex flex-col rounded-2xl border border-dashed border-line p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-h3 font-semibold text-text">
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
      </Reveal>
      </div>
    </section>
  );
}
