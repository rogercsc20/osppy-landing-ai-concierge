import { NextResponse } from "next/server";

/**
 * The contact form's destination (HQA-D175, camino A).
 *
 * The message becomes an email to hello@osppy.com and nothing else: this site keeps no
 * database, so the operator's inbox is the record. That is what makes the privacy notice
 * short and what makes the right to deletion real (aviso, "Transferencias y remisiones").
 *
 * No dependency: Resend's REST API is one HTTP request. After HQA-D171 the site runs on
 * `next`, `react` and `react-dom`, and a form is not a reason to add a fourth.
 *
 * The page that posts here stays static: only this handler is dynamic, which is why the
 * submit is a fetch from the browser and not a server action.
 */

const DESTINO = "hello@osppy.com";
/** Verified sender on the osppy.com domain; overridable while the domain is being set up. */
const REMITENTE = process.env.CONTACTO_REMITENTE ?? "Osppy <sitio@osppy.com>";
/** Nobody fills seven fields in under two and a half seconds. A robot does. */
const MINIMO_MS = 2500;
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REQUERIDOS = ["nombre", "correo", "telefono", "empresa", "puesto", "ciudad"] as const;

const texto = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(req: Request) {
  let d: Record<string, unknown>;
  try {
    d = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "cuerpo" }, { status: 400 });
  }

  // The trap. Off screen, out of the tab order and out of the accessibility tree, so a
  // person never meets it: a filled one is a robot. It gets a 200 and no email, because an
  // error teaches it what to change next time.
  if (texto(d.sitio) !== "") return NextResponse.json({ ok: true });

  // The time threshold answers 429 instead of a silent 200: if it ever fires on a real
  // person, they see the failure message, which names the email address, and a second try
  // passes. A message is never dropped without the person being told.
  const abierto = Number(d.abierto);
  if (!Number.isFinite(abierto) || Date.now() - abierto < MINIMO_MS) {
    return NextResponse.json({ error: "demasiado rapido" }, { status: 429 });
  }

  // Validated again here: the browser's checks are for the person, not for the server.
  for (const k of REQUERIDOS) if (!texto(d[k])) return NextResponse.json({ error: k }, { status: 400 });
  if (!CORREO.test(texto(d.correo))) return NextResponse.json({ error: "correo" }, { status: 400 });
  if ((texto(d.telefono).match(/\d/g) ?? []).length < 8) return NextResponse.json({ error: "telefono" }, { status: 400 });
  // Consent is required to be there and to be true: a body without it is not a body that
  // accepted the notice, and no message is delivered on an assumption.
  if (d.aviso !== true) return NextResponse.json({ error: "aviso" }, { status: 400 });

  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    // Deliberate: with no destination the form does not pretend to have delivered. The
    // page shows its failure message, which carries the email address (HQA-D133).
    console.error("contacto: falta RESEND_API_KEY, no hay a donde entregar");
    return NextResponse.json({ error: "sin destino" }, { status: 503 });
  }

  const cuerpo = [
    `Nombre: ${texto(d.nombre)}`,
    `Correo: ${texto(d.correo)}`,
    `Teléfono: ${texto(d.telefono)}`,
    `Empresa: ${texto(d.empresa)}`,
    `Puesto: ${texto(d.puesto)}`,
    `País: ${texto(d.pais)}`,
    `Ciudad: ${texto(d.ciudad)}`,
    "",
    texto(d.mensaje) || "(sin mensaje)",
    "",
    `Quiere recibir correos de Osppy: ${d.correos === true ? "sí" : "no"}`,
  ].join("\n");

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${clave}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: REMITENTE,
        to: [DESTINO],
        reply_to: texto(d.correo),
        subject: `Contacto del sitio: ${texto(d.nombre)} (${texto(d.empresa)})`,
        text: cuerpo,
      }),
    });
    if (!r.ok) {
      console.error("contacto: el proveedor de correo respondió", r.status, await r.text());
      return NextResponse.json({ error: "entrega" }, { status: 502 });
    }
  } catch (e) {
    console.error("contacto: no se pudo llamar al proveedor de correo", e);
    return NextResponse.json({ error: "entrega" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
