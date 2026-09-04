# Copy for the three service pages, English · slice E5b

> **2026-09-04.** Repo: `osppy-landing-ai-concierge`. The English mirror of
> `2026-09-04-copy-servicios-v4-es.md`, written against its **approved** version: the four
> decisions closed the same day on the session's recommendation, so no row here is provisional.
> **Still no code.** `messages/*.json` is untouched until E5c, which lands both trees, the
> components and the tests in one green commit with `check:parity` as the guard.
>
> **The two documents name the same keys.** If a key appears in one and not the other,
> `check:parity` fails loudly in E5c, which is the point of writing them as a pair.

## What is a translation here, and what is not

Three kinds of row, marked in every table, same as the Spanish document:

| Mark | What it means |
|---|---|
| **(moved)** | Reproduced **unchanged** from `2026-09-04-copy-mudado-a-servicios.md`, which carries the English of all 84 rows E3c took down from the house. Not retranslated: retranslating a string the operator already read is how a site drifts between its two halves |
| **(reused)** | Reproduced **unchanged** from `messages/en.json`, where the house already says it |
| **(new)** | Written here, in English, against the same sources the Spanish row cites. **Not a literal translation:** written as English copy and checked back against the Spanish for meaning, not for word order |

**Sixty-two of the rows below are moved or reused and reproduced verbatim.** They are marked so an
approver can see, at a glance, which strings this slice actually authored.

## The rules this copy obeys

Identical to the Spanish, and two of them bite harder in English:

- **No long dash** (HQA-D79). `check-copy.mjs` fails on a single one in `messages/*.json`, and it
  checks **both** locales. English prose reaches for it more readily than Spanish does, so every
  place one would have gone is a colon, a semicolon or a full stop here.
- **No guillemets** (HQA-D59). Straight quotes when quoting.
- **No figures.** Not one digit in this document either, so `copy-allow.json` stays closed.
- **Promise limits** (guide §5.8): no financial results, no hours, no replacement, no dates for
  anything unlaunched. `check-copy.mjs` warns on `save/saving` and `replac…` as whole words, and
  neither appears here.
- **No brand of ERP or invoicing system.** Naming one requires a delivered instance
  (`oferta.md` §2, operator 2026-09-03).
- **No workshop is marked ✅**, in any locale (catalog §1.2, correction of 2026-09-03).
- **The audience is not segmented by company size**, which is decision 2, and the English row was
  the other half of it: the meta description said "medium and large companies".

---
---

# `/training` · `servicios.capacitacion.*`

## 1 · Hero

| Key | Text | Origin |
|---|---|---|
| `kicker` | Training | reused |
| `headline` | **Your team leaves knowing how to use AI in their own work.** | **decision 1** |
| `body` | Live workshops, by group, using the tasks your team already does. | new |
| `cta` | Talk to an advisor | reused |
| `ctaMessage` | Hello, I would like to talk about AI training for my team. | reused |
| `metaTitle` | Training · Osppy | reused |
| `metaDescription` | **Hands-on artificial intelligence workshops for owners, managers and teams, with real tasks from your operation.** | **decision 2** |

> **Decision 1 lands on a string that already exists.** The English house card
> (`home.hacemos.capacitacion.body`) has said *"Your team leaves knowing how to use AI in their own
> work"* since E3c, while the page's own hero said *"knowing how to use **it**"*. So the English
> half of this decision is not a new sentence: it is the two halves of the site agreeing on the one
> the operator already approved. The pronoun problem was the same in both languages, which is worth
> noting rather than passing over: the Spanish "usarla" and the English "it" both borrowed an
> antecedent from a page the reader may never have seen.

> **Decision 2, English half.** The row said *"for owners, managers and teams at medium and large
> companies"*. The segmentation comes out and nothing replaces it. **HQA-D37 is untouched** and
> still governs who the line is sold to; what changed is that the site does not say it out loud.

