import type { Metadata } from "next";
import { PaginaAviso, metadatosAviso } from "@/components/aviso-pagina";

// One locale only: the twin slug in the other language does not exist (lib/i18n.ts).
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "es" }];
}
export const metadata: Metadata = metadatosAviso("es");

export default function Page() {
  return <PaginaAviso locale="es" />;
}
