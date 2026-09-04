# Copy de la casa reestructurada, español · tanda E3a (para aprobación)

> **2026-09-04.** Repo: `osppy-landing-ai-concierge`. Compuerta previa de E3b (inglés) y E3c
> (construcción). Plan: `../../osppy-hq/prompts/2026-09-03-landing-v4-consultora-master-prompt.md`
> §3.2, §3.3, §4.2 a §4.4. Sustituye al copy de V4a (`2026-09-03-copy-casa-es.md`) en todo lo
> que se contradiga; lo que aquel documento aprobó y esta tanda no toca sigue vigente palabra
> por palabra.
> **Esto es texto para leer y corregir, no código.** Nada de aquí ha entrado a `messages/*.json`:
> el inglés no existe todavía y `check:parity` compara los dos árboles de llaves.
> **Cómo se lee:** cada sección trae su llave y su texto exacto. Tachar, reescribir encima o
> decir "esta sección sobra" es la forma de aprobarla. Los renglones marcados **DECISIÓN** son
> los que no puedo cerrar yo.

## Qué cambió respecto de la casa de hoy, en una tabla

| Hoy | Mañana |
|---|---|
| 11 secciones, la primera es un argumento | 11 secciones, la primera es una frase y una atmósfera |
| Productos a la vista (Diana Hoteles, Diana Citas) | Productos fuera de la casa; viven en el pie como una pregunta (ya hecho en E2) |
| "Lo que creemos", "Cuánto" y "Productos" | Las tres bajan: dos se mudan a las páginas de servicio, una muere |
| El método es un capítulo | El método es navegación: cada fase lleva a su servicio |
| Cinco párrafos en "Por qué" | Una pantalla de silencio y una sola frase |

## Las reglas que este copy obedece

| Regla | Fuente | Cómo se ve aquí |
|---|---|---|
| Posicionamiento: **IA corporativa** | HQA-D89 (2026-09-04) | La primera pantalla es literalmente esa frase |
| Público: **empresas medianas y grandes** | HQA-D37, vigente | El posicionamiento cambió, el público no |
| **Sin raya larga** en nada que lea un cliente | HQA-D79 | Cero en todo el documento; `check-copy.mjs` reprueba una sola |
| **Sin guillemets** en texto nuevo | HQA-D59 | Comillas curvas donde ya existían, rectas donde hay que citar |
| **Cero cifras** fuera de las atestiguadas | HQA-D30; `copy-allow.json` | Solo +100, +50 y **+20**, y el +20 obliga a mover el archivo (ver la deuda mecánica al final) |
| Sin ahorros, horas ni reemplazo | guía §5.8; banco de prohibidas | Ninguna sección promete un número de impacto |
| Precio: estructura, ninguna cifra | HQA-D43, superada en forma por HQA-D94 | La sección de precio muere; su contenido se reparte a las tres páginas |
| Tú en todo el sitio | HQA-D35 | Todo el documento |
| Áreas e industrias son **ejemplos**, no clientes | HQA-D44, D45 | La nota de la sección 6 y la línea de industrias lo dicen |

**Dos llaves no se pueden renombrar**, porque hay pruebas que las leen del JSON:
`home.hero.headline` (el `h1` de la casa) y `home.cta.button`.

---

# 1 · Héroe · `home.hero.*`

Pantalla limpia, enorme, una sola frase. Fondo abstracto en código, sin foto, sin panel, sin
diagrama, sin cifras. Lo que tiene que producir es **alivio**.

| Llave | Texto |
|---|---|
| `headline` | **IA corporativa** |
| `apoyo` | La inteligencia artificial trabajando dentro de tu operación, con tus reglas y tu gente al mando. |
| `scroll` | Baja |

> **DECISIÓN 1 · La línea de apoyo.** La de arriba es la candidata del plan §4.2. Dos
> alternativas, por si la primera se siente larga:
> **(b)** Inteligencia artificial que hace trabajo real dentro de tu empresa, con tus reglas.
> **(c)** Tu operación, trabajando. Tus reglas, tu gente, tus decisiones.

