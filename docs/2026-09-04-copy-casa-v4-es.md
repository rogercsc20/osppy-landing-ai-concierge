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
>
> **APROBADO el 2026-09-04. Las siete decisiones están cerradas** (tres rondas de respuestas). Cerradas: la
> **1**, la **2**, la **3**, la **5** y la **7**, más la ratificación de **E0-3** (el operador
> dijo que el héroe llevaba "una imagen de fondo", se le puso enfrente la contradicción con su
> propia respuesta del 2026-09-03 y eligió el abstracto en código). Las dos últimas, la **4** y la **6**, se cerraron con la
> recomendación de la sesión. **El documento está completo y E3b escribe el inglés de todo.**

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
| Posicionamiento: **IA Corporativa** | HQA-D89 (2026-09-04) | La primera pantalla es literalmente esa frase |
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
| `headline` | **IA Corporativa** |
| `apoyo` | **El futuro te está esperando.** |
| `scroll` | Baja |

> **DECISIÓN 1 · CERRADA por el operador el 2026-09-04.** Ninguna de las tres candidatas: la
> escribió él, "el futuro te esta esperando". Se publica con acento y punto final,
> **"El futuro te está esperando."**
>
> **Una nota que este documento deja escrita, sin volver a abrir la decisión.** La guía §5.3
> define la promesa de la marca como "deliberadamente modesta y verificable" y el pilar 4 del
> §5.6 es "criterio, no humo". Esta línea no afirma nada verificable, y eso es deliberado: el
> operador pidió abrir con un sentimiento y no con un argumento. **No está prohibida en el
> banco.** El significado llega una pantalla después, en la sección 2, con "Tu empresa ya sabe
> que necesita IA": **la primera pantalla completa de la casa no dice qué hace Osppy, y ése es
> el trato.**

> **DECISIÓN 2 · CERRADA por el operador el 2026-09-04: sin botón.** Textual: "no boton en el
> heroe". La primera pantalla es una promesa y el indicador de scroll es la única acción. No
> existen `home.hero.cta` ni `home.hero.ctaMessage`.

> **CERRADA · El fondo del héroe.** El operador dijo el 2026-09-04 que el héroe era la frase
> "con una imagen de fondo", lo que contradecía su propia respuesta de la compuerta E0-3 del
> 2026-09-03 (diseño abstracto en código, sin foto). Puesta la contradicción enfrente, eligió
> **el abstracto en código**. E0-3 queda ratificada y §4.2 del plan no se toca. Se anota aquí en
> vez de dejarlo pasar porque la próxima sesión que lea "imagen de fondo" en un mensaje va a
> volver a dudar.

**Lo que sale del héroe:** el kicker, el subtítulo, el panel y el diagrama de cuatro nodos. El
kicker, el titular y el subtítulo bajan a la sección 2; el diagrama se va a `/implementacion`.

---

# 2 · IA Corporativa Aplicada · `home.aplicada.*`

El héroe de hoy, degradado a segunda pantalla. **El titular y el subtítulo no se tocan**: lo
único que cambia es que dejan de ser el `h1` de la página.

| Llave | Texto |
|---|---|
| `kicker` | **IA Corporativa Aplicada** *(era "IA aplicada para empresas"; "Aplicada" también va en mayúscula porque el operador ofreció "IA Corporativa Aplicada" como la otra forma del término, no como el término más un adjetivo)* |
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
| `quienes` | **Osppy es una consultoría de IA Corporativa: ponemos la inteligencia artificial a hacer trabajo dentro de la operación de tu empresa.** |

