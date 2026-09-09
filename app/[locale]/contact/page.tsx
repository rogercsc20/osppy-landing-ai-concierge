import type { Metadata } from "next";
import { PaginaContacto, metadatosContacto } from "@/components/contacto-pagina";

// One locale only: the twin slug in the other language does not exist (lib/i18n.ts).
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "en" }];
}
export const metadata: Metadata = metadatosContacto("en");

export default function Page() {
  return <PaginaContacto locale="en" />;
}
