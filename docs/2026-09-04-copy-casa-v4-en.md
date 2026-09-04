# House copy, English · slice E3b (mirror of the approved Spanish)

> **2026-09-04.** Repo: `osppy-landing-ai-concierge`. Written against the **approved** Spanish
> document `2026-09-04-copy-casa-v4-es.md`, whose seven decisions all closed on 2026-09-04.
> Plan: `../../osppy-hq/prompts/2026-09-03-landing-v4-consultora-master-prompt.md` §6.
> **Nothing here has entered `messages/*.json` yet.** See "Why this is a document" below.
> **How to read it:** every row is a key, its approved Spanish, and the English. The key tree
> is identical to the Spanish one by construction, which is the whole point of this slice.

## Why this is a document and not a commit to `messages/*.json`

The plan gives E3b the commit `home: v4 copy, es and en`. **Written as a document instead, on
purpose, and here is the reason so it reads as a decision and not as an omission.**

The house's key tree changes shape: five namespaces die or move, one is born
(`home.aplicada.*`), one splits (`home.porque.*` into silence and definition). Landing that
tree in `messages/*.json` **before** the components are rewired means every component still
reading a dead key raises `MISSING_MESSAGE` at runtime, and `responsive.spec.ts` fails a
console-error assertion on twelve routes. The repo's own precedent is the same shape: in the v2
rebuild the Spanish copy was a document (`f889f2f`) and **both** JSON trees landed together
with the components (`46cebd2`).

**So E3c lands `es.json`, `en.json`, the components, `copy-allow.json` and the tests in one
green commit.** `check:parity` is the guard for the transcription, and it fails loudly. What
moves is the commit boundary, not the work or its order.

## What did NOT need translating

Twelve of the strings below already exist in `messages/en.json` and are reproduced unchanged.
They are marked **(EXISTS)**. Retranslating a string that was already approved is how a site
drifts between languages one slice at a time.

## One rule this document obeys that the Spanish one did not have to

**"IA Corporativa" does not translate as a name.** The Spanish site's positioning phrase is a
name as of HQA-D97, and English gets **"Corporate AI"**, which is what `<title>` and the social
card have said since E2. It is capitalized in English the way an English title capitalizes, not
because the Spanish rule crossed over. **"Osppy IA Empresarial" is never translated at all**
(brand guide §4.3 forbids it) and does not appear in the house copy.

---

# 1 · Hero · `home.hero.*`

| Key | Spanish (approved) | English |
|---|---|---|
| `headline` | IA Corporativa | **Corporate AI** |
| `apoyo` | El futuro te está esperando. | **The future is waiting for you.** |
| `scroll` | Baja | **Scroll** |

*No `cta` and no `ctaMessage`: the operator closed decision 2 with no button in the hero.*

**On `apoyo`.** The Spanish is the operator's own sentence. The English is its plainest reading,
kept the same length and the same lack of a claim. Two alternatives, if you want the English to
lean warmer or shorter: **(b)** "The future is already waiting." · **(c)** "Your future is
waiting." The recommendation is the first: "waiting for you" carries the address to the reader
that "te está esperando" has, and the other two lose it.

---

# 2 · Corporate AI, applied · `home.aplicada.*`

| Key | Spanish (approved) | English |
|---|---|---|
| `kicker` | IA Corporativa Aplicada | **Corporate AI, applied** |
| `headline` | Tu empresa ya sabe que necesita IA | **Your company already knows it needs AI** **(EXISTS)** |
| `subtitulo` | Lo que no te dicen, es \<u\>dónde\</u\> | **What they don't tell you is \<u\>where\</u\>** **(EXISTS)** |

**On the kicker.** The Spanish capitalizes all three words because it is the name plus its
applied form. English uses the comma form, because "Corporate AI Applied" reads as a product
name and there is no product by that name. The `<u>` tag wraps exactly one word in each
language and a test asserts it: `dónde` in Spanish, `where` in English.

**The panel keys** move from `home.hero.panel.*` to `home.aplicada.panel.*` unchanged in both
languages, and **E4 rewrites them entirely** when the panel becomes a KPI board (HQA-D91). No
panel copy is proposed here in either language.

---

# 3 · The silence · `home.silencio.*`

| Key | Spanish (approved) | English |
|---|---|---|
| `headline` | “Sabemos que necesitamos IA.” Y después, silencio. | **“We know we need AI.” And then, silence.** **(EXISTS)** |

*No kicker and no body in either language. The caret is CSS and carries no key.*

---

# 4 · What Osppy is · `home.porque.*`

| Key | Spanish (approved) | English |
|---|---|---|
| `kicker` | Qué es Osppy | **What Osppy is** |
| `quienes` | Osppy es una consultoría de IA Corporativa: ponemos la inteligencia artificial a hacer trabajo dentro de la operación de tu empresa. | **Osppy is a Corporate AI consultancy: we put artificial intelligence to work inside your company's operation.** |

