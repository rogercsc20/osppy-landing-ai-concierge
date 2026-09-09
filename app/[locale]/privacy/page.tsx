import type { Metadata } from "next";
import { PaginaAviso, metadatosAviso } from "@/components/aviso-pagina";

// One locale only: the twin slug in the other language does not exist (lib/i18n.ts).
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "en" }];
}
export const metadata: Metadata = metadatosAviso("en");

export default function Page() {
  return <PaginaAviso locale="en" />;
}