## 2 · What it is · `servicios.capacitacion.queEs.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | What it is | new |
| `p1` | Live workshops, by group, with real tasks from your business. Artificial intelligence is not taught in the abstract: what gets taught is how to do one task of the job faster, more clearly and more safely. | new, catalog §2 |
| `p2` | First we teach people to use the tools well. Then we look at which problems keep coming back, and only then is it worth talking about leaving something running. | new, catalog §16 |

## 3 · Who it is for · `servicios.capacitacion.paraQuien.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | Who it is for | new |
| `q1Titulo` | Owners and leadership | new, catalog §3 |
| `q1Body` | Judgement to decide where AI is worth using, what to buy, and what not to delegate. | new, catalog §3 |
| `q2Titulo` | Managers and middle management | new, catalog §3 |
| `q2Body` | A method to standardise, supervise and sustain the use of AI inside their area. | new, catalog §3 |
| `q3Titulo` | Working teams | new, catalog §3 |
| `q3Body` | Concrete routines for doing the everyday tasks better. | new, catalog §3 |

## 4 · The routes · `servicios.capacitacion.rutas.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | The routes | new |
| `intro` | The routes run in parallel; they are not a ladder. You come in through yours. | new, catalog §4 |
| `r1Titulo` | Entry | new, catalog §5 |
| `r1Body` | A short talk for leadership and a starting workshop for the whole team, from zero. | new, catalog §5 |
| `r1Estado` | We are finishing the material. | new, catalog §1.2 (🚧) |
| `r2Titulo` | Operational | new, catalog §6 |
| `r2Body` | Workshops by area and by role: documents, photos and voice notes; spreadsheets for sales, receivables and operations; sales and quotes; customer service; administration, invoicing and collections; purchasing and suppliers; field operations; human resources and internal knowledge. | new, catalog §6 |
| `r2Estado` | Prepared with your operation when you book it. | new, catalog §1.2 (🔜) |
| `r3Titulo` | Leadership | new, catalog §7 |
| `r3Body` | For whoever decides and whoever sustains the use in their area: where AI is worth it and where it isn't, how to get it actually used, safe use and internal policy, and training an internal owner for it. | new, catalog §7 |
| `r3Estado` | Prepared with your operation when you book it. | new, catalog §1.2 (🔜) |
| `r4Titulo` | Advanced | new, catalog §8 |
| `r4Body` | For people already using it every day: automating repetitive tasks without programming, and designing a knowledge assistant for their area. | new, catalog §8 |
| `r4Estado` | Prepared with your operation when you book it. | new, catalog §1.2 (🔜) |
| `continuosTitulo` | And after the workshop | new, catalog §9 |
| `continuosBody` | A monthly clinic where you bring the work that eats your time, and a workshop built with examples from your own industry. | new, catalog §9 |
| `nota` | Training is delivered, booked and scheduled today. How finished the material is varies from one workshop to the next, and we tell you before booking, not after. | new, `oferta.md` §2 |

> **The two status lines are the English of decision 3**, derived from the catalog's own legend
> (§1.2) because the catalog marks **workshops** and never **routes**. The 🔜 legend also authorises
> saying *"I need two to three weeks"* in conversation; that stays unpublished, in both languages,
> and so does the entry talk's "no cost or nominal cost" from catalog §11. A lead time on a page is
> a commitment to anyone who reads it, and "no cost" is a commercial promise rather than a pricing
> structure.

## 5 · What has been done · `servicios.capacitacion.hecho.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | What has been done | new |
| `t1Titulo` | Claude Enterprise adoption | **moved** (`home.casos.t1Titulo`) |
| `t1Body` | Getting a whole team working with an enterprise-grade AI tool, with order and rules of use. | **moved** (`home.casos.t1Body`) |

