// check-parity.mjs — ES/EN key-tree parity (rebuild slice L0).
// Loads messages/es.json and messages/en.json, builds the set of key paths
// (a.b.c; array indices count as segments) of each, prints `OK <n> llaves`
// when the sets are identical, otherwise prints the differences and exits 1.
import { readFileSync } from "node:fs";
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
