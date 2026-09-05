<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Osppy context (company layer — sibling repo `../osppy-hq`)

Company-level truth lives in **`../osppy-hq`** (2026-08-04 hybrid context architecture): `PROGRAM.md` = THE program board and session handoff surface · `decisions.md` = company/commercial ledger · `business/pricing.md` (fair-use structure is the only structure prospects see) · `customers/` (lucero, casa-tlaquepaque, aura, prospects). The three-repo topology map is in `osppy-hq/README.md`. This repo owns www.osppy.com: marketing site + /aviso redirect to the Railway-served guest aviso (the legacy dashboard was retired 2026-08-10 by cockpit Slice 8 — the operator console is `../osppy-cockpit` at app.osppy.com); the bot/api + engineering docs live in `../ai-concierge-p2`.

# Osppy landing page — working notes

Bilingual (es default, en) marketing site for Osppy, a consultancy of **IA
Corporativa** with three service lines. Next.js 16 (App Router/RSC, Turbopack),
React 19, Tailwind v4, GSAP + `motion`, next-intl 4. See `README.md` for the
full map.

## Environment & commands

- **Node ≥ 20.9 is required.** If `npm run build`/`dev` fails instantly with a
  version error, the default `node` is too old — switch with nvm first.
- `npm run dev` (port 3000, `/` → `/es`), `npm run build` (type-checks + lints),
  `npm run lint`, `npm run check` (the four copy/structure gates).
- **`capture.mjs`, `first-load.mjs` and `lighthouse.mjs` need a PRODUCTION
  server** (`npm run build && npm run start`). Run against `npm run dev` they
  measure the dev bundle: ~1.1 MB where production reads 285 kB.

## Conventions (the non-obvious stuff)

- **i18n parity is mandatory.** Every user-facing string lives in
  `messages/es.json` AND `messages/en.json` with an identical key tree. A key in
  one but not the other → runtime `MISSING_MESSAGE`. `npm run check:parity` is
  the guard. Default locale is `es`. Arrays via `t.raw()`.
- **Copy is approved in a document before it lands in the JSON.** Each slice
  writes `docs/<date>-copy-<surface>-<locale>.md`, one row per key, and only
  then rewires. The reason is mechanical too: when the key tree changes shape,
  landing it first raises `MISSING_MESSAGE` on every route.
- **The banned-word bank is in the OTHER repo.** `check:copy` reads
  `../osppy-hq/business/marca/banco-prohibido.md`, rows scoped `landing`. A new
  figure is a FAILURE until it is attested per key in `scripts/copy-allow.json`
  with its source. Long dashes are banned in anything a client reads (HQA-D79),
  guillemets in anything new (HQA-D59), and the site says **tú** (HQA-D35).
- **Tailwind v4 is CSS-first.** No `tailwind.config`; tokens live in `@theme`
  in `app/globals.css`.
- **Color roles:** Petróleo/Salvia is the accent (`--accent`, `--accent-text`),
  Cobre is warm (`--warm` for ≥24 px only, `--warm-text` for small text). The
  **teal is the hotel accent** and is reached only under `data-route="hoteles"`
  — never bring it into the house. `data-panel="invert"` flips a subtree to the
  opposite surface and **must never touch `data-theme`**, or the toggle and the
  pre-paint script both break.
- **Two motion engines, on purpose.** GSAP owns anything that needs scroll
  POSITION (the pinned chapter, parallax, the progress bar, the veil).
  One-shot entrances are IntersectionObserver (`fx/enter-once.ts`) with GSAP
  still animating them. `motion` owns presence and pointer. Read
  `fx/enter-once.ts` before moving an entrance back to ScrollTrigger: that is
  the change HQA-D87 measured as the site's largest single performance cost.
- **Reduced motion is honoured by NOT RUNNING**, never by a second "still"
  code path: `gsap.matchMedia` only invokes setup under `no-preference`, so no
  hidden state is written and the element stays as the server sent it.

## Gotchas

- **Before believing a mass Playwright failure, check who owns port 3000.**
  `playwright.config.ts` carries `reuseExistingServer: !CI`, so a live
  `next-server` from an earlier session is adopted in silence and the whole
  suite runs against the old build. It also runs `npm run dev`, so five workers
  against a COLD server compiling new pages produce dozens of timeouts that are
  not the code: warm the routes with `curl` first, or run the suite twice.