## 6 · Where it fits · `servicios.capacitacion.encaja.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | Where it fits | new |
| `body` | Training is the Exploration phase of the method: we get to know your operation and identify where AI genuinely helps, and where it isn't needed. While the team learns to use it, the problems that really do repeat come into view. | reused (`home.como.p1Body`) plus one new sentence |
| `enlaceTitulo` | The next phase is the diagnosis | new |
| `enlaceCta` | See Advisory | reused (`home.como.p2Cta`) |

## 7 · Pricing · `servicios.capacitacion.precio.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | Pricing | new |
| `body` | Training is priced per group and per result, never per hour. | **moved** (`home.cuanto.p1`) |
| `cierre` | The figures come in the first conversation. | new, `pricing.md` §6 |

## 8 · Questions · `servicios.capacitacion.faq.*`

| Key | Text | Origin |
|---|---|---|
| `q1` | How long is a workshop? | new |
| `a1` | The length follows the scope, not the other way around: it follows what the group has to leave knowing how to do. It is written into the proposal, along with the scope and what gets delivered. | new, catalog §11 |
| `q2` | Can we practise with the company's real information? | new |
| `a2` | We practise with fictional, public or anonymised information. If you decide to use real data you need internal authorisation, and passwords, banking details, sensitive personal data and full customer databases stay out. | new, guide §7.6 |
| `q3` | Does a workshop leave my process automated? | new |
| `a3` | No. A workshop teaches capabilities. If a problem worth solving with a system shows up at the end, it is quoted separately, with written scope and success criteria. | new, guide §5.8 (approved formula) |
| `q4` | Which tool do you practise with? | new |
| `a4` | With Claude, which is Osppy's initial recommendation. The principles carry over to other tools, and that is said in every workshop. | new, catalog §2 |

## 9 · Close · `servicios.capacitacion.cierre.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | Tell us about your operation and we will find where to start. | new, source of truth §3.1 |
| `cta` | Talk to an advisor | reused |

> **Why it does not say "sign up".** Source of truth §3.1 marks this line's valid call to action as
> *"Platícanos tu operación"* and bans *"inscríbete"* explicitly. There are no open dates and no
> public calendar, and a sign-up button promises a calendar that does not exist. The English keeps
> the same shape rather than reaching for "Enrol" or "Book your seat", which would promise it back.

---
---

# `/advisory` · `servicios.asesoria.*`

## 1 · Hero

| Key | Text | Origin |
|---|---|---|
| `kicker` | Advisory | reused |
| `headline` | Before building anything, understanding where. | reused, unchanged |
| `body` | A first session to diagnose the operation, to identify where artificial intelligence helps and where it is not needed. | reused, unchanged |
| `cta` · `ctaMessage` · `metaTitle` · `metaDescription` | unchanged | reused |

## 2 · What we believe · `servicios.asesoria.creemos.*`

All nine rows are the English of `home.creemos.*`, word for word.

| Key | Text | Origin |
|---|---|---|
| `kicker` | What we believe | **moved** |
| `headline` | AI is worth it when it does a whole task, under written rules, with someone reviewing it. | **moved** |
| `c1Titulo` | A whole task, not a slice | **moved** |
| `c1Body` | Half an automated task leaves a person finishing it by hand and checking twice as much. If it can't be done end to end, it isn't time yet. | **moved** |
| `c2Titulo` | Written rules before code | **moved** |
| `c2Body` | The system does what the process says. If the process lives in one person's head, the first thing we deliver is the process, not the system. | **moved** |
| `c3Titulo` | A person reviews and decides | **moved** |
| `c3Body` | These tools get things wrong and sometimes make things up. That's why everything is built so someone can review it: the AI proposes, the person decides. | **moved** |
| `nota` | Technology can take away repetitive tasks; the decisions, the attention that matters and the responsibility stay with people. | **moved**, guide §6.7 |

