# Copy de la casa, español — rebanada V4a (para aprobación)

> **2026-09-03.** Repo: `osppy-landing-ai-concierge`. Compuerta previa de V4b (inglés) y V4c
> (construcción de las secciones). Plan: `../../osppy-hq/prompts/2026-09-03-landing-v2-master-prompt.md`
> §5. **Esto es texto para leer y corregir, no código**: nada de aquí ha entrado a
> `messages/*.json` todavía, precisamente para que `npm run check` siga en verde mientras el
> inglés no exista (`check:parity` compara los dos árboles de llaves).
> **Cómo se lee:** cada sección trae su anillo (WHY · HOW · WHAT), su llave de mensaje y el
> texto exacto. Tachar, reescribir encima o decir «esta sección sobra» es la forma de aprobarla.

## Las reglas que este copy obedece

| Regla | Fuente | Cómo se ve aquí |
|---|---|---|
| Público: **empresas medianas y grandes** con equipos de oficina por área | HQA-D37; fuente de verdad §2, §3.1 | Nunca «PyMEs» a secas; nunca «negocios de servicio» como sujeto de la casa |
| Espina **WHY → HOW → WHAT** | HQA-D39 (supera D26) | Primero el sentimiento, luego el método, al final el catálogo |
| **Cero cifras** fuera de las atestiguadas | HQA-D30; `check-copy.mjs` | Solo +100, +50, 3, 9, 2 y 24/7, con su nota; «ocho áreas» va con letra |
| Áreas e industrias son **ejemplos**, no giros atendidos; todas «Se ofrece» | HQA-D44, D45; fuente de verdad §11.12 | La sección 7 lo dice en voz alta en vez de esconderlo |
| Precio: **estructura, ninguna cifra** | HQA-D43; `business/pricing.md` §6 | La sección 9 es literalmente §6 |
| Sin ahorros, horas ni reemplazo | guía §5.8, §6.7; banco de prohibidas | Ninguna sección promete un número de impacto |
| Voces ilustrativas con **una** línea de divulgación | HQA-D40 | Sección 12 |
| Tú en todo el sitio | HQA-D35 | Todo el documento |
| Máximo seis giros por pieza general | guía §7.4; HQA-D32 | Los seis van una sola vez, en la sección 10 |
| Jerga solo con el concepto en claro delante | guía §6.6; banco §3 | Un solo aviso esperado, declarado en la sección 5 |

**Dos llaves no se pueden renombrar**, porque las pruebas viven de ellas:
`home.hero.headline` y `home.cta.button`.

---

# WHY — el porqué

## 1 · Héroe · `home.hero.*`

| Llave | Texto |
|---|---|
| `kicker` | IA aplicada para empresas |
| `headline` | **Tu empresa ya sabe que necesita IA. Lo que casi nadie te dice es dónde.** |
| `sub` | Osppy pone la inteligencia artificial a hacer trabajo dentro de la operación —una tarea concreta, un proceso escrito, una persona que revisa— en empresas medianas y grandes con equipos de oficina completos. |
| `cta` | Descubre dónde te sirve |
| `ctaSecundario` | Ver las áreas |
| `ctaMessage` | Hola, quiero platicar sobre la operación de mi empresa. |

El diagrama del héroe (tarea → proceso → agente → resultado) **no cambia**: `home.hero.diagrama.*`
se queda tal cual, incluido el pie «El paso que casi nadie tiene escrito es el segundo.»

> **Nota de implementación (V4c).** El CTA apunta a `/diagnostico`, que nace en V5. Hasta
> entonces apunta a `#areas` — un botón que va a un 404 es peor que un botón modesto.

## 2 · El silencio · `home.porque.*`

