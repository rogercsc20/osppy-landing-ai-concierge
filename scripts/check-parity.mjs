// check-parity.mjs — ES/EN key-tree parity (rebuild slice L0).
// Loads messages/es.json and messages/en.json, builds the set of key paths
// (a.b.c; array indices count as segments) of each, prints `OK <n> llaves`
// when the sets are identical, otherwise prints the differences and exits 1.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function keyPaths(value, prefix, out) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => keyPaths(v, `${prefix}[${i}]`, out));
  } else if (value !== null && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      keyPaths(v, prefix ? `${prefix}.${k}` : k, out);
    }
  } else {
    out.add(prefix);
  }
  return out;
}

// Blank-canvas guard (2026-09-05): the site was cleared to nothing, and this
// gate has no input until the new one has messages/*.json. Exiting 0 with a word rather
// than a stack trace — the gate is wired and starts biting the moment the
// content exists.
if (existsSync(join(root, "messages/es.json")) === false) {
  console.log("— paridad: no hay messages/*.json todavía, nada que revisar");
  process.exit(0);
}

const es = keyPaths(JSON.parse(readFileSync(join(root, "messages/es.json"), "utf8")), "", new Set());
const en = keyPaths(JSON.parse(readFileSync(join(root, "messages/en.json"), "utf8")), "", new Set());

const soloEs = [...es].filter((k) => !en.has(k));
const soloEn = [...en].filter((k) => !es.has(k));

if (soloEs.length === 0 && soloEn.length === 0) {
  console.log(`OK ${es.size} llaves`);
} else {
  for (const k of soloEs) console.error(`solo en es.json: ${k}`);
  for (const k of soloEn) console.error(`solo en en.json: ${k}`);
  console.error(`${soloEs.length + soloEn.length} diferencias`);
  process.exit(1);
}