**On "consultoría".** English gets **consultancy**, not "consulting firm" and not "agency".
Consultancy is the word the Instagram account's own category already uses ("business consulting
service", kit §4) and it is the one that does not imply either a large firm or a creative shop.

**On the audience.** The Spanish dropped "medianas y grandes" by the operator's instruction and
the English drops it too. "your company" carries the same reach in both, and HQA-D37 keeps
defining who is sold to, in hq, where it belongs.

---

# 5 · How we work · `home.como.*`

| Key | Spanish | English |
|---|---|---|
| `kicker` · `headline` · `p1Titulo`…`p5Body` | *(unchanged)* | *(unchanged)* **(EXISTS)** |
| `p1Cta` | Ver Capacitación | **See Training** |
| `p2Cta` | Ver Asesoría | **See Advisory** |
| `p3Cta` · `p4Cta` · `p5Cta` | Ver Implementación | **See Implementation** |

The three service names match the localized route slugs chosen in E2 (`/training`,
`/advisory`, `/implementation`), so a reader who follows a link never lands on a page whose
name is different from the link that sent them.

---

# 6 · Functional areas · `home.areas.*`

| Key | Spanish (approved) | English |
|---|---|---|
| `kicker` | Dónde | **Where** **(EXISTS)** |
| `headline` | Áreas funcionales | **Functional areas** |
| ~~`body`~~ | **DIES** | **DIES** |
| `nota` | Si tu operación tiene un área que no está aquí, es la primera de la que queremos oír. | **If your operation has an area that isn't here, that's the first one we want to hear about.** *(trimmed the same way: "No list is your list." comes out)* |
| `cardCta` | Ver si aplica en tu caso | **See if it applies to you** **(EXISTS)** |
| The sixteen areas | *(unchanged)* | *(unchanged)* **(EXISTS)** |

---

# 7 · Three ways in · `home.hacemos.*`

| Key | Spanish (approved) | English |
|---|---|---|
| `kicker` | Qué hacemos | **What we do** **(EXISTS)** |
| `headline` | Tres maneras de entrar a tu operación. | **Three ways in.** *(the English already had the short form plus a second sentence; the second sentence comes out, as in Spanish)* |
| `capacitacion.titulo` | Capacitación | **Training** |
| `capacitacion.estado` | Disponible hoy | **Available today** |
| `capacitacion.body` | Tu equipo sale sabiendo usar la IA en su propio trabajo. | **Your team leaves knowing how to use AI in their own work.** |
| `capacitacion.cta` | Ver Capacitación | **See Training** |
| `asesoria.titulo` | Asesoría | **Advisory** |
| `asesoria.estado` | Disponible hoy | **Available today** |
| `asesoria.body` | Antes de construir nada, entender dónde entra y dónde no. | **Before building anything, understanding where it fits and where it doesn't.** |
| `asesoria.cta` | Ver Asesoría | **See Advisory** |
| `implementacion.titulo` | Implementación | **Implementation** |
| `implementacion.estado` | Disponible hoy | **Available today** |
| `implementacion.body` | Sistemas que quedan trabajando dentro de tu operación. | **Systems that stay working inside your operation.** |
| `implementacion.cta` | Ver Implementación | **See Implementation** |

The three `body` lines are deliberately the same sentences as the three service-page headlines
built in E2, in both languages. A card that promises one thing and a page that opens with
another is the cheapest way to lose a reader at the click.

---

# 8 · What has already been done · `home.trayectoria.*`

| Key | Spanish (approved) | English |
|---|---|---|
| `kicker` | Trayectoria | **Track record** **(EXISTS)** |
| `headline` | Lo que ya se hizo. | **What's already been done.** *(", without names" comes out, as in Spanish)* |
| `c1Valor` · `c1Label` | +100 · empresas asesoradas | +100 · **companies advised** **(EXISTS)** |
| `c2Valor` · `c2Label` | +50 · soluciones construidas para empresas | +50 · **solutions built for companies** **(EXISTS)** |
| `c3Valor` · `c3Label` | **+20** · giros atendidos | **+20** · **industries served** *(label EXISTS; the figure moves from +10 in both languages)* |
| ~~`c4Valor` · `c4Label`~~ | **DIE** | **DIE** |
| ~~`agentes`~~ · ~~`body`~~ | **DIE** | **DIE** |
| `giros` | Experiencia y conocimiento de la industria: tecnología y software, manufactura, electrónica, logística y transporte, construcción e infraestructura, comercio exterior, agricultura, farmacéutica, energética e inmobiliaria. | **Industry experience and knowledge: technology and software, manufacturing, electronics, logistics and transport, construction and infrastructure, foreign trade, agriculture, pharmaceuticals, energy and real estate.** |