## 3 · The diagnosis · `servicios.asesoria.diagnostico.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | The diagnosis | new |
| `body` | The first session looks at how you work today, area by area, and identifies where artificial intelligence helps and where it is not needed. It ends with the scope in writing, or it ends with a no. | new, `oferta.md` §2 |
| `preguntasTitulo` | The diagnostic starts with questions like: | **moved** |
| `preguntas[0]` | Where does your team's time actually go? | **moved** |
| `preguntas[1]` | Which process repeats the same way every week? | **moved** |
| `preguntas[2]` | What information do you already have that nobody is using? | **moved** |
| `preguntas[3]` | What's worth automating, and what isn't yet? | **moved** |

## 4 · A diagnosis has three outcomes · `servicios.asesoria.salidas.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | A diagnosis has three outcomes | new |
| `s1Titulo` | This is worth looking at | new, plan §4.5 |
| `s1Body` | There is an area with one concrete task that repeats, that can be done end to end, and we know which one it is. | new |
| `s2Titulo` | The process gets written first | new, plan §4.5 |
| `s2Body` | The area is the right one and the process lives in one person's head. So the first thing delivered is the process, not the system. | new |
| `s3Titulo` | Not yet | new, plan §4.5 |
| `s3Body` | Sometimes the answer is: not yet. We tell you that too. | **moved** (`home.porque.cierre`) |

## 5 · Process structuring · `servicios.asesoria.estructuracion.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | Process structuring | **moved** (`home.casos.t5Titulo`) |
| `body` | The groundwork: getting the process written down before automating anything. Without it, we don't build agents. | **moved** (`home.casos.t5Body`) |

> **This block is here because of decision 4**, closed on the session's recommendation. The English
> carries no trace of the argument, and it should not: what settled it is that the convictions block
> two sections above already promises *"the first thing we deliver is the process, not the system"*,
> so moving this to `/implementation` would leave the site contradicting itself one click apart.

## 6 · Where it fits · `servicios.asesoria.encaja.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | Where it fits | new |
| `body` | Advisory is the Diagnosis phase of the method: what information exists, where it lives and how ready it is for a system to work with it. Once the process is written and the scope defined, implementation follows. | reused (`home.como.p2Body`) plus one new sentence |
| `enlaceTitulo` | The next phase is building | new |
| `enlaceCta` | See Implementation | reused (`home.como.p3Cta`) |

## 7 · Pricing · `servicios.asesoria.precio.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | Pricing | new |
| `body` | Advisory is quoted separately, with written scope and success criteria. | **moved** (`home.cuanto.p2`, split) |
| `cierre` | The figures come in the first conversation. | new, `pricing.md` §6 |

## 8 · Questions · `servicios.asesoria.faq.*`

| Key | Text | Origin |
|---|---|---|
| `q1` | How long does a diagnosis take? | new |
| `a1` | It follows the size of the operation and how many areas are in scope. It is written into the proposal before we start, along with what gets delivered. | new, catalog §11 |
| `q2` | And if it turns out not to be worth it? | new |
| `a2` | Then that is the answer and you get it. A diagnosis that can only end in a project is not a diagnosis. | new |
| `q3` | Does the advisory commit me to building with you? | new |
| `a3` | No. What comes out of the diagnosis is delivered in writing and it is yours. If you decide to build, that is quoted separately. | new, guide §5.8 |
| `q4` | What kind of company is it for? | new |
| `a4` | For companies with separate areas, where the work already passes through several hands. There is no fixed list: it changes with the industry, the team, the size and the processes you already have. | new, source of truth §3.1, without the size segmentation |

## 9 · Close · `servicios.asesoria.cierre.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | Tell us which area you want to start with. | reused (`home.cta.headline`) |
| `cta` | Talk to an advisor | reused |

---
---

# `/implementation` · `servicios.implementacion.*`

## 1 · Hero

| Key | Text | Origin |
|---|---|---|
| `kicker` | Implementation | reused |
| `headline` | Systems that stay working inside your operation. | reused, unchanged |
| `body` | Agents, assistants and process automation that stay running, with scope and success criteria in writing. | reused, unchanged |
| `cta` · `ctaMessage` · `metaTitle` · `metaDescription` | unchanged | reused |

