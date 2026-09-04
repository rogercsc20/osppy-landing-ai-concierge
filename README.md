# Osppy — Landing Page

Marketing site for **Osppy**, a consultancy of **IA Corporativa**: it puts
artificial intelligence to work inside a company's operation, through three
lines — training, advisory and implementation — each with its own page.

The site is bilingual (Spanish default, English) and built around a calm,
editorial identity: a one-phrase hero, a full-screen silence, a method that is
navigation rather than a chapter, and one close.

> **The products are not on the site.** Diana Hoteles (`/hoteles`) and Diana
> Citas (`/citas`) stay reachable, `noindex`, out of the nav, the footer and
> the sitemap: they are a private link for a prospect, and the site asks about
> them instead of advertising them (HQA-D88, 2026-09-04). If you are looking
> for the hotel-era site this README used to describe, it is in `git log`.

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, RSC) |
| Language | TypeScript, React 19 |
| Styling | Tailwind CSS v4 (CSS-first — tokens live in `@theme` in `app/globals.css`, there is **no** `tailwind.config`) |
| Animation | **GSAP** for anything scroll-linked, `motion` for pointer, presence and micro-motion |
| i18n | next-intl 4 (path-based locales, localized slugs: `es` default, `en`) |
| Fonts | Geist + Inter (sans), Fraunces (serif display) via `next/font` |
| Icons | lucide-react |

## Getting started

> **Requires Node ≥ 20.9.** The system default may be older; use nvm
> (`nvm use 20`) or your version manager before running anything.

```bash
npm install
npm run dev        # dev server at http://localhost:3000  (redirects to /es)
npm run build      # production build (type-checks + lints)
npm run start      # serve the production build
npm run lint
```

## The gates

The site has five machine gates and two measured ones. **Run `npm run check`
before every commit**; the rest are per-slice.

| Command | What it refuses |
|---|---|
| `npm run check` | All four below, in order |
| `npm run check:parity` | A key in `es.json` without its twin in `en.json` |
| `npm run check:copy` | A banned term from `../osppy-hq/business/marca/banco-prohibido.md`, a client's name, a digit with no attestation (`scripts/copy-allow.json`), a long dash. Warns on jargon and on promise words |
| `npm run check:sections` | `min-h-screen` inside a `<section>` (it breaks the sticky chapter), and section bands |
| `npm run check:contrast` | Any token pair below 4.5:1, or 3:1 for text ≥ 24 px, in **both** themes and both accents. A pair it cannot parse FAILS rather than passing quietly |
| `npx playwright test` | 82 tests: routing, locale negotiation, the scroll engine, the panel inversion, the three service pages |
| `node scripts/capture.mjs [--reduced]` | Horizontal overflow, console errors, and — in the reduced pass — anything still at opacity 0 two seconds after load |
| `node scripts/first-load.mjs` | First-load JS over budget (200 kB gz, currently unmet — see below) |
| `node scripts/lighthouse.mjs` | Mobile performance and accessibility below 90 |

`capture.mjs`, `first-load.mjs` and `lighthouse.mjs` need a **production**
server (`npm run build && npm run start`). Running them against `npm run dev`
reports the dev bundle and is meaningless: it reads ~1.1 MB where production
reads 285 kB.

## Project structure

```
app/
  [locale]/
    layout.tsx              # <html>/<body>, fonts, providers, <title>, social card
    page.tsx                # the house — composes eleven sections, WHY → HOW → WHAT
    capacitacion/           # /capacitacion · /training
    asesoria/               # /asesoria · /advisory
    implementacion/         # /implementacion · /implementation
    hoteles/ citas/         # the two products: reachable, noindex, unlinked
    privacidad/ terminos/   # legal
  globals.css               # Tailwind v4 @theme tokens + global styles/keyframes
components/
  home/                     # the eleven sections of the house
  servicios/                # the three service pages: one hero spine, three bodies
  hoteles/                  # the product page for Diana Hoteles
  fx/                       # the motion primitives (see below)
  device/ charts/ media/    # AppWindow + iPhone, the panel's charts, Photo
  layout/ ui/ providers/    # Navbar, Footer, buttons, theme, motion + scroll providers
messages/
  es.json  en.json          # ALL user-facing copy; the key trees must be identical
i18n/
  routing.ts request.ts navigation.ts   # localized pathnames live in routing.ts
scripts/                    # the gates above
docs/                       # copy documents, one per gate, in both languages
```

