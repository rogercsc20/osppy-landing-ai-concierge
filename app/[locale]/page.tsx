import { Ayudamos } from "@/components/ayudamos";
import { Datos } from "@/components/datos";
import { Hablemos } from "@/components/hablemos";
import { Hero } from "@/components/hero";
import { Metodo } from "@/components/metodo";
import { Quienes } from "@/components/quienes";
import { Real } from "@/components/real";
import { getMessages, isLocale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = isLocale(locale) ? locale : "es";
  const m = getMessages(l);
  return (
    <main>
      <Hero locale={l} m={m} />
      <Quienes locale={l} m={m} />
      <Metodo locale={l} m={m} />
      <Ayudamos locale={l} m={m} />
      <Datos m={m} />
      <Real locale={l} m={m} />
      <Hablemos locale={l} m={m} />
    </main>
  );
}
