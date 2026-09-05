<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Osppy landing — blank canvas

**Cleared to zero on 2026-09-05, by operator decision.** Five plan versions of
accumulated design, copy and structure were deleted along with every rule that
governed them: the visual system, the message, the site map, the business
claims the copy made, the brand guardrails and the harness notes. Nothing on
this page is inherited. If you are looking for what used to be here, it is in
`git log` and at the tag `v5-cierre-2026-09-05`.

**Do not reconstruct any of it from git history without being asked.** It was
removed on purpose, not lost.

## What this repo still is

Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, TypeScript. It
builds and it renders an empty page. That is all it does today.

- `npm run dev` (port 3000) · `npm run build` · `npm run lint`
- `npm run check` runs four gates. **They are wired but empty**: each one
  short-circuits with a word until the content it inspects exists, and starts
  biting the moment it does. They carry no policy — `scripts/copy-allow.json`
  is empty on purpose, so every digit a client reads is a failure until
  somebody attests it with its source.
- `scripts/capture.mjs`, `first-load.mjs` and `lighthouse.mjs` need a
  PRODUCTION server (`npm run build && npm run start`), not `npm run dev`.
- The photo pipeline (`scripts/optimize-photos.mjs` + `photos.manifest.json`)
  and the twenty optimized photos in `public/photos/` survived as ASSETS. No
  decision about using any of them survived.

## The three things in `next.config.ts` that are NOT design

`/aviso` redirects to the guest-facing LFPDPPP notice the WhatsApp bot links
in its first-contact footer. It is a legal URL. `/login` and `/dashboard/*`
redirect to the operator console at app.osppy.com. All three are contracts
with live systems and were kept deliberately when everything else went.

## Sibling repos

Company truth lives in `../osppy-hq` (`PROGRAM.md` is the board,
`decisions.md` the ledger). The bot/api is `../ai-concierge-p2`; the operator
console is `../osppy-cockpit`.