| Llave | Texto |
|---|---|
| `kicker` | Por qué |
| `headline` | **“Sabemos que necesitamos IA.” Y después, silencio.** |
| `p1` | La frase se dice en juntas de dirección todo el tiempo. La que casi nunca sigue es la segunda: en qué área, con qué tarea, con qué reglas y quién revisa el resultado. |
| `p2` | Sin esa segunda frase pasan dos cosas. O no se hace nada en todo un año. O se compra una herramienta que nadie termina de usar, porque el proceso que iba a ordenar nunca estuvo escrito. |
| `p3` | Nuestro trabajo empieza justo ahí: en convertir “necesitamos IA” en una tarea concreta de un área concreta. |
| `cierre` | A veces la respuesta es: todavía no. Y también te lo decimos. |

## 3 · Lo que creemos · `home.creemos.*`

| Llave | Texto |
|---|---|
| `kicker` | Lo que creemos |
| `headline` | **La IA vale la pena cuando hace una tarea completa, con reglas escritas, y alguien la revisa.** |
| `c1Titulo` | Una tarea completa, no un pedazo |
| `c1Body` | Media tarea automatizada deja a una persona terminándola a mano y revisando el doble. Si no se puede hacer completa, todavía no toca. |
| `c2Titulo` | Reglas escritas antes que código |
| `c2Body` | El sistema hace lo que dice el proceso. Si el proceso vive en la cabeza de una persona, lo primero que entregamos es el proceso — no el sistema. |
| `c3Titulo` | Una persona revisa y decide |
| `c3Body` | Estas herramientas se equivocan y a veces inventan. Por eso todo se arma para que alguien pueda revisar: la IA propone, la persona decide. |
| `nota` | La tecnología puede quitar tareas repetitivas; las decisiones, la atención importante y la responsabilidad siguen siendo de las personas. |

*(`c3Body` y `nota` son los encuadres obligatorios de la guía §6.7, casi textuales.)*

---

# HOW — el cómo

## 4 · El método · `home.como.*` — **sin cambios de texto**

Kicker «Cómo trabajamos», titular «Primero entender. Construir es el último paso.» y los
cuatro pasos —Diagnóstico · El proceso, por escrito · Construcción · Operación— se quedan
exactamente como están hoy. Es el copy que mejor aguantó la revisión. Lo que cambia es la
forma: pasa a ser el capítulo fijado (§3 del plan), con el diagrama avanzando por paso.

## 5 · Sin jerga · `home.jerga.*` — **ELIMINADA el 2026-09-03 (tanda C, C2)**

> **Baja completa, con sus tarjetas giratorias.** El operador, después de ver la casa
> construida: *«las tarjetas giratorias de ingeniería en la nube etc, estan horribles el texto
> no se deberia poder leer al reverso, no se alcanza a leer bien»* y *«"sin jerga" esta
> horrible, quitalo»*. Se borró la sección entera (`components/home/Jerga.tsx`, `home.jerga.*`
> en los dos idiomas) y **no se sustituye por otra tarjeta que gire**. La tabla de traducción
> de la guía §7.1 sigue existiendo como **regla de redacción** —el concepto en claro antes que
> el término técnico— y deja de ser una sección de la casa. Con ella se va también el aviso
> declarado de `LLMOps`: `check-copy` ya no lo levanta porque el texto ya no existe.

## 6 · Cómo se ve · `home.seve.*`

| Llave | Texto |
|---|---|
| `kicker` | Cómo se ve |
| `headline` | **Así se ve un sistema trabajando dentro de una empresa.** |
| `body` | Dos ejemplos, armados con datos de demostración. No son capturas de ningún cliente. |
| `d1Titulo` | Una cotización que se arma sola |
| `d1Body` | El sistema toma la solicitud, aplica las reglas de precio que ya usa tu equipo y arma el documento. Una persona lo revisa antes de que salga. |
| `d2Titulo` | Un asistente que conoce tus documentos |
| `d2Body` | Contesta con la información que la empresa cargó. Si algo no está, lo dice o pregunta — no lo inventa. |
| `etiqueta` | Datos de demostración |

---

# WHAT — el qué