> **DECISIÓN 2 · ¿El héroe lleva botón?** (pregunta 3 del plan §9). **La recomendación es que
> no**: la primera pantalla es una promesa y el indicador de scroll es la única acción. Si lo
> quieres, las llaves serían `home.hero.cta` = "Contacta un asesor" y `home.hero.ctaMessage`.

**Lo que sale del héroe:** el kicker, el subtítulo, el panel y el diagrama de cuatro nodos. El
kicker, el titular y el subtítulo bajan a la sección 2; el diagrama se va a `/implementacion`.

---

# 2 · IA corporativa aplicada · `home.aplicada.*`

El héroe de hoy, degradado a segunda pantalla. **El titular y el subtítulo no se tocan**: lo
único que cambia es que dejan de ser el `h1` de la página.

| Llave | Texto |
|---|---|
| `kicker` | **IA corporativa aplicada** *(era "IA aplicada para empresas")* |
| `headline` | Tu empresa ya sabe que necesita IA *(INTACTO)* |
| `subtitulo` | Lo que no te dicen, es <u>dónde</u> *(INTACTO, con el subrayado grueso solo en "dónde")* |

**El panel.** Sus llaves se mudan de `home.hero.panel.*` a `home.aplicada.panel.*` **sin cambiar
una palabra** en E3c, y **E4 las reescribe enteras** cuando el panel pase de cola de trabajo a
tablero de KPIs (HQA-D91). Por eso este documento no propone copy de panel: sería copy que se
tira en la tanda siguiente.

> **Observación, no decisión.** Debajo de `md` esta sección no pinta el panel (regla de D4) y ya
> no pinta el diagrama, así que en el teléfono vive solo de tipografía. Es la pregunta 10 del
> plan §9 y es de diseño, no de copy: si la respuesta es "tipografía y ya", este documento no
> necesita ninguna llave más.

---

# 3 · El silencio · `home.silencio.*`

Pantalla completa. Vacío, oscuridad, el cursor parpadeando en una línea de respuesta que nunca
se escribe. Al hacer scroll, la pantalla abre hacia tonos mucho más claros y entrega la
sección 4.

| Llave | Texto |
|---|---|
| `headline` | **“Sabemos que necesitamos IA.” Y después, silencio.** *(hoy es `home.porque.headline`; se muda tal cual y se pone en un solo renglón)* |

**Sin kicker y sin cuerpo, a propósito.** Cualquier renglón de más le quita a la sección lo
único que tiene que hacer. El cursor es CSS (`.caret-blink`, HQA-D83) y no lleva llave; bajo
movimiento reducido se queda quieto.

---

# 4 · Qué es Osppy · `home.porque.*`

Una sola frase. Se van el paréntesis y los cuatro párrafos. La foto se queda.

| Llave | Texto |
|---|---|
| `kicker` | **Qué es Osppy** *(era "Por qué")* |
| `quienes` | **Osppy pone la inteligencia artificial a hacer trabajo dentro de la operación de empresas medianas y grandes.** |

> **DECISIÓN 3 · Esta frase pierde o conserva al público.** El plan §3.2 la escribió así:
> "Osppy pone la inteligencia artificial a hacer trabajo dentro de la operación **en empresas**."
> La de arriba dice **"de empresas medianas y grandes"**, tres palabras más, y es la que
> recomiendo: es la única frase de la casa que define qué es Osppy, y HQA-D37 sigue vigente. Si
> prefieres la versión corta del plan, se cambia en un renglón.