## Editing content

All copy lives in `messages/es.json` and `messages/en.json`, and **both files
must keep an identical key tree** — `check:parity` is the guard and it fails
loudly. Components read copy via `useTranslations()` / `getTranslations()`, and
arrays via `t.raw()`.

**Copy is written in a document and approved before it lands.** Each slice
writes `docs/<date>-copy-<surface>-<locale>.md` with one row per key, the
operator approves it, and only then does it enter `messages/*.json`. The
reason is mechanical as much as editorial: when the key tree changes shape,
landing it before the components are rewired raises `MISSING_MESSAGE` across
every route.

## Design system

Tokens are defined in `app/globals.css`. There are two themes and two accents,
and every combination is measured by `check:contrast`.

- `--bg` Marfil `#f7f5f0` / Obsidian `#0a0f0e` — the page ground
- `--surface` — cards and panels
- `--accent` / `--accent-text` — Petróleo `#0e4f4f` light, Salvia `#74c0ac` dark
- `--warm` / `--warm-text` — Cobre; `--warm` is for text ≥ 24 px only, `--warm-text` for small text
- `--color-teal-*` — the **hotel** accent, reached only under `data-route="hoteles"`

`data-panel="invert"` flips a subtree to the opposite surface (ivory panel over
Obsidian, ink over Marfil) **without touching `data-theme`**, which is what
keeps the theme toggle working. Headlines use `.font-display` (Fraunces).

## Motion

Two engines, one vocabulary. `lib/motion.ts` holds the durations and easings;
`lib/gsap-motion.ts` is the same numbers spelled the way GSAP wants them, so an
entrance written with either lands on the same curve.

- **GSAP owns scroll position**: the pinned chapter (`fx/Pinned`), the
  atmosphere lag, the progress bar, parallax, the silence veil.
- **IntersectionObserver owns one-shot entrances** (`fx/Reveal`,
  `fx/Stagger`, via `fx/enter-once.ts`). GSAP still animates them; only the
  "is it on screen yet" question is the browser's. This is not a style
  preference — see `fx/enter-once.ts` for what it was measured to cost when
  every entrance was a ScrollTrigger instance.
- **`motion` owns presence and pointer**: `AnimatePresence`, `Spotlight`,
  `Tilt`, `Magnetic`, `Float`.
- **Reduced motion is honoured by not running at all.** `gsap.matchMedia`
  only invokes the setup under `(prefers-reduced-motion: no-preference)`, so
  no hidden state is ever written and the element stays as the server sent it.
  That is what makes the `--reduced` capture pass hold by construction.

## Lead capture

There is no lead form (2026-09-02, HQA-D25): the site collects no personal data
while the privacy notice is incomplete — Osppy is a trade name until the company
is incorporated, so the notice cannot yet identify a responsable with a legal
name and address. Every CTA is `whatsappHref` from `lib/site.ts` with a
prefilled message per page; while `WHATSAPP_NUMBER` is empty it opens a
prefilled email to hello@osppy.com instead (HQA-D29).

## Deployment

Deployed from `main` (Vercel). **The operator pushes; sessions never do.**

## Known debts

- [ ] **Performance (HQA-D87, owner O).** Mobile Lighthouse on `/es` is in the
  low seventies against a target of 90. The entrance fix is taken; what is left
  is script execution, not paint — React and GSAP bootup dominate the main
  thread. Measured in `docs/2026-09-04-e6-cierre-v4.md`.
- [ ] **First-load budget (HQA-D86, owner O).** 285 kB gz on the house against
  a written budget of 200. The `LazyMotion` lever named in that row was tried
  and measured at 0.2 kB — see the closing document before trying it again.
- [ ] **Legal entity data (owner O).** The legal pages carry `[RAZÓN SOCIAL]` /
  `[DOMICILIO]` as "en proceso de constitución"; replace on incorporation.
- [ ] **Legal review (owner O).** A lawyer reviews the privacy notice and terms
  (Track 4 in `../osppy-hq/PROGRAM.md`).
- [ ] **The public WhatsApp number (owner O).** Empty, so every CTA falls to
  email.