> **DECISIÓN 3 · CERRADA por el operador el 2026-09-04.** Textual: "no menciones empresas
> medianas y grandes, simplemente para empresas, o corporaciones o algo así, pero sí menciona el
> público y categoría, somos consultoría". La frase de arriba hace las tres cosas: **categoría**
> (una consultoría de IA Corporativa), **público** (tu empresa) y **qué hace**, sin la
> segmentación por tamaño.
>
> **Variante, por si prefieres la palabra más corporativa:** "Osppy es una consultoría de IA
> Corporativa para corporaciones: ponemos la inteligencia artificial a hacer trabajo dentro de
> tu operación." Se cambia en un renglón.
>
> **Tres notas que esta decisión deja escritas, para que nadie las relea como error:**
>
> 1. **"Una consultoría", nunca "la consultoría".** Reclamar la categoría es un superlativo sin
>    ganar y la guía los prohíbe (§12, punto 5; kit §3.3 cita la misma regla para la bio).
> 2. **La empresa se nombra consultoría; el servicio se sigue llamando asesoría.** La cabecera de
>    la guía ya dice "capacitación, consultoría e implementación", y `oferta.md` §2 nombra la
>    línea "Asesoría". No es incoherencia, son dos niveles: qué es la casa y cómo se llama uno
>    de sus tres servicios.
> 3. **Sacar "medianas y grandes" del sitio no mueve HQA-D37.** Esa fila define a quién se le
>    vende y sigue vigente en `oferta.md`, en la fuente de verdad y en la guía; lo que cambia es
>    que el sitio no lo dice en voz alta. "Empresas" contiene a "empresas medianas y grandes",
>    así que la casa no afirma nada que la verdad no respalde. **Esto sí merece fila de ledger**
>    y la pido al cerrar la compuerta.

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
| `giros` | **Experiencia y conocimiento de la industria: tecnología y software, manufactura, electrónica, logística y transporte, construcción e infraestructura, comercio exterior, agricultura, farmacéutica, energética e inmobiliaria.** *(la lista no cambia; cambia el encabezado, y la llave se muda de `home.casos.giros`)* |

> **DECISIÓN 4 · CERRADA por el operador el 2026-09-04: tres tarjetas.** Con 24/7 fuera, la
> sección se construye con **tres** (HQA-D95). La cuarta **no se inventa y no se rellena**:
> cualquier cifra que entre ahí necesita atestación fechada del operador, o una fila de FDV
> §11.10 o §11.12. El hueco sigue abierto con dueño O y **deja de bloquear**: si algún día llega
> la cifra, es una llave y una entrada en `copy-allow.json`, no un rediseño.
>
> *Nota de implementación para E3c: tres tarjetas no es una rejilla de cuatro con un hueco. La
> sección se compone para tres, o la cuarta ausencia se ve como un error de maquetación.*

> **DECISIÓN 5 · CERRADA por el operador el 2026-09-04: se queda, y cambia de encabezado.**
> Textual: "si se queda la línea de industrias, podemos poner, experiencia y conocimiento de la
> industria, y las listamos". La llave se muda a `home.trayectoria.giros` (el namespace
> `home.casos.*` desaparece) y **la lista de diez no cambia ni una palabra**.
>
> **El encabezado nuevo es más defendible que el viejo, no menos.** La guía §7.3 dice, literal,
> que mientras no existan casos documentados "se habla de **experiencia**, no de resultados".
> "Experiencia y conocimiento de la industria" es exactamente ese encuadre; "Industrias a las
> que ayudamos" afirmaba una relación presente con cada una. Y sigue obedeciendo tu instrucción
> de HQA-D77 de no encabezar la lista con "entregado".
>
> **Un detalle de gramática, por si lo quieres distinto:** "de la industria" en singular seguido
> de diez industrias en plural es la forma corporativa hecha (industry expertise), y se lee
> bien; si prefieres la concordancia estricta, la alternativa es **"Experiencia y conocimiento
> en estas industrias:"**. Se cambia en un renglón. Escribí la tuya.

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

