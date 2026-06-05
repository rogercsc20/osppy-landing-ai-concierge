# Osppy — Landing Page

Marketing site for **Osppy**, a WhatsApp AI concierge for boutique hotels in
Mexico/LATAM. Osppy answers guests on WhatsApp in seconds (pricing, check-in,
availability) 24/7, and escalates to a human when it matters.

The site is bilingual (Spanish default, English) and built around a warm,
hospitality-grade identity — an interactive iPhone chat in the hero, a
scroll-to-unlock dashboard "act", and a calm, editorial layout.

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, RSC) |
| Language | TypeScript, React 19 |
| Styling | Tailwind CSS v4 (CSS-first — config lives in `@theme` in `app/globals.css`, there is **no** `tailwind.config`) |
| Animation | Framer Motion 12 |
| i18n | next-intl 4 (path-based locales: `es` default, `en`) |
| Fonts | Geist + Inter (sans), Fraunces (serif display) via `next/font` |
| Forms | react-hook-form + zod |
| Icons | lucide-react |

## Getting started

> **Requires Node ≥ 20.9.** The system default may be older; use nvm
> (`nvm use 20`) or your version manager before running anything.

```bash
npm install
npm run dev        # dev server at http://localhost:3000  (redirects to /es)
npm run build      # production build (runs TypeScript + lint)
npm run start      # serve the production build
npm run lint
```

Locales: `/` → `/es` (Spanish, default), `/en` (English).

## Project structure

```
app/
  [locale]/
    layout.tsx            # <html>/<body>, fonts, NextIntlClientProvider, metadata
    page.tsx              # landing page — composes the sections
    privacidad/page.tsx   # Privacy (Aviso de Privacidad, es/en)
    terminos/page.tsx     # Terms of Use (es/en)
  globals.css             # Tailwind v4 @theme tokens + global styles/keyframes
components/
  layout/                 # Navbar, Footer
  sections/               # Hero, Problem, Solution, ..., BeachToDashboard, FinalCTA
  ui/                     # WhatsAppMockup, DashboardMockup, WaitlistModal
  ui/chat/                # ChatPrimitives, InteractiveChat, script.ts (hero chat)
  legal/                  # LegalDocument (shared layout for legal pages)
messages/
  es.json  en.json        # ALL user-facing copy (keys must stay in sync)
i18n/
  routing.ts request.ts navigation.ts
```

## Editing content

All copy lives in `messages/es.json` and `messages/en.json`. **Both files must
keep an identical key structure** — add or change a key in one, do the same in
the other, or next-intl throws `MISSING_MESSAGE`. Components read copy via
`useTranslations()` (and `t.raw()` for arrays like the dashboard rows).

## Design system

Brand tokens are defined in `app/globals.css` under `@theme`:

- `--color-sand` / `--color-warm-white` — section backgrounds (alternating)
- `--color-turquoise` / `--color-turquoise-deep` — **primary action color** (CTAs, logo)
- `--color-coral` — soft warm accent only (glows, highlights)
- `--color-ink` / `--color-ink-panel` — text + the dark dashboard surface
- `--color-wa-green*` — WhatsApp brand colors, used only inside the chat mockup

Headlines use the Fraunces serif via the `.font-display` class. Marketing is
warm/light; the one dark, data-dense moment is the dashboard act
("calm outside, powerful inside").

## Notable components

- **Hero / `InteractiveChat`** — a scripted iPhone chat (decision tree in
  `components/ui/chat/script.ts`); the opening question is server-seeded so the
  phone is never empty on load.
- **`BeachToDashboard`** — the scroll-to-unlock act: a locked iPhone unlocks,
  the app scrolls to a graph, then expands into the desktop `DashboardMockup`
  inside a MacBook frame. Mobile/reduced-motion get a static, fitted fallback.
- **`DashboardMockup`** — interactive (non-functional) dashboard; uses
  **container queries** so it lays out by its own width, letting the desktop
  layout be scaled to fit the mobile laptop.
- **`WaitlistModal`** — the "Sign in" button opens this coming-soon stub (the
  real product dashboard is a separate future project).

## Deployment

Deployed from `main`. The form CTA currently opens a `mailto:` — swap for a
real endpoint/Tally form in `components/sections/FinalCTA.tsx` when ready.

## Not production-ready yet

- Legal pages contain placeholders (`[RAZÓN SOCIAL]`, `[DOMICILIO]`, `[RFC]`,
  `[CIUDAD/ENTIDAD]`) and should be reviewed by a lawyer.
- The dashboard is a visual mockup — no auth or live data.