- **A mutation that SURVIVES may mean the server is stale, not that the test is
  vacuous.** Verify with `curl` that the served HTML actually changed before
  believing either verdict.
- **`capture.mjs` reports one console error on every local run**: a 404 for
  `/_vercel/insights/script.js`, which only exists on Vercel. It is not a
  defect and it does not appear in production.
- **A full-page capture can show the section-2 panel blank or half-faded at
  1280.** Chromium's full-page screenshot restarts the CSS `fade-rise`
  entrance: measured in v5 T1 against `next start`, the panel's wrapper read
  opacity 1 after load, **0.795 right after the `fullPage` screenshot**, and
  1 again 1.5 s later. Whether `capture.mjs` catches it at 0 (inside its
  0.35 s delay), mid-fade or at 1 is timing. It is not the page: a viewport
  screenshot shows the panel, and so does the browser. Do not chase it.
- **`git checkout -- <file>` does not revert a mutation over uncommitted work;
  it deletes the work.** Copy the file somewhere outside git first.
- **Playwright's `hover()` does not land while Lenis is running.** It scrolls
  the element into view and then dispatches the move at the coordinates it
  read BEFORE that scroll, and Lenis keeps transforming the page for the next
  several frames. Measured in v5 T7 against `npm run dev` at 1280: after
  `hover()` the anchor reported `matches(":hover") === false` and the target
  had not moved, while the same test under `reducedMotion: "reduce"` — where
  there is no Lenis provider — landed every time. It looks exactly like a
  broken component. Drive the pointer instead: read the box, `mouse.move` to
  its centre with `steps`, and poll `matches(":hover")` until it is true.
- **Chromium ignores a mouse move to the coordinates the pointer already
  occupies**, so a poll that keeps re-aiming at the same centre never
  re-evaluates `:hover` and spins until it times out. Move away (a corner)
  and back on each attempt.
- **`browser.newContext()` does not inherit the project's `use` options.** A
  hand-built context for one media emulation failed half its runs two ways —
  a pointer that never landed and a `boundingBox()` of null. Prefer
  `page.emulateMedia()` on the project's own `page`.
- **For a claim about a CSS media query, force the pseudo-state instead of
  driving the mouse.** `CSS.forcePseudoState` over `page.context()
  .newCDPSession(page)` puts an element in `:hover` with no pointer, no Lenis
  and no event coalescing. In v5 the reduced-motion hover test went from five
  failures in eighteen runs to 24 of 24 that way, while the two tests beside
  it kept a real pointer because what THEY check is what a reader does.
- **Do not assert `documentElement.scrollHeight` across an interaction.**
  ScrollTrigger re-measures the pinned chapter's spacer after fonts and
  images settle and that number moves on its own — 110 px, mid-test, with the
  pointer doing nothing. Assert the height of the SECTION the change lives
  in.
- **Compare box geometry with `toBeCloseTo(x, 0)`, never `toBe`.** Two reads
  of an unchanged box differ in the eighth decimal
  (`131.98440551757812` vs `131.984375`).
- **`.glass` is declared OUTSIDE every `@layer` in `globals.css`, so it beats
  any Tailwind utility** whatever the specificity. `hover:border-*` on an
  element that also carries `.glass` paints nothing, and has painted nothing
  since it was written. Drive the border through `--line`, which is what
  `.glass` reads. `components/hoteles/Hace.tsx:56` still carries the dead
  pairing.
- **Tailwind v4's `scale-*` writes the standalone `scale` property, not
  `transform`.** `getComputedStyle(el).transform` reads `none` on a scaled
  element, and `transition-[transform,…]` on it names a property that never
  changes — the change snaps with no easing and nothing tells you.
- **`next/image` never upscales.** Ask for a width above the master's and it
  returns the master, and the browser stretches it. Two of the twenty area
  photos are PORTRAIT originals, so `LONG_EDGE = 1600` caps their HEIGHT and
  they ship 1067 px wide: the bank's real ceiling for a landscape frame is
  1067, not 1600.
- `body { overflow-x: clip }` guards against stray horizontal overflow on
  mobile — keep `clip` (not `hidden`, which would break the sticky chapter).
- **`content-visibility` must never wrap `<Como/>`.** It applies layout and
  style containment, which breaks the sticky chapter inside it; the capture
  gate once caught it rendering empty. E6 measured it on the page tail and it
  bought nothing, so the house carries none.