## 7 · Dónde entra · `home.areas.*` — **dieciséis áreas y sin insignia (tanda C, C4)**

| Llave | Texto |
|---|---|
| `kicker` | Dónde |
| `headline` | **Dónde entra primero: el área, y la tarea con la que se empieza.** |
| `body` | La IA no entra “en la empresa”. Entra en un área, con una tarea. Estas son las dieciséis donde más seguido empieza la conversación, cada una con un ejemplo de por dónde. |
| `nota` | Ninguna lista es la tuya. Si tu operación tiene un área que no está aquí, es la primera de la que queremos oír. |
| `cardCta` | Ver si aplica en tu caso |

| # | Área | Tarea de ejemplo |
|---|---|---|
| 1 | Contabilidad | Clasificar y conciliar movimientos contra los documentos que los respaldan. |
| 2 | Compras | Armar la orden de compra desde la requisición y darle seguimiento al proveedor. |
| 3 | Ventas y cotizaciones | Armar la cotización con las reglas de precio que ya usa el equipo. |
| 4 | Facturación y cobranza | Emitir, mandar y dar seguimiento a lo que está por cobrarse. |
| 5 | Recursos humanos | Contestar las preguntas que el personal hace todas las semanas y mantener el expediente en orden. |
| 6 | Nómina | Cuadrar las incidencias del periodo contra el registro de asistencia y dejar marcadas las excepciones. |
| 7 | Marketing | Preparar y adaptar materiales con la información y el tono que la empresa ya definió. |
| 8 | Comercio exterior | Armar el expediente electrónico de una importación y dejarlo ordenado para cuando toque una auditoría. |
| 9 | Operaciones y producción | Armar el reporte de turno con lo que se registró en el piso, para que el supervisor lo revise en vez de escribirlo. |
| 10 | Logística y almacén | Cruzar cada embarque contra su orden y su remisión, y marcar lo que no cuadra antes de que salga. |
| 11 | Calidad | Armar el reporte de no conformidad desde la evidencia y dejarlo listo para que alguien lo firme. |
| 12 | Mantenimiento | Abrir la orden de trabajo con el historial del equipo ya adentro, en vez de en blanco. |
| 13 | Sistemas y TI | Clasificar el ticket que entra y adjuntarle lo que ya se intentó, para que nadie empiece de cero. |
| 14 | Servicio al cliente | Redactar la respuesta con la información real del pedido, y que una persona la revise antes de enviarla. |
| 15 | Legal y cumplimiento | Comparar el contrato contra tu machote y señalar lo que se salió de la línea. |
| 16 | Dirección | Reunir en un solo lugar lo que hoy está en cinco reportes distintos. |

> **Ocho más, y la insignia se va.** Operador, 2026-09-03 (HQA-D64, supera HQA-D44): *«las 8,
> mas aparte todas las de piso y sistemas, operaciones y produccion, logistica y almacen,
> calidad, mantenimiento, sistemas y TI, servicio al cliente, nomina, legal y cumplimiento, y
> no tienes que poner que se ofrecen, implícitamente decimos que ya las hacemos, por eso estan
> en la pagina»*. La segunda mitad es un **atestiguamiento**, no una preferencia de diseño: por
> eso las dieciséis quedan `hecho` en `data/areas.json` con la fila del ledger como `fuente`
> —que es lo que `check-copy.mjs` exige y sin lo cual falla— y la insignia desaparece de la
> pantalla, no del dato. Las áreas de piso faltaban justo porque los giros que atestiguó ese
> mismo día (manufactura, transporte, automotriz, infraestructura) tienen operaciones, calidad
> y mantenimiento, y la casa no las nombraba.

