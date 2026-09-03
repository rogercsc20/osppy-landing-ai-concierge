import { getTranslations } from "next-intl/server";

/* What we do: three ways in, each with its OWN object (master §4 trap 11 —
   three equal cards are a design failure): training = a spec sheet,
   advisory = the diagnostic as questions, implementation = the row of
   system types. */
export async function Hacemos() {
  const t = await getTranslations("home.hacemos");

  const ficha = (["f1", "f2", "f3", "f4"] as const).map((k) => ({
    label: t(`capacitacion.${k}Label`),
    value: t(`capacitacion.${k}Value`),
  }));
  const preguntas = t.raw("asesoria.preguntas") as string[];
  const tipos = t.raw("implementacion.tipos") as string[];

  return (
    <section id="hacemos" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="eyebrow">{t("kicker")}</p>
      <h2 className="font-display mt-4 max-w-xl text-3xl font-bold tracking-tight text-text sm:text-4xl">
        {t("headline")}
      </h2>

      <div className="mt-12 space-y-12">
        {/* Capacitación — the spec sheet */}
        <div className="grid gap-8 border-t border-line pt-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-display text-2xl font-bold text-text">
                {t("capacitacion.titulo")}
              </h3>
              <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-text-2">
                {t("capacitacion.estado")}
              </span>
            </div>
            <p className="mt-4 max-w-lg leading-relaxed text-text-2">
              {t("capacitacion.body")}
            </p>
          </div>
          <dl className="self-center rounded-2xl border border-line bg-surface p-6">
            {ficha.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[7rem_1fr] gap-4 py-3 ${i > 0 ? "border-t border-line" : ""}`}
              >
                <dt className="text-sm font-semibold text-text">{row.label}</dt>
                <dd className="text-sm leading-relaxed text-text-2">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Asesoría — the diagnostic as questions */}
        <div className="grid gap-8 border-t border-line pt-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-display text-2xl font-bold text-text">
                {t("asesoria.titulo")}
              </h3>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary-foreground">
                {t("asesoria.estado")}
              </span>
            </div>
            <p className="mt-4 max-w-lg leading-relaxed text-text-2">
              {t("asesoria.body")}
            </p>
          </div>
          <div className="self-center">
            <p className="text-sm font-semibold text-text">
              {t("asesoria.preguntasTitulo")}
            </p>
            <ul className="mt-4 space-y-3">
              {preguntas.map((q) => (
                <li
                  key={q}
                  className="border-l-2 border-accent pl-4 leading-relaxed text-text-2"
                >
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Implementación — the row of system types */}
        <div className="grid gap-8 border-t border-line pt-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-display text-2xl font-bold text-text">
                {t("implementacion.titulo")}
              </h3>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary-foreground">
                {t("implementacion.estado")}
              </span>
            </div>
            <p className="mt-4 max-w-lg leading-relaxed text-text-2">
              {t("implementacion.body")}
            </p>
          </div>
          <div className="self-center">
            <p className="text-sm font-semibold text-text">
              {t("implementacion.tiposTitulo")}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {tipos.map((tipo) => (
                <li
                  key={tipo}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-text"
                >
                  {tipo}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