## 2 · AI agents · `servicios.implementacion.agentes.*`

The seven diagram rows are the English of `home.hero.diagrama.*`, word for word.

| Key | Text | Origin |
|---|---|---|
| `titulo` | AI agents | new |
| `body` | An agent does a whole task on its own, inside a defined process and under written rules. Whole means end to end: half an automated task leaves a person finishing it by hand and checking twice as much. | new, on `home.creemos.c1Body` |
| `revision` | The AI proposes; a person reviews and decides. Everything is built so that review is possible. | new, guide §6.7 |
| `diagrama.tarea` | The task | **moved** |
| `diagrama.proceso` | The process | **moved** |
| `diagrama.procesoEtiqueta` | written by someone | **moved** |
| `diagrama.agente` | The agent | **moved** |
| `diagrama.resultado` | The result | **moved** |
| `diagrama.pie` | The step almost nobody has written down is the second one. | **moved** |
| `diagrama.alt` | Four-step diagram: the task goes through a process someone wrote down, an agent runs it, and it produces a result. | **moved** |

## 3 · What has been built · `servicios.implementacion.construido.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | What has been built | **moved** (`home.hacemos.implementacion.tiposTitulo`, without the colon) |
| `f1Titulo` | They do the task | new, plan §4.5 |
| `f1i1Titulo` | AI agents | **moved** (`t3`) |
| `f1i1Body` | They do a whole task on their own, autonomously, inside a defined process, with written rules. | **moved** |
| `f1i2Titulo` | AI assistants | **moved** (`t7`) |
| `f1i2Body` | They answer and attend with the information the business loads. If something isn't there, they say so or ask; they don't make things up. | **moved** |
| `f1i3Titulo` | Process automation | **moved** (`t6`) |
| `f1i3Body` | Once it is written, the process stops being done by hand: the system runs it and a person reviews the result. | **moved** |
| `f2Titulo` | They produce documents | new, plan §4.5 |
| `f2i1Titulo` | Quoting tools | **moved** (`t8`) |
| `f2i1Body` | Systems that put a quote together using the business's own rules and prices, so it doesn't depend on one person. | **moved** |
| `f2i2Titulo` | Templates with your company's letterhead | **moved** (`t9`) |
| `f2i2Body` | Documents that go out to a client are built with your format, your letterhead and your details, without being redone each time. | **moved** |
| `f2i3Titulo` | A system for handling audits | **moved** (`t10`) |
| `f2i3Body` | The file is assembled as things happen, not the week the auditor arrives, and every document ends up where someone will look for it. | **moved** |
| `f3Titulo` | They live in your house | new, plan §4.5 |
| `f3i1Titulo` | Models in your infrastructure | **moved** (`t4`) |
| `f3i1Body` | When the information can't leave your house, the model is deployed inside your own infrastructure, with Amazon Bedrock. | **moved** |

## 4 · How it connects · `servicios.implementacion.conecta.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | How it connects | new |
| `body` | What we build connects to the ERP and the invoicing system you already use. How far that connection goes is defined in the diagnosis and put in writing before it appears in any proposal. | new, `oferta.md` §2 |
| `nota` | We do not publish system brands. Naming one requires an instance already delivered, and that is a conversation, not a page. | new, catalog §15 and operator 2026-09-03 |

## 5 · The three phases · `servicios.implementacion.fases.*`

The three bodies are the English of `home.como.*`, word for word.