> **Nota de implementación (tanda C).** Deja de ser una rejilla de tarjetas iguales: a ocho era
> una rejilla, a dieciséis es tapiz. Ahora es una **lista tipográfica** de dieciséis nombres y
> **un solo marco** a la derecha que toma la foto y la tarea del renglón en el que va el
> lector. Debajo de `lg`, y con movimiento reducido, los mismos dieciséis son un acordeón. Cada
> fila lleva su `foto` (ver `lib/photos.generated.ts`) además de `estado` y `fuente`. El área
> sigue siendo la pista de entrada del diagnóstico (`/diagnostico?area=`).

## 8 · Tres maneras de entrar · `home.hacemos.*` — **capacitación pasa a ✅ (tanda C, C3)**

Se conserva completo: Capacitación (Próximos grupos) · Asesoría (Disponible hoy) ·
Implementación (Disponible hoy), con sus fichas, sus cuatro preguntas de diagnóstico y sus
seis tipos de construcción. **Un solo cambio de texto**, en el titular:

| Llave | Antes | Ahora |
|---|---|---|
| `headline` | Tres maneras de entrar a tu operación. | **Tres maneras de entrar a tu operación. Empieza por la que te quede.** |

> **Tres cambios de la tanda C, todos por respuesta del operador del 2026-09-03.**
> **(1) Capacitación deja de decir «Próximos grupos» y dice «Disponible hoy»**, con la misma
> píldora de acento que asesoría e implementación: *«Ya se imparte»* (HQA-D61). La ficha de
> estado deja de decir «los primeros grupos están por abrirse» y dice que se contrata y se
> agenda como las otras dos. **La cifra —más de diez sesiones— NO se publica**: *«no hay que
> mencionar esto, solo que ya lo hacemos»*. Y las fichas numeradas del catálogo conservan su
> propia marca, porque el operador dijo cuántas sesiones, no cuáles fichas.
> **(2) La lista de «Lo que se ha construido» se alinea con la de la sección 10.** Tenía seis
> y la otra pasó a diez: dos listas de lo mismo en una página, diciendo cosas distintas, es un
> defecto, no una variante. Ahora son las mismas nueve entradas de implementación (las «sesiones
> de asesoría» viven en su propia tarjeta y no se repiten aquí).
> **(3) Implementación afirma la conexión con ERP y facturación**, en genérico y sin nombrar
> marcas (HQA-D59); nombrar un sistema concreto sigue exigiendo una instancia entregada, y la
> pregunta 7 de la sección 13 dice lo mismo con más detalle.

## 9 · Cuánto cuesta · `home.cuanto.*`

| Llave | Texto |
|---|---|
| `kicker` | Cuánto |
| `headline` | **Sin paquetes. Cada propuesta, sobre tu caso.** |
| `body` | No publicamos precios porque no vendemos paquetes. Esto es lo que sí te podemos decir antes de hablar: |
| `p1` | La capacitación se cotiza por grupo y por resultado, nunca por hora. |
| `p2` | La asesoría y la implementación se cotizan por separado, cada una con alcance y criterios de éxito por escrito. |
| `p3` | Lo que queda entregado puede seguir bajo un plan de operación: hosting, monitoreo y mantenimiento. |
| `cierre` | Las cifras, en la primera conversación. |
| `nota` | Y algo que no vas a leer aquí: un número de impacto. Ese sale de tus datos, no de nuestra propuesta. |

*(Los tres puntos y el cierre son `business/pricing.md` §6 palabra por palabra. Si algún día
hay rangos, se escriben primero ahí y después aquí — HQA-D43.)*

## 10 · Trayectoria · `home.trayectoria.*` y `home.casos.*` — **cuatro cifras, diez tipos, diez industrias (tanda C, C5)**

| Llave | Texto |
|---|---|
| `trayectoria.kicker` | Trayectoria |
| `trayectoria.headline` | **Lo que ya se hizo, sin nombres.** |
| `trayectoria.body` | Aquí no se nombra a ningún cliente sin permiso por escrito, y no se publica ninguna cifra medida por nosotros. Lo que sí se puede contar: cuánto, de qué tipo y en qué giros. |

