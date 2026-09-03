import areas from "@/data/areas.json";

/**
 * The eight office areas of the home (HQA-D44). `estado` is the badge and it
 * is the truth, not a design choice: `hecho` needs a dated source in the
 * ledger or in the source of truth §11.12, and `scripts/check-copy.mjs`
 * FAILS on an entry that claims delivered work without one. Today all eight
 * are `ofrecido` — nothing in the repo attests work by area.
 *
 * `key` indexes `home.areas.<key>` in messages; `slug` is the URL-safe id the
 * diagnosis takes as `?area=` (slice V5).
 */
export type Area = {
  slug: string;
  key: string;
  estado: "hecho" | "ofrecido";
  fuente?: string;
};

export const AREAS = areas as Area[];
