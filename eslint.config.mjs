import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored registry code (shadcn add: Bklit charts, Kokonut, shadcn ui,
    // shimmering-text). Installed as-is on 2026-09-02 (L2, HQA-D34); its style
    // predates Next 16's stricter react-hooks rules and is not ours to rewrite.
    // Our own components stay fully linted.
    "components/charts/**",
    "components/kokonutui/**",
    "components/ui/button.tsx",
    "components/shimmering-text.tsx",
  ]),
]);

export default eslintConfig;
