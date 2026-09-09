import type { Metadata } from "next";
import { PaginaContacto, metadatosContacto } from "@/components/contacto-pagina";

// One locale only: the twin slug in the other language does not exist (lib/i18n.ts).
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ locale: "es" }];
}
export const metadata: Metadata = metadatosContacto("es");

export default function Page() {
  return <PaginaContacto locale="es" />;
}
