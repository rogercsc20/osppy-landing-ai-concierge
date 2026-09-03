// check-copy.mjs — applies hq's banned-word bank (scope `landing`) to the
// site copy (rebuild slice L0; v2 in landing v2 slice V2). No dependencies.
//
// Reads ../../osppy-hq/business/marca/banco-prohibido.md (relative to this
// file), takes the table rows under the headings containing «Prohibidas» and
// «Jerga», keeps the rows whose `alcance` column includes `landing`, and walks
// every text leaf of messages/es.json AND messages/en.json (or one locale
// with --locale es|en):
//   FALLA  — a banned term found as a substring of the normalized text
//   FALLA  — the names Tlaquepaque / Aura / Lucero (whole word)
//   FALLA  — a digit outside the global whitelist (24/7, 100, 50, 3, 9, 2;
//            years in legal/rights keys) and outside the per-key allow list
//            scripts/copy-allow.json (v2: this was an AVISO in v1 — every
//            figure on the site is now either attested or a failure)
//   FALLA  — an entry of data/areas.json or data/industries.json marked
//            «hecho» without a `fuente` naming a ledger row (HQA-D…) or the
//            FDV inventory (§11.10 / §11.12): delivered work needs a source
//   AVISO  — a jargon term as a whole word (concept-first rule, guide §6.6)
//   AVISO  — a promise word (ahorr…, reemplaz…, «sin riesgo», «reduce
//            costos», save/saving, replac…) — legitimate in negations
//            («no promete ahorros»), so it is reviewed by hand (guide §5.8)
//   AVISO  — «hotel» outside keys that start with `hoteles` or `diana`
// Ends with `N fallas · M avisos`; exit code 1 when there are fallas.
// Normalization mirrors plano() in osppy-content's verificar-texto.py:
// lowercase, NFD, combining marks stripped.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const BANCO = join(here, "..", "..", "osppy-hq", "business", "marca", "banco-prohibido.md");
const ALLOW = join(here, "copy-allow.json");
const ALCANCE = "landing";

const argLocale = process.argv.includes("--locale")
  ? process.argv[process.argv.indexOf("--locale") + 1]
  : null;
const locales = argLocale ? [argLocale] : ["es", "en"];

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

// ── per-key allow list ──────────────────────────────────────────────────────
// { "<exact key>" | "<prefix>*": ["substrings whose digits are attested"] }
const allow = existsSync(ALLOW) ? JSON.parse(readFileSync(ALLOW, "utf8")) : {};
function permitidosPara(llave) {
  const out = [];
  for (const [k, v] of Object.entries(allow)) {
    const hit = k.endsWith("*") ? llave.startsWith(k.slice(0, -1)) : k === llave;
    if (hit) out.push(...v);
  }
  return out;
}

// ── the copy ────────────────────────────────────────────────────────────────
const NOMBRES = ["tlaquepaque", "aura", "lucero"];
const DIGITOS_OK = new Set(["24/7", "100", "50", "3", "9", "2"]);
const PROMESAS = [
  /\bahorr\w*/u,
  /\breemplaz\w*/u,
  /\bsin riesgo\b/u,
  /\breduce costos\b/u,
  /\bhoras ahorradas\b/u,
  /\bsav(?:e|es|ing|ings)\b/u,
  /\breplac\w*/u,
  /\brisk-free\b/u,
  /\bcut costs\b/u,
];

function* hojas(value, prefix) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) yield* hojas(value[i], `${prefix}[${i}]`);
  } else if (value !== null && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) yield* hojas(v, prefix ? `${prefix}.${k}` : k);
  } else if (typeof value === "string") {
    yield [prefix, value];
  }
}

let fallas = 0;
let avisos = 0;
const palabraEntera = (texto, termino) =>
  new RegExp(`(?<![\\p{L}\\p{N}])${termino.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`, "u").test(texto);

for (const locale of locales) {
  const mensajes = JSON.parse(readFileSync(join(root, "messages", `${locale}.json`), "utf8"));
  console.log(`— messages/${locale}.json`);

  for (const [llave, texto] of hojas(mensajes, "")) {
    const t = plano(texto);
    const esLegal = /legal|rights|privacidad|privacy|terminos|terms/i.test(llave);

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

    // figures: strip the substrings attested for this key, then anything
    // left with a digit is a failure unless globally whitelisted
    let tCifras = t;
    for (const p of permitidosPara(llave)) tCifras = tCifras.split(plano(p)).join(" ");
    for (const num of tCifras.match(/\d+(?:[:.,]\d+)*(?:\/\d+)?%?/g) ?? []) {
      if (DIGITOS_OK.has(num)) continue;
      if (esLegal && /^(19|20)\d{2}$/.test(num)) continue;
      console.log(`FALLA  ${llave}: cifra «${num}» fuera de la lista blanca (HQA-D30, hechos estructurales o scripts/copy-allow.json)`);
      fallas++;
    }

    if (!esLegal) {
      for (const re of PROMESAS) {
        const m = t.match(re);
        if (m) {
          console.log(`AVISO  ${llave}: promesa «${m[0]}» — revisar a mano (guía §5.8: sin ahorros, horas ni reemplazo)`);
          avisos++;
        }
      }
    }

    if (t.includes("hotel") && !/^(hoteles|diana)/.test(llave)) {
      console.log(`AVISO  ${llave}: «hotel» fuera de las llaves hoteles.* / diana*`);
      avisos++;
    }
  }
}

// ── hecho / ofrecido: delivered work needs a source ─────────────────────────
for (const rel of ["data/areas.json", "data/industries.json"]) {
  const p = join(root, rel);
  if (!existsSync(p)) continue;
  const parsed = JSON.parse(readFileSync(p, "utf8"));
  const entries = Array.isArray(parsed) ? parsed : Object.values(parsed);
  for (const e of entries) {
    const id = e.slug ?? e.id ?? "(sin slug)";
    if (!["hecho", "ofrecido"].includes(e.estado)) {
      console.log(`FALLA  ${rel} · ${id}: estado «${e.estado}» — debe ser «hecho» u «ofrecido»`);
      fallas++;
    } else if (e.estado === "hecho" && !/HQA-D\d+|FDV §11\.1[02]/.test(e.fuente ?? "")) {
      console.log(`FALLA  ${rel} · ${id}: «hecho» sin fuente (fila HQA-D… del ledger o FDV §11.10/§11.12)`);
      fallas++;
    }
  }
  console.log(`— ${rel}: ${entries.length} entradas`);
}

console.log(`${fallas} fallas · ${avisos} avisos`);
if (fallas > 0) process.exit(1);