**Cuatro contadores, no seis:** **+100** empresas asesoradas · **+50** soluciones construidas
para empresas · **+10** giros atendidos · **24/7** atención del asistente. Se queda la línea de
agentes autónomos. **La nota de estimación se va, y no por estética.**

> **Las tres decisiones del operador detrás de esos cuatro números (2026-09-03).**
> **(1)** *«+50 se queda y +20 no entra, 2 se va»* — «+20 soluciones implementadas» habría
> quedado junto a «+50» diciendo casi lo mismo con otro número, y «2 productos en producción»
> era el mosaico que pidió cambiar. **(2)** Con cinco mosaicos y un hueco, eligió **cuatro más
> grandes**: se cae también «3 líneas de trabajo», que es taxonomía, no trayectoria.
> **(3)** Preguntado si la nota de estimación salía porque las cifras son firmes o solo porque
> estorbaba: *«firmas las sostengo, no neesitas escribir cifras sosetenidas por operador, solo
> las cifras y ya, ninguna frase ni disclaimer»*. Cambia su **estatus** en la fuente de verdad
> §11.11, no nada más el sitio (HQA-D60). El «+10» entra a `scripts/copy-allow.json` con su
> fuente; la lista blanca global del verificador **perdió 3, 9 y 2** junto con los mosaicos que
> los usaban.

**Diez tipos de trabajo, en el orden que dictó el operador** (`home.casos.t1`–`t10`): Adopción
de Claude Enterprise · Sesiones de asesoría · Agentes de IA · Modelos en tu infraestructura ·
Estructuración de procesos · **Automatización de procesos** · Asistentes de IA · Cotizadores ·
**Plantillas con los membretes de tu empresa** · **Sistema para manejar auditorías**. Los tres
en negrita son nuevos y **los tres están atestiguados** (2026-09-03, «Los tres, entregados»,
HQA-D62): ninguno aparecía en el repo antes de esa respuesta, que es exactamente por qué se
preguntó en vez de suponerse.

La línea de industrias cierra la sección, **una sola vez en toda la página**:

| Llave | Texto |
|---|---|
| `casos.giros` | Industrias a las que ayudamos: tecnología y software, manufactura, electrónica, logística y transporte, construcción e infraestructura, comercio exterior, agricultura, farmacéutica, energética e inmobiliaria. |

> **Por qué son diez y por qué no dicen «entregado».** Operador, 2026-09-03 (HQA-D65, supera
> HQA-D32): *«quiero que sean 10, agrega inmobiliaria, todas entregadas pero NO MENCIONES
> ENTREAGDO, mejor algo asi como industrias a las que ayudamos y ya la lista algo asi, no
> necesitamos poner entregado ni disponible»*. Tres cosas a la vez: el tope de la guía §7.4
> **sube de seis a diez**, la coletilla *«…y cualquier industria con una operación que se pueda
> describir»* **se va** —él llamó vaga a la línea entera— y el encabezado es **más suave que la
> verdad que lo respalda**, que es el sentido correcto y nunca el contrario. Cinco de los diez
> (electrónica, agricultura, farmacéutica, energética, inmobiliaria) se atestiguaron en esa
> misma respuesta: dos estaban en «Se ofrece» y tres no existían en el repo.

> **Baja anterior, que sigue en pie.** La sección «A quién ayudamos» (`home.ayudamos.*`)
> desapareció en V4. Su frase de casa se conservaba pegada a la línea de giros; **la tanda C
> la retira** con la coletilla.

## 11 · Productos · `home.productos.*`

| Llave | Texto |
|---|---|
| `kicker` | Productos |
| `headline` | **También construimos productos.** |
| `body` | Además de trabajar dentro de la operación de otras empresas, Osppy construye producto propio: un mismo asistente por WhatsApp, un giro a la vez. |
| `hoteles.nombre` | Diana Hoteles |
| `hoteles.estado` | En producción |
| `hoteles.body` | Diana responde a los huéspedes por WhatsApp con la información del hotel, y el equipo ve todo y opera desde un panel. Opera hoy en hoteles en producción. |
| `hoteles.cta` | Conoce el producto |
| `citas.nombre` | Diana Citas |
| `citas.estado` | En construcción |
| `citas.body` | Diana, para negocios que viven de citas: clínicas, consultorios, spas. Está en construcción, sin fecha comprometida; buscamos clínicas fundadoras. |
| `citas.cta` | Quiero ser clínica fundadora |

