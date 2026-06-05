<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Osppy landing page — working notes

Bilingual (es default, en) marketing site for Osppy, a WhatsApp AI concierge
for boutique hotels in Mexico. Next.js 16 (App Router/RSC, Turbopack), React 19,
Tailwind v4, Framer Motion 12, next-intl 4. See `README.md` for the full map.

## Environment & commands

- **Node ≥ 20.9 is required.** If `npm run build`/`dev` fails instantly with a
  version error, the default `node` is too old — switch with nvm first.
- `npm run dev` (port 3000, `/` → `/es`), `npm run build` (type-checks + lints),
  `npm run lint`.

## Conventions (the non-obvious stuff)

- **i18n parity is mandatory.** Every user-facing string lives in
  `messages/es.json` AND `messages/en.json` with an identical key tree. A key in
  one but not the other → runtime `MISSING_MESSAGE`. Default locale is `es`.
  Read copy with `useTranslations()`; arrays (e.g. `dashboard.rows`) via `t.raw()`.
- **Tailwind v4 is CSS-first.** There is no `tailwind.config`. All tokens/theme
  live in the `@theme` block of `app/globals.css`. New brand colors go there as
  `--color-*` and are then usable as `bg-*`/`text-*`/`border-*`.
- **Color roles:** turquoise (`--color-turquoise{,-deep}`) is the primary action
  color (CTAs, logo). Coral is a *soft accent only* (glows/highlights), not for
  buttons. Ink is text + the dark dashboard. Headlines use `.font-display`
  (Fraunces serif).
- **Do not rebrand WhatsApp colors** (`--color-wa-green*`, the dark chat
  bubbles) — they only appear inside the chat mockups and must look like real
  WhatsApp.
- **`DashboardMockup` uses container queries** (`@container`, `@2xl:` etc.), not
  viewport breakpoints, so it lays out by its own width. This lets the desktop
  layout be rendered wide and scaled to fit the mobile laptop via `FitToWidth`
  (which uses `transform: scale`, NOT `zoom` — `zoom` collapses the layout box
  and breaks the container queries).
- **Animations respect `prefers-reduced-motion`** (via `useReducedMotion`) and
  mobile gets static fallbacks for the scroll cinematic. Keep both paths working.
- **Stubs:** the dashboard is a non-functional mockup; "Sign in" opens
  `WaitlistModal` (coming-soon). The demo form opens a `mailto:`. Real
  product/dashboard is a separate future project.

## Gotchas

- The hero chat seeds its opening question in initial state so the phone is
  never empty before hydration; its entrance is CSS (`.animate-phone-in`) so it
  paints without waiting for JS. Don't move the entrance back to a JS-only
  `initial` hidden state.
- `body { overflow-x: clip }` guards against stray horizontal overflow on
  mobile — keep `clip` (not `hidden`, which would break the sticky cinematic).
