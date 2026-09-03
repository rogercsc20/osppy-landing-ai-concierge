import { getTranslations } from "next-intl/server";
import { ChevronDown } from "lucide-react";

/* FAQ as a native, accessible accordion: <details>/<summary> needs no JS,
   is keyboard-operable by default, and the shared `name` makes the open
   panel exclusive in browsers that support it. */
export async function Faq() {
  const t = await getTranslations("home.faq");
  const items = (["1", "2", "3", "4", "5", "6"] as const).map((i) => ({
    q: t(`q${i}`),
    a: t(`a${i}`),
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <p className="eyebrow">{t("kicker")}</p>
      <h2 className="font-display mt-4 max-w-xl text-3xl font-bold tracking-tight text-text sm:text-4xl">
        {t("headline")}
      </h2>
      <div className="mt-10 max-w-3xl">
        {items.map((item) => (
          <details
            key={item.q}
            name="faq"
            className="group border-b border-line py-2"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium text-text [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-text-2 transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <p className="max-w-2xl pb-4 leading-relaxed text-text-2">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
