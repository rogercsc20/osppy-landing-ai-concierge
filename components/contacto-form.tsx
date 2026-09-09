"use client";

import { useRef, useState } from "react";
import type { Messages } from "@/lib/i18n";

/**
 * The contact form (HQA-D175: the operator lifted HQA-D25 for this form alone).
 *
 * The ten fields are the operator's, taken from the reference he sent: nothing was added
 * and nothing was removed. The reference gave the proportion and the order of the fields,
 * never a word of its copy.
 *
 * Accessibility is the point of most of what follows, and none of it is decoration:
 * every field has a visible <label>, "(requerido)" is written in the label and not only
 * implied by colour, an error is tied to its field with aria-describedby and marked with
 * aria-invalid, the result of the submit is announced in a live region that exists before
 * it has content (a region injected at the same time as its text is not announced), and
 * focus goes to the first field in error or to the result.
 *
 * The resting underline is the brand blue, as in the reference the operator sent: the token
 * `azul-texto` is the deep teal on light and the bright teal on dark, which is the one that is
 * visible in each mode (the bright teal on a light field is 1.80:1, a line nobody sees). Focus
 * therefore has to read as something other than colour on the line, so these fields take the
 * ink as their focus ring instead of the site's teal one.
 *
 * Validation runs here and the browser's own is off (noValidate): the messages are the
 * operator's approved Spanish, in his voice, and they must be the ones a visitor reads.
 */

type ClaveTexto = "nombre" | "correo" | "telefono" | "empresa" | "puesto" | "ciudad";
type Clave = ClaveTexto | "aviso";
type Estado = "inicial" | "revisa" | "enviando" | "exito" | "fallo";

const REQUERIDOS: ClaveTexto[] = ["nombre", "correo", "telefono", "empresa", "puesto", "ciudad"];
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Eight digits is the shortest real national number; the field asks for the country code. */
const telefonoValido = (v: string) => (v.match(/\d/g) ?? []).length >= 8;

const AUTOCOMPLETE: Record<ClaveTexto, string> = {
  nombre: "name",
  correo: "email",
  telefono: "tel",
  empresa: "organization",
  puesto: "organization-title",
  ciudad: "address-level2",
};