**On the new `giros` heading.** English gets **"Industry experience and knowledge"**, which is
the idiom for what the Spanish says and which sidesteps the singular-plural awkwardness the
Spanish note flags. The ten industries are the existing English list, word for word: they were
approved with HQA-D77 and this slice has no business retranslating them.

**Three cards, not four** (decision 4). The section is composed for three in both languages.

---

# 9 · Voices · `home.voces.*`

**No change in either language.** Headline, the three quotes and the disclosure line stay word
for word, including "Illustrative voices: not verified testimonials." (HQA-D63).

---

# 10 · Questions · `home.faq.*`

| Key | Spanish | English |
|---|---|---|
| `q1`…`q3`, `a1`…`a3` | *(unchanged)* | *(unchanged)* **(EXISTS)** |
| `q4` | ¿Qué no hace Osppy? | **What doesn't Osppy do?** **(EXISTS)** |
| `a4` | No promete ahorros, ventas ni horas: eso lo miden tus números. No entrega una herramienta y se va. Y no construye sistemas que decidan por tu equipo: la inteligencia artificial propone, una persona revisa y decide. | **It doesn't promise savings, sales or hours: your numbers measure that. It doesn't hand over a tool and walk away. And it doesn't build systems that decide for your team: artificial intelligence proposes, a person reviews and decides.** |
| `q5`…`q7`, `a5`…`a7` | *(unchanged)* | *(unchanged)* **(EXISTS)** |

**`a4` is the one answer that changes**, in both languages and for the same reason: its old tail
described Diana, a product, on the home page of a consultancy Diana has left. **The first two
sentences are untouched in both languages** so the promise limit survives intact; only the third
changes register from product to service. `check-copy.mjs` will keep flagging "savings" here as
a promise word for hand review, exactly as it does today, because the word appears inside a
negation. That warning is correct and expected.

---

# 11 · Close · `home.cta.*`

| Key | Spanish (approved) | English |
|---|---|---|
| `kicker` | El siguiente paso | **The next step** **(EXISTS)** |
| `headline` | Cuéntanos con qué área quieres empezar. | **Tell us which area you want to start with.** **(EXISTS)** |
| `button` | Contacta un asesor | **Talk to an advisor** *(was "Write to us"; the key name cannot change)* |
| `ctaMessage` | *(unchanged)* | *(unchanged)* **(EXISTS)** |
| `mailLabel` | hello@osppy.com | hello@osppy.com **(EXISTS)** |
| `microcopy` | Sin formularios: te contesta una persona. | **No forms: a person answers.** **(EXISTS)** |
| ~~`body`~~ | **DIES** | **DIES** |

**"Talk to an advisor"** is the same string the three service pages already use for their CTA
(E2, `servicios.*.cta`), so the whole English site says one thing on every primary button.

---

# What disappears, in both trees at once

| Namespace | Both languages |
|---|---|
| `home.creemos.*` | Moves whole to `/asesoria` · `/advisory` |
| `home.cuanto.*` | `p1`, `p2`, `p3` split across the three service pages; the rest dies |
| `home.productos.*` | Dies. The footer's products block replaces it (built in E2) |
| `home.casos.*` | Namespace dies; `giros` moves to `home.trayectoria.giros`, the ten kinds to the service pages |
| `home.hero.diagrama.*` | Moves to `/implementacion` · `/implementation` |

**The parity risk is here and nowhere else.** Ten blocks move between four surfaces in two
languages. `check:parity` compares the two trees and fails loudly; it is the guard, and E3c runs
it before anything else.

---

# The mechanical debt E3c inherits

Carried over from the Spanish document, unchanged, plus one item this slice adds:

1. **`scripts/copy-allow.json` must go from `+10` to `+20`** on `home.trayectoria.c3Valor`, with
   its source (FDV §11.10, HQA-D77: twenty industries attested). Every new figure is a failure by
   design until it is attested.
2. **`home.hero.headline` and `home.cta.button` keep their names.** Two smoke tests read them out
   of the JSON in both languages.
3. **The underline test follows the subtitle** into `home.aplicada.subtitulo`. It reads the DOM,
   so it does not care about the key, but the `<u>` must survive the move in both languages.
4. **The `#demo` anchor stays** on the close.
5. **New with this slice:** `home.trayectoria.c3Valor` is `+20` in **both** `es.json` and
   `en.json`. The allow list is keyed by message key, not by locale, so one entry covers both;
   but if the two files disagree on the value, `check-copy` passes and the site lies in one
   language. E3c asserts the two are equal.

---

*Copy document · slice E3b · 2026-09-04 · English mirror of the approved Spanish · E3c lands
both trees, the components and the tests in one commit.*
