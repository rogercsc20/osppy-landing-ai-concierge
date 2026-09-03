// check-copy.mjs — applies hq's banned-word bank (scope `landing`) to the
// site copy (rebuild slice L0). No dependencies; Node >= 20.
//
// Reads ../../osppy-hq/business/marca/banco-prohibido.md (relative to this
// file), takes the table rows under the headings containing «Prohibidas» and
// «Jerga», keeps the rows whose `alcance` column includes `landing`, and walks
// every text leaf of messages/es.json (or en.json with --locale en):
//   FALLA  — a banned term found as a substring of the normalized text
//   FALLA  — the names Tlaquepaque / Aura / Lucero (whole word: «restaurante»
//            contains «aura» and must not trip it)
//   AVISO  — a jargon term as a whole word (concept-first rule, guide §6.6)
//   AVISO  — a digit outside the whitelist (24/7, 100, 50, 3, 9, 2; years in
//            legal/rights keys)
//   AVISO  — «hotel» outside keys whose path starts with `hoteles`
// Ends with `N fallas · M avisos`; exit code 1 when there are fallas.
// Normalization mirrors plano() in osppy-content's verificar-texto.py:
// lowercase, NFD, combining marks stripped.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const BANCO = join(here, "..", "..", "osppy-hq", "business", "marca", "banco-prohibido.md");
const ALCANCE = "landing";

const locale = process.argv.includes("--locale")
  ? process.argv[process.argv.indexOf("--locale") + 1]
  : "es";

if (!existsSync(BANCO)) {
  console.error(
    `no encuentro el banco de palabras prohibidas en\n  ${BANCO}\n` +
      "debe existir en osppy-hq/business/marca/banco-prohibido.md " +
      "(repos hermanos bajo el mismo directorio). Sin lista no hay verificación.",
  );
  process.exit(1);
}

function plano(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

// ── the bank ────────────────────────────────────────────────────────────────
function filasBajo(md, tituloContiene) {
  const lineas = md.split("\n");
  const filas = [];
  let dentro = false;
  for (const linea of lineas) {
    if (/^#{2,3} /.test(linea)) dentro = linea.includes(tituloContiene);
    if (!dentro || !linea.startsWith("|")) continue;
    const celdas = linea.split("|").map((c) => c.trim());
    // | término | alcance | sustituto | fuente | fecha | → ["", t, a, s, f, f, ""]
    if (celdas.length < 6 || celdas[1] === "término" || /^-+$/.test(celdas[1].replace(/[:\s]/g, "-"))) continue;
    filas.push({ termino: celdas[1], alcance: celdas[2] });
  }
  return filas;
}

const banco = readFileSync(BANCO, "utf8");
const prohibidas = filasBajo(banco, "Prohibidas")
  .filter((f) => f.alcance.includes(ALCANCE))
  .map((f) => plano(f.termino));
const jerga = filasBajo(banco, "Jerga")
  .filter((f) => f.alcance.includes(ALCANCE))
  .map((f) => plano(f.termino));

if (prohibidas.length === 0) {
  console.error("el banco se leyó pero ninguna fila «Prohibidas» tiene alcance landing — revisa el formato de la tabla");
  process.exit(1);
}

// ── the copy ────────────────────────────────────────────────────────────────
const NOMBRES = ["tlaquepaque", "aura", "lucero"];
const DIGITOS_OK = new Set(["24/7", "100", "50", "3", "9", "2"]);

function* hojas(value, prefix) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) yield* hojas(value[i], `${prefix}[${i}]`);
  } else if (value !== null && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) yield* hojas(v, prefix ? `${prefix}.${k}` : k);
  } else if (typeof value === "string") {
    yield [prefix, value];
  }
}

const mensajes = JSON.parse(readFileSync(join(root, "messages", `${locale}.json`), "utf8"));

let fallas = 0;
let avisos = 0;
const palabraEntera = (texto, termino) =>
  new RegExp(`(?<![\\p{L}\\p{N}])${termino.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`, "u").test(texto);

for (const [llave, texto] of hojas(mensajes, "")) {
  const t = plano(texto);

  for (const term of prohibidas) {
    if (t.includes(term)) {
      console.log(`FALLA  ${llave}: prohibida «${term}»`);
      fallas++;
    }
  }
  for (const nombre of NOMBRES) {
    if (palabraEntera(t, nombre)) {
      console.log(`FALLA  ${llave}: nombre «${nombre}»`);
      fallas++;
    }
  }
  for (const term of jerga) {
    if (palabraEntera(t, term)) {
      console.log(`AVISO  ${llave}: jerga «${term}» — el concepto en claro va primero (guía §6.6)`);
      avisos++;
    }
  }
  const esLegal = /legal|rights|privacidad|privacy|terminos|terms/i.test(llave);
  for (const num of t.match(/\d+(?:[:.,]\d+)*(?:\/\d+)?%?/g) ?? []) {
    if (DIGITOS_OK.has(num)) continue;
    if (esLegal && /^(19|20)\d{2}$/.test(num)) continue;
    console.log(`AVISO  ${llave}: cifra «${num}» fuera de la lista blanca (HQA-D30 y hechos estructurales)`);
    avisos++;
  }
  if (t.includes("hotel") && !llave.startsWith("hoteles")) {
    console.log(`AVISO  ${llave}: «hotel» fuera de las llaves hoteles.*`);
    avisos++;
  }
}

console.log(`${fallas} fallas · ${avisos} avisos`);
if (fallas > 0) process.exit(1);