*(«Próximamente» pasa a «En construcción»: es la marca 🚧 dicha como es. «Próximamente» sugiere
una fecha que no existe.)*

---

## 12 · Voces · `home.voces.*` — **rediseñada con descargo discreto (tanda C, C6)**

| Llave | Texto |
|---|---|
| `kicker` | Voces |
| `headline` | **Cómo se siente tener un sistema trabajando.** |
| `divulgacion` | Voces ilustrativas — no son testimonios verificados. |
| `q1` | Lo que cambió no fue la herramienta. Fue que por fin escribimos cómo se hace una cotización — y entonces sí se pudo automatizar. |
| `q2` | Pensé que iba a ser otro chatbot. Es un paso del proceso que ya nadie hace a mano. |
| `q3` | Nos dijeron que en un área todavía no convenía. Esa conversación fue la que nos hizo confiar. |

> **La petición que no se ejecutó, y la que sí.** El operador escribió: *«en la pagina de
> hoteles y en todos lados quita lo de ilustrativo y haz como si las resenas fueran reales»*.
> La segunda mitad **no se hizo**: las seis citas —tres aquí y tres en `/hoteles`— las escribió
> una sesión anterior, y presentarlas como testimonios de clientes es fabricar reseñas
> (LFPC art. 32 / PROFECO; fuente de verdad §1 regla 2, §9, §10; guía §5.7, §7.3). Se le
> ofrecieron tres caminos y eligió el **rediseño con descargo discreto** (HQA-D63, sostiene
> HQA-D40).
>
> **Qué cambió:** se va la etiqueta «Ilustrativo» por tarjeta (aquí no había; en `/hoteles`
> sí), el párrafo largo se vuelve **una línea del tamaño de un pie de foto**, las citas se
> acortan y van en **cursiva entre comillas inglesas** —nunca angulares, que el operador
> rechazó— y se retira el signo de apertura sobredimensionado, que era la misma decoración,
> más grande. `/hoteles` recibe el mismo tratamiento y un titular propio, porque el suyo
> repetía el descargo.
>
> **`[EVIDENCIA]`, y es la salida más barata:** tres citas **reales anonimizadas** —frases que
> un cliente haya dicho, aunque el operador las parafrasee— **no necesitan permiso escrito y no
> llevan descargo**, porque no afirman nada falso. Esa puerta queda abierta.

## 13 · Preguntas · `home.faq.*`

