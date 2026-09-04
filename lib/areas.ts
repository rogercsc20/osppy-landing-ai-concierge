import areas from "@/data/areas.json";
import type { PhotoSlug } from "@/lib/photos.generated";

/**
 * The sixteen areas of the home. Eight office ones since V4 (HQA-D44) and
 * eight more — the plant floor and the support functions — added in tanda C
 * because the sectors the operator attested on 2026-09-03 (manufactura,
 * transporte, automotriz, infraestructura) have operaciones, calidad and
 * mantenimiento, and the home had none of them.
 *
 * **All sixteen are `hecho`, and none of them shows a badge.** The operator,
 * asked which to add: «las 8, mas aparte todas las de piso y sistemas … y no
 * tienes que poner que se ofrecen, implícitamente decimos que ya las hacemos,
 * por eso estan en la pagina» (2026-09-03, HQA-D76). That is an attestation,
 * so `estado` says `hecho` with the ledger row as its `fuente` — which is
 * what `scripts/check-copy.mjs` demands and would FAIL without. The badge
 * itself is gone from the UI: sixteen identical chips said nothing, and the
 * operator's point is that presence on the page IS the claim.
 *
 * `key` indexes `home.areas.<key>` in messages; `foto` indexes
 * `lib/photos.generated.ts`; `slug` is the URL-safe id the diagnosis takes as
 * `?area=` (slice V5).
 */
export type Area = {
  slug: string;
  key: string;
  estado: "hecho" | "ofrecido";
  fuente?: string;
  foto: PhotoSlug;
};

export const AREAS = areas as Area[];