**Lo que muere aquí:** `p1`, `p2`, `p3`. **Lo que no muere, se muda:** `cierre` ("A veces la
respuesta es: todavía no. Y también te lo decimos.") se va a `/asesoria`, que es donde el plan
§4.5 dice que esa frase por fin tiene su lugar en vez de perderse en un párrafo.

---

# 5 · Cómo trabajamos · `home.como.*`

Titular y las cinco fases **intactos**. Lo único nuevo es que cada fase se vuelve un enlace a su
servicio, y un enlace necesita un nombre que se pueda leer en voz alta.

| Llave | Texto | Destino |
|---|---|---|
| `kicker` · `headline` · `p1Titulo`…`p5Body` | *(INTACTOS, palabra por palabra)* | |
| `p1Cta` | Ver Capacitación | `/capacitacion` |
| `p2Cta` | Ver Asesoría | `/asesoria` |
| `p3Cta` | Ver Implementación | `/implementacion` |
| `p4Cta` | Ver Implementación | `/implementacion` |
| `p5Cta` | Ver Implementación | `/implementacion` |

Tres fases van a la misma página, y por eso el nombre del enlace repite el del servicio y no
dice "Ver más": cinco enlaces llamados "Ver más" son cinco enlaces indistinguibles para quien
navega con teclado o con lector de pantalla.

---

# 6 · Áreas funcionales · `home.areas.*`

El scroll de las dieciséis áreas se queda como está. Lo que se va es el discurso de arriba.

| Llave | Texto |
|---|---|
| `kicker` | Dónde *(INTACTO)* |
| `headline` | **Áreas funcionales** |
| ~~`body`~~ | **MUERE.** Decía: "La IA no entra 'en la empresa'. Entra en un área, con una tarea. Estas son las dieciséis donde más seguido empieza la conversación, cada una con un ejemplo de por dónde." |
| `nota` | **Si tu operación tiene un área que no está aquí, es la primera de la que queremos oír.** *(recortada: sale "Ninguna lista es la tuya.")* |
| `cardCta` | Ver si aplica en tu caso *(INTACTO)* |
| Las dieciséis áreas | *(INTACTAS, nombre y tarea)* |

*Nota de implementación para E3c: `cardCta` apunta a `#demo` y ahí se queda. El comentario del
código dice que iba a apuntar a `/diagnostico` en V5; esa ruta quedó fuera de alcance sin fecha
(HQA-D93) y el comentario hay que corregirlo.*

---

# 7 · Tres maneras de entrar · `home.hacemos.*`

Tres recuadros clicables. En la casa se queda **solo** el nombre, el estado, una frase corta y
el enlace. Todo el detalle se muda a las páginas de servicio.

| Llave | Texto |
|---|---|
| `kicker` | Qué hacemos *(INTACTO)* |
| `headline` | **Tres maneras de entrar a tu operación.** *(sale "Empieza por la que te quede.")* |
| `capacitacion.titulo` | Capacitación |
| `capacitacion.estado` | Disponible hoy |
| `capacitacion.body` | **Tu equipo sale sabiendo usar la IA en su propio trabajo.** |
| `capacitacion.cta` | Ver Capacitación |
| `asesoria.titulo` | Asesoría |
| `asesoria.estado` | Disponible hoy |
| `asesoria.body` | **Antes de construir nada, entender dónde entra y dónde no.** |
| `asesoria.cta` | Ver Asesoría |
| `implementacion.titulo` | Implementación |
| `implementacion.estado` | Disponible hoy |
| `implementacion.body` | **Sistemas que quedan trabajando dentro de tu operación.** |
| `implementacion.cta` | Ver Implementación |

**Se mudan a las páginas de servicio, no se pierden** (contrato del plan §3.3, y E5a los recibe):
`capacitacion.f1Label`…`f4Value` (formato, para quién, estado, precio) a `/capacitacion` ·
`asesoria.preguntasTitulo` y las cuatro `preguntas` a `/asesoria` ·
`implementacion.tiposTitulo` y los nueve `tipos` a `/implementacion`.

---

# 8 · Lo que ya se hizo · `home.trayectoria.*`

| Llave | Texto |
|---|---|
| `kicker` | Trayectoria *(INTACTO)* |
| `headline` | **Lo que ya se hizo.** *(sale ", sin nombres")* |
| `c1Valor` · `c1Label` | +100 · empresas asesoradas *(INTACTOS)* |
| `c2Valor` · `c2Label` | +50 · soluciones construidas para empresas *(INTACTOS)* |
| `c3Valor` · `c3Label` | **+20** · giros atendidos *(era +10; veinte giros están atestiguados en FDV §11.10, HQA-D77)* |
| ~~`c4Valor` · `c4Label`~~ | **MUEREN.** Eran "24/7 · atención del asistente", que era lenguaje de producto en la casa de una consultora |
| ~~`agentes`~~ | **MUERE.** Decía: "Además: agentes que hacen la tarea completa por su cuenta, de forma autónoma, operando hoy en sistemas en producción." |
| ~~`body`~~ | **MUERE.** Decía: "Aquí no se nombra a ningún cliente sin permiso por escrito…" |
| `giros` | Industrias a las que ayudamos: tecnología y software, manufactura, electrónica, logística y transporte, construcción e infraestructura, comercio exterior, agricultura, farmacéutica, energética e inmobiliaria. *(hoy vive en `home.casos.giros`; se muda de llave sin cambiar una palabra)* |

> **DECISIÓN 4 · La cuarta tarjeta.** Con 24/7 fuera, la sección queda en **tres tarjetas**
> (HQA-D95). La cuarta está abierta y es tuya: cualquier cifra que entre necesita tu
> atestación fechada, o una fila de FDV §11.10 o §11.12. **Mientras no la des, se construye
> con tres y se ve bien con tres.**

> **DECISIÓN 5 · La línea de industrias** (pregunta 7 del plan §9). No la mencionaste en el
> dictado. **La recomendación es que se quede**, con la llave mudada a `home.trayectoria.giros`:
> es lo único en la casa que dice la amplitud real del trabajo, está atestiguada, y su
> redacción ya obedece tu instrucción de no encabezarla con "entregado".

**Los diez tipos de "De qué tipo" se mudan** a las tres páginas (plan §3.3): `t1` a
`/capacitacion` · `t2` y `t5` a `/asesoria` · `t3`, `t4`, `t6`, `t7`, `t8`, `t9`, `t10` a
`/implementacion`. `casos.tiposTitulo` muere. **El namespace `home.casos.*` desaparece entero.**

---

# 9 · Voces · `home.voces.*`

**Sin ningún cambio.** Titular, las tres voces y la línea de divulgación se quedan palabra por
palabra, incluida "Voces ilustrativas: no son testimonios verificados." (HQA-D63).

---

# 10 · Preguntas · `home.faq.*`

Siete preguntas, misma estructura, mismo orden. Una sola respuesta cambia.

| Llave | Texto |
|---|---|
| `q1`…`q3`, `a1`…`a3` | *(INTACTAS)* |
| `q4` | ¿Qué no hace Osppy? *(INTACTA)* |
| `a4` | **No promete ahorros, ventas ni horas: eso lo miden tus números. No entrega una herramienta y se va. Y no construye sistemas que decidan por tu equipo: la inteligencia artificial propone, una persona revisa y decide.** |
| `q5`…`q7`, `a5`…`a7` | *(INTACTAS)* |

> **DECISIÓN 6 · Por qué cambia la respuesta 4.** Hoy termina así: "Y sus sistemas no confirman
> precios, disponibilidad ni condiciones que nadie verificó: cuando no saben algo, lo dicen,
> preguntan o pasan la conversación a una persona." Eso describe a **Diana**, que es un
> producto, en la casa de una consultora de la que Diana ya salió. La versión de arriba dice lo
> mismo en clave de servicio y conserva el encuadre de la guía §6.7 (la IA propone, la persona
> decide). Si prefieres dejarla como está, se deja: es una respuesta verdadera, solo que ya no
> habla de esta página.

*Observación, no decisión: con los productos fuera de la vista, quien llegó buscando Diana no
encuentra nada en la casa salvo el bloque del pie. Si en algún momento quieres una octava
pregunta del tipo "¿Tienen productos propios?", el lugar es este y son dos llaves.*

---

# 11 · Cierre · `home.cta.*`

Un solo cierre grande. Absorbe lo que era la sección de precio. Sin párrafos.

| Llave | Texto |
|---|---|
| `kicker` | El siguiente paso *(INTACTO)* |
| `headline` | **Cuéntanos con qué área quieres empezar.** *(textual tuyo, conservado)* |
| `button` | **Contacta un asesor** *(era "Escríbenos"; la llave no se puede renombrar)* |
| `ctaMessage` | Hola, quiero platicar sobre la operación de mi empresa. El área por la que quiero empezar es… *(INTACTO)* |
| `mailLabel` | hello@osppy.com *(INTACTO; hay una prueba que busca este enlace por su nombre)* |
| `microcopy` | Sin formularios: te contesta una persona. *(INTACTO)* |
| ~~`body`~~ | **MUERE.** Era el párrafo, y dijiste sin párrafos |

*El `cierre` de la sección 4 ("A veces la respuesta es: todavía no…") decía casi lo mismo que
este `body`. Por eso el párrafo se puede ir sin perder la idea: la idea vive ahora en
`/asesoria`, dicha una sola vez y en el lugar correcto.*

---

# Lo que desaparece de la casa entera

| Namespace | Qué pasa |
|---|---|
| `home.creemos.*` | **Se muda íntegro a `/asesoria`** (las tres convicciones y su nota). No se pierde una palabra |
| `home.cuanto.*` | `p1` a `/capacitacion`, `p2` a `/asesoria` y `/implementacion`, `p3` a `/implementacion`. `kicker`, `headline`, `body`, `cierre` y `nota` **mueren** |
| `home.productos.*` | **Muere.** Su función la hace el bloque de Productos del pie, ya construido en E2 |
| `home.casos.*` | **Muere el namespace**; `giros` se muda a `home.trayectoria.giros` y los diez tipos a las tres páginas |
| `home.hero.diagrama.*` | **Se muda a `/implementacion`**, a su sección de agentes |

---

# La deuda mecánica que E3b y E3c heredan

No es copy, pero si nadie lo escribe se descubre cuando la compuerta esté en rojo:

1. **`scripts/copy-allow.json` tiene que pasar de `+10` a `+20`** en `home.trayectoria.c3Valor`,
   con su fuente. Sin eso `check-copy.mjs` reprueba: toda cifra nueva es una falla por diseño.
2. **`home.hero.headline` y `home.cta.button` conservan su nombre.** Dos pruebas de humo las
   leen del JSON y pasan solas si el valor cambia y la llave no.
3. **La prueba del subrayado de "dónde" sigue el subtítulo** a `home.aplicada.subtitulo`. Lee el
   DOM, no la llave, así que no se toca; pero si el `<u>` se pierde en la mudanza, falla, y
   hace bien.
4. **El ancla `#demo` se queda** en el cierre: hay una prueba que la usa, y `cardCta` de la
   sección 6 apunta ahí.
5. **El árbol de llaves de `en.json` tiene que quedar idéntico** después de mover diez bloques
   de copy entre superficies. `check:parity` es el guardián y falla ruidosamente.

---

# Las seis decisiones, juntas

| # | Qué | Recomendación |
|---|---|---|
| **1** | La línea de apoyo del héroe | La candidata (a) |
| **2** | ¿El héroe lleva botón? | No |
| **3** | "en empresas" o "de empresas medianas y grandes" | La segunda |
| **4** | La cuarta tarjeta de Trayectoria | Tres tarjetas hasta que la des |
| **5** | ¿Se queda la línea de industrias? | Sí, mudada a `home.trayectoria.giros` |
| **6** | La respuesta 4 de la FAQ | Cambiarla |

*Documento de copy · tanda E3a · 2026-09-04 · Español (MX) · El inglés (E3b) se escribe contra la
versión aprobada de este documento, no contra este.*