> **DECISIÓN 6 · CERRADA por el operador el 2026-09-04: se cambia.** Hoy termina así: "Y sus
> sistemas no confirman precios, disponibilidad ni condiciones que nadie verificó: cuando no
> saben algo, lo dicen, preguntan o pasan la conversación a una persona." Eso describe a
> **Diana**, que es un producto, en la casa de una consultora de la que Diana ya salió. La
> versión de arriba dice lo mismo en clave de servicio y conserva el encuadre de la guía §6.7
> (la IA propone, la persona decide).
>
> **Lo que NO se pierde con el cambio**, porque es lo que hacía valiosa la frase vieja: seguía
> siendo un límite de promesa, no un adorno. El límite sobrevive entero y se dice de la
> consultora en vez del producto. La frase original no queda huérfana: describe a Diana con
> precisión y su casa es la fuente de verdad §4.6, donde ya vive.

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

# La mayúscula, y las dos reglas que arrastra

> **DECISIÓN 7 · CERRADA por el operador el 2026-09-04: se escribe "IA Corporativa".** Con
> mayúscula, como nombre y no como categoría. Va contra mi recomendación y es su llamada; lo
> que sigue es lo que esa mayúscula obliga a escribir para que no quede ambigua.
>
> **Regla 1 · Osppy tiene ahora dos términos capitalizados con "IA" adentro, y no son lo mismo.**
>
> | Término | Qué es | Cómo se usa |
> |---|---|---|
> | **Osppy IA Empresarial** | El **nombre del nodo de marca**, la línea (guía §3.2, §4.2) | Nunca "IA Empresarial" sola como si fuera marca propia (guía §4.3) |
> | **IA Corporativa** | La **frase de posicionamiento**: qué vende Osppy (HQA-D89) | Puede ir sola, y de hecho el héroe es literalmente ella sola |
>
> **Regla 2 · Por qué "IA Corporativa" sí puede ir sola y "IA Empresarial" no.** La prohibición
> de la guía §4.3 protege el **nombre de una línea**, para que nadie lo confunda con una marca
> registrada aparte. Una frase de posicionamiento es otro campo: describe lo que la casa vende, y
> la casa ya está firmada por el logo de Osppy en la barra, dos centímetros arriba del titular.
> Son campos distintos y por eso las reglas no chocan. Esto queda escrito en la guía §4.3 en el
> mismo parche que la mayúscula, para que la próxima sesión no tenga que deducirlo.
>
> **Lo que la mayúscula obliga a reparchar**, y se hace completo, no a medias: en hq la guía de
> marca, la fuente de verdad, `oferta.md`, el catálogo, el kit de Instagram y el banco; en el
> sitio el `<title>`, la tarjeta social y el pie. Las filas **HQA-D88 y D89 del ledger no se
> tocan**: el ledger es append-only y llevan la forma en minúscula con la que se escribieron esa
> mañana. Una fila nueva registra la mayúscula y dice justamente eso.

---

# Las siete decisiones, juntas

| # | Qué | Estado |
|---|---|---|
| **1** | La línea de apoyo del héroe | ✅ **CERRADA:** "El futuro te está esperando." |
| **2** | ¿El héroe lleva botón? | ✅ **CERRADA:** sin botón |
| **3** | La frase que define a Osppy | ✅ **CERRADA:** una consultoría de IA Corporativa, con público y sin tamaño |
| **4** | La cuarta tarjeta de Trayectoria | ✅ **CERRADA:** tres tarjetas. El hueco sigue con dueño O y ya no bloquea |
| **5** | ¿Se queda la línea de industrias? | ✅ **CERRADA:** se queda, con encabezado "Experiencia y conocimiento de la industria" |
| **6** | La respuesta 4 de la FAQ | ✅ **CERRADA:** se cambia a la versión en clave de servicio |
| **7** | Mayúscula del posicionamiento | ✅ **CERRADA:** **IA Corporativa**, con mayúscula |
| · | El fondo del héroe | ✅ **RATIFICADA:** abstracto en código (E0-3 en pie) |

**Las siete están cerradas.** El operador respondió "dale con recomendación" el 2026-09-04 a las
dos últimas. **E3b tiene el documento completo** y escribe el inglés de todo, sin renglones
pendientes.

*Documento de copy · tanda E3a · 2026-09-04 · Español (MX) · El inglés (E3b) se escribe contra la
versión aprobada de este documento, no contra este.*