| Llave | Texto |
|---|---|
| `kicker` | Preguntas |
| `headline` | **Lo que normalmente nos preguntan.** |
| `q1` | ¿Esto funciona en una empresa con muchas áreas? |
| `a1` | Sí, y de hecho es donde más rinde — pero no se entra por todas a la vez. Se empieza por un área y una tarea, se deja funcionando, y esa se vuelve el ejemplo con el que el resto de la empresa entiende de qué se trata. |
| `q2` | ¿Por dónde se empieza? |
| `a2` | Casi siempre con un diagnóstico: entender tu operación e identificar dónde la IA ayuda de verdad. Lo que sigue depende de lo que aparezca: capacitar, ordenar un proceso o construir un sistema. |
| `q3` | ¿Y si mis procesos no están escritos en ningún lado? |
| `a3` | Es lo más común. Estructurar el proceso es parte del trabajo — y va antes que cualquier automatización. No construimos agentes sin procesos bien definidos. |
| `q4` | ¿Qué no hace Osppy? |
| `a4` | No promete ahorros, ventas ni horas: eso lo miden tus números. No entrega una herramienta y se va. Y sus sistemas no confirman precios, disponibilidad ni condiciones que nadie verificó: cuando no saben algo, lo dicen, preguntan o pasan la conversación a una persona. |
| `q5` | ¿Qué pasa con la información de mi empresa? |
| `a5` | Se define por escrito qué información puede usarse, qué se anonimiza y qué se queda fuera. Y las herramientas de IA se equivocan a veces: por eso todo se arma para que una persona pueda revisar y decidir. |
| `q6` | ¿Cómo se cotiza? |
| `a6` | La capacitación y la asesoría se cotizan por grupo y por resultado; la implementación, por separado, con alcance y criterios de éxito por escrito. No publicamos precios porque no vendemos paquetes: cada propuesta es sobre tu caso. |
| `q7` | ¿Se conecta con mis sistemas? |
| `a7` | Sí: se conectan con el ERP y el sistema de facturación que ya usas. Con cuáles exactamente y hasta dónde llega la conexión se define en el diagnóstico, con nombre y apellido, antes de que aparezca en una propuesta — no prometemos una integración que no hayamos revisado contra tu sistema. |

*(`a2` a `a6` son las respuestas de hoy, intactas. `a1` y `a7` son nuevas y son las dos que el
público de empresa pregunta primero.)*

## 14 · El siguiente paso · `home.cta.*`

| Llave | Texto |
|---|---|
| `kicker` | El siguiente paso |
| `headline` | **Cuéntanos con qué área quieres empezar.** |
| `body` | Nos escribes, te contesta una persona, y vemos si hay algo que valga la pena hacer. A veces la respuesta honesta es “todavía no” — también te la vamos a dar. |
| `button` | Escríbenos |
| `ctaMessage` | Hola, quiero platicar sobre la operación de mi empresa. El área por la que quiero empezar es… |
| `mailLabel` | hello@osppy.com |
| `microcopy` | Sin formularios: te contesta una persona. |

---

## Lo que cambia respecto de la casa de hoy

| | Hoy | V4 |
|---|---|---|
| Secciones | 11 | 14 en V4; **13 desde la tanda C** (baja «Sin jerga») |
| Orden | identidad → servicios → giros → método | WHY → HOW → WHAT |
| Sujeto | «empresas de cualquier tamaño — también PyMEs» | empresas medianas y grandes con equipos por área |
| Nuevas | — | El silencio (2) · Lo que creemos (3) · ~~Sin jerga (5)~~ · Cómo se ve (6) · **Dónde entra: las ocho áreas** (7) · Cuánto cuesta (9) |
| Bajas | «Quiénes somos» y «A quién ayudamos» | su contenido se reparte entre el héroe, la 3 y la 10; **«Sin jerga» se dio de baja el 2026-09-03 (C2)** |
| Conservado palabra por palabra | — | el método (4), las tres maneras (8), los contadores y los siete tipos de trabajo (10), cinco de las siete preguntas (13) |

## Lo que hace falta antes de V4c

1. **Tu visto bueno a este texto**, sección por sección o completo.
2. Nada más. El copy no depende de ninguna otra respuesta pendiente: el precio va como
   estructura (HQA-D43), las áreas van todas «Se ofrece» (HQA-D44) y las integraciones se
   contestan sin prometer (pregunta 7).

## Lo que sigue después

- **V4b** — el inglés, con paridad de llaves. Los dos idiomas entran a `messages/*.json` en el
  mismo commit, para que `check:parity` nunca vea un árbol a medias.
- **V4c** — las catorce secciones construidas con las primitivas de V3, `data/areas.json`, la
  navegación nueva (Inicio · Áreas · Industrias · Diagnóstico · Diana) y la compuerta de
  capturas.

*Documento interno · 2026-09-03 · Si algo aquí no te suena a Osppy, es porque todavía no lo es:
dilo y se reescribe antes de tocar una línea de código.*