export function ContactoForm({ m, avisoHref }: { m: Messages; avisoHref: string }) {
  const c = m.contacto;
  const [errores, setErrores] = useState<Partial<Record<Clave, true>>>({});
  const [estado, setEstado] = useState<Estado>("inicial");
  const formRef = useRef<HTMLFormElement>(null);
  const estadoRef = useRef<HTMLParagraphElement>(null);
  // Time threshold against robots (FASE 3 checks it on the server): a form filled in
  // under a couple of seconds was not filled in by a person.
  const abierto = useRef(Date.now());

  function enfocar(nombre: string) {
    formRef.current?.querySelector<HTMLElement>(`[name="${nombre}"]`)?.focus();
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const valor = (k: string) => String(datos.get(k) ?? "").trim();

    const nuevos: Partial<Record<Clave, true>> = {};
    for (const k of REQUERIDOS) if (!valor(k)) nuevos[k] = true;
    if (!nuevos.correo && !CORREO.test(valor("correo"))) nuevos.correo = true;
    if (!nuevos.telefono && !telefonoValido(valor("telefono"))) nuevos.telefono = true;
    if (datos.get("aviso") === null) nuevos.aviso = true;

    setErrores(nuevos);
    const primero = ([...REQUERIDOS, "aviso"] as Clave[]).find((k) => nuevos[k]);
    if (primero) {
      setEstado("revisa");
      enfocar(primero);
      return;
    }

    setEstado("enviando");
    try {
      const r = await fetch("/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre: valor("nombre"),
          correo: valor("correo"),
          telefono: valor("telefono"),
          empresa: valor("empresa"),
          puesto: valor("puesto"),
          pais: valor("pais"),
          ciudad: valor("ciudad"),
          mensaje: valor("mensaje"),
          // The consent travels with the message: the server requires it, and the operator's
          // inbox is where the record of it lives (aviso, "Aceptación").
          aviso: datos.get("aviso") !== null,
          correos: datos.get("correos") !== null,
          sitio: valor("sitio"),
          abierto: abierto.current,
        }),
      });
      if (!r.ok) throw new Error(String(r.status));
      formRef.current?.reset();
      setEstado("exito");
    } catch {
      setEstado("fallo");
    }
    estadoRef.current?.focus();
  }

  const anuncio =
    estado === "revisa" ? c.revisa : estado === "exito" ? c.exito : estado === "fallo" ? c.fallo : "";

  return (
    <form ref={formRef} onSubmit={enviar} noValidate className="grid gap-6 sm:grid-cols-2">
      <CampoTexto clave="nombre" c={c} error={errores.nombre} ancho="sm:col-span-2" />
      <CampoTexto clave="correo" c={c} error={errores.correo} tipo="email" />
      <CampoTexto clave="telefono" c={c} error={errores.telefono} tipo="tel" />
      <CampoTexto clave="empresa" c={c} error={errores.empresa} />
      <CampoTexto clave="puesto" c={c} error={errores.puesto} />

      <div>
        <label htmlFor="campo-pais" className="block text-sm font-medium text-texto">
          {c.pais.etiqueta}
        </label>
        <div className="relative mt-2">
          <select
            id="campo-pais"
            name="pais"
            defaultValue={c.pais.opciones[0]}
            autoComplete="country-name"
            className="w-full appearance-none rounded-t-lg border-b-2 border-azul-texto bg-espuma px-4 py-3 pr-11 text-texto transition-colors focus-visible:outline-texto"
          >
            {c.pais.opciones.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {/* The chevron is the control's affordance, not content iconography: without it a
              list looks exactly like a text field (v6-02 §2.5, the same reason the mode
              button may draw a sun and a moon). */}
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-texto-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
      <CampoTexto clave="ciudad" c={c} error={errores.ciudad} />

      <div className="sm:col-span-2">
        <label htmlFor="campo-mensaje" className="block text-sm font-medium text-texto">
          {c.campos.mensaje.etiqueta} <span className="font-normal text-texto-2">{c.opcional}</span>
        </label>
        <textarea
          id="campo-mensaje"
          name="mensaje"
          rows={5}
          placeholder={c.campos.mensaje.marcador}
          className="mt-2 w-full rounded-t-lg border-b-2 border-azul-texto bg-espuma px-4 py-3 text-texto placeholder:text-texto-2 transition-colors focus-visible:outline-texto"
        />
      </div>

      {/* Trap for robots: off screen, out of the tab order and out of the accessibility
          tree, so no person ever meets it. A filled one is a robot (checked on the server). */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <input type="text" name="sitio" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="sm:col-span-2">
        <div className="flex gap-3">
          <input
            id="campo-aviso"
            name="aviso"
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 accent-azul"
            aria-invalid={errores.aviso ? true : undefined}
            aria-describedby={errores.aviso ? "error-aviso" : undefined}
          />
          <label htmlFor="campo-aviso" className="text-[0.95rem] leading-relaxed text-texto-2">
            {c.aviso.antes}
            <a href={avisoHref} className="text-azul-texto underline underline-offset-4">
              {c.aviso.enlace}
            </a>
            {c.aviso.despues} <span className="text-texto-2">{c.requerido}</span>
          </label>
        </div>
        {errores.aviso && (
          <p id="error-aviso" className="mt-2 text-sm text-error">
            {c.aviso.error}
          </p>
        )}
      </div>

      <div className="flex gap-3 sm:col-span-2">
        <input id="campo-correos" name="correos" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-azul" />
        <label htmlFor="campo-correos" className="text-[0.95rem] leading-relaxed text-texto-2">
          {c.correos.texto} <span className="text-texto-2">{c.opcional}</span>
        </label>
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="inline-flex items-center rounded-full bg-azul px-7 py-4 text-lg font-medium text-negro transition-colors hover:bg-espuma disabled:opacity-70"
        >
          {estado === "enviando" ? c.enviando : c.boton}
        </button>
        {/* The live region exists from the first render, empty: a region injected together
            with its text is not announced by most screen readers. */}
        <p
          ref={estadoRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={`mt-6 text-[1.05rem] leading-relaxed ${estado === "exito" ? "text-texto" : "text-error"}`}
        >
          {anuncio}
        </p>
      </div>
    </form>
  );
}

function CampoTexto({
  clave,
  c,
  error,
  tipo = "text",
  ancho = "",
}: {
  clave: ClaveTexto;
  c: Messages["contacto"];
  error?: true;
  tipo?: string;
  ancho?: string;
}) {
  const f = c.campos[clave];
  const id = `campo-${clave}`;
  const errId = `error-${clave}`;
  return (
    <div className={ancho}>
      <label htmlFor={id} className="block text-sm font-medium text-texto">
        {f.etiqueta} <span className="font-normal text-texto-2">{c.requerido}</span>
      </label>
      <input
        id={id}
        name={clave}
        type={tipo}
        placeholder={f.marcador}
        autoComplete={AUTOCOMPLETE[clave]}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        className={`mt-2 w-full rounded-t-lg border-b-2 bg-espuma px-4 py-3 text-texto transition-colors placeholder:text-texto-2 focus-visible:outline-texto ${
          error ? "border-error" : "border-azul-texto"
        }`}
      />
      {error && (
        <p id={errId} className="mt-2 text-sm text-error">
          {f.error}
        </p>
      )}
    </div>
  );
}