| Key | Text | Origin |
|---|---|---|
| `titulo` | The three phases | new |
| `f1Titulo` | Solution design | reused (`home.como.p3Titulo`) |
| `f1Body` | The process gets written down and the solution is drawn on top of it, with a scoped proof of concept (PoC) before building at scale. | reused (`home.como.p3Body`) |
| `f2Titulo` | Implementation | reused (`home.como.p4Titulo`) |
| `f2Body` | Development of the system and of its technical operation (MLOps). Quoted separately, with written scope and success criteria: you measure the impact, with your own numbers. | reused (`home.como.p4Body`) |
| `f3Titulo` | Support and monitoring | reused (`home.como.p5Titulo`) |
| `f3Body` | Governance and retraining: what we deliver stays under a monitoring and maintenance plan, and the system adjusts as your operation changes. | reused (`home.como.p5Body`) |

## 6 · After delivery · `servicios.implementacion.despues.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | After delivery | new |
| `body` | What gets delivered can stay under an operation plan: hosting, monitoring and maintenance. | **moved** (`home.cuanto.p3`) |

## 7 · Pricing · `servicios.implementacion.precio.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | Pricing | new |
| `body` | Implementation is quoted separately, with written scope and success criteria. | **moved** (`home.cuanto.p2`, the other half) |
| `cierre` | The figures come in the first conversation. | new, `pricing.md` §6 |

## 8 · Questions · `servicios.implementacion.faq.*`

| Key | Text | Origin |
|---|---|---|
| `q1` | What if my process isn't written down anywhere? | new |
| `a1` | That's the most common case, and it is the first piece of work. Writing the process comes before any automation: we don't build agents on top of processes that only live in someone's head. | new, on `home.faq.a3` |
| `q2` | Does my company's information leave my infrastructure? | new |
| `a2` | It depends on what we build, and it is defined in writing before we start: what information can be used, what gets anonymised and what stays out. When it can't leave, the model is deployed inside your own infrastructure. | new, guide §6.7 |
| `q3` | Who operates the system afterwards? | new |
| `a3` | What we deliver stays under a monitoring and maintenance plan, and it adjusts as your operation changes. We don't hand over a tool and walk away. | new, on `home.faq.a4` |
| `q4` | How long does it take? | new |
| `a4` | It follows the scope, and the scope comes out of the diagnosis. Before that, any date would be invented, so we don't give one. | new, guide §5.8 |

## 9 · Close · `servicios.implementacion.cierre.*`

| Key | Text | Origin |
|---|---|---|
| `titulo` | Tell us which area you want to start with. | reused (`home.cta.headline`) |
| `cta` | Talk to an advisor | reused |

---
---

# What E5c inherits

1. **Both trees land in one commit**, with `check:parity` as the guard. The two documents name the
   same keys; a single missing twin fails the gate.
2. **`copy-allow.json` is not touched.** Neither document carries a figure.
3. **The three `headline` keys and the three `cta` keys keep their names.** `smoke.spec.ts` reads
   them from the JSON, per locale, so their values may change and their names may not.
4. **`check-copy.mjs` reads both locales**, and the metadata pass already covers the three service
   pages since E2. Decision 2 is therefore checked in both halves.
5. **The three pages must not share a visual structure.** `/training` carries a catalog,
   `/advisory` carries an argument, `/implementation` carries an inventory. The current
   `PaginaServicio.tsx` is a shared hero spine and is explicitly not a licence to render three
   identical bodies.
6. **No workshop is marked ✅ anywhere**, including in an `alt` attribute or a component literal.

# One thing worth saying about the English itself

The Spanish site says **tú** by decision (HQA-D35) and English has no such fork, so the register
has to be carried by something else: short sentences, no marketing verbs, and the same refusal to
promise. Two places where a literal translation would have broken it, and did not:

- *"Platícanos tu operación"* became **"Tell us about your operation"**, not "Book a consultation".
  The Spanish is deliberately not a booking; the English must not become one.
- *"Se prepara con tu operación al contratarlo"* became **"Prepared with your operation when you
  book it"**, not "Available on demand". "On demand" reads as ready to ship, which is exactly what
  the 🔜 mark does not mean.

*Copy document · slice E5b · 2026-09-04 · English · Written against the approved Spanish, and it
names the same keys.*
