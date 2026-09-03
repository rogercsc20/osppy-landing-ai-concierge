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
| `headline` | **«Sabemos que necesitamos IA.» Y después, silencio.** |
| `p1` | La frase se dice en juntas de dirección todo el tiempo. La que casi nunca sigue es la segunda: en qué área, con qué tarea, con qué reglas y quién revisa el resultado. |
| `p2` | Sin esa segunda frase pasan dos cosas. O no se hace nada en todo un año. O se compra una herramienta que nadie termina de usar, porque el proceso que iba a ordenar nunca estuvo escrito. |
| `p3` | Nuestro trabajo empieza justo ahí: en convertir «necesitamos IA» en una tarea concreta de un área concreta. |
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

## 5 · Sin jerga · `home.jerga.*`

| Llave | Texto |
|---|---|
| `kicker` | Sin jerga |
| `headline` | **Lo técnico, dicho en lenguaje de operación.** |
| `body` | La credencial técnica existe y se puede revisar. Pero no es lo que te sirve a ti: esto es lo mismo, dicho en el idioma de tu operación. |

**En cada tarjeta la frase de operación va primero y grande; el término técnico va debajo, en
etiqueta chica.** No es un detalle de diseño: es la regla de «el concepto en claro va primero»
(guía §6.6). Escrito al revés, la sección sería justo la jerga que dice evitar.
| `t1Tecnico` | Ingeniería en la nube e infraestructura como código |
| `t1Operacion` | Operamos sistemas en la nube que trabajan hoy en negocios reales. |
| `t2Tecnico` | Desarrollo backend |
| `t2Operacion` | Construimos los sistemas por dentro, no solo los configuramos. |
| `t3Tecnico` | MLOps y LLMOps |
| `t3Operacion` | Sabemos mantener sistemas de IA funcionando en producción, no solo hacer demostraciones. |
| `t4Tecnico` | IA aplicada, sistemas en producción |
| `t4Operacion` | Nuestra IA trabaja hoy en negocios reales. |
| `t5Tecnico` | Diseño de sistemas e integración de procesos |
| `t5Operacion` | Conectamos la tecnología con la forma real en que trabaja tu equipo. |
| `t6Tecnico` | Haber sido dueño y operador de negocios |
| `t6Operacion` | Hemos estado del otro lado del mostrador: nómina, proveedores, ventas, clientes. |

*(Las seis filas son la tabla de traducción de la guía §7.1, sin agregar ninguna.)*

> **Un aviso nuevo del verificador, a propósito.** `t3Tecnico` dice «LLMOps», y «llm» está en el
> banco como jerga: `check-copy.mjs` va a levantar un AVISO ahí. Es el único lugar del sitio
> donde el término técnico **es** el contenido, y va después de su traducción, que es lo que la
> regla pide. Queda declarado aquí para que nadie lo lea como un descuido. Si prefieres que
> desaparezca, la fila se queda solo con «MLOps» y el aviso se va.

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

## 7 · Dónde entra · `home.areas.*`

| Llave | Texto |
|---|---|
| `kicker` | Dónde |
| `headline` | **Dónde entra primero: el área, y la tarea con la que se empieza.** |
| `body` | La IA no entra «en la empresa». Entra en un área, con una tarea. Estas son las ocho donde más seguido empieza la conversación, con un ejemplo de por dónde. |
| `insignia` | Se ofrece |
| `nota` | «Se ofrece» quiere decir exactamente eso: lo podemos construir para tu operación. El día que un área tenga trabajo entregado que podamos contar, la vas a ver marcada distinto — no antes. |
| `cardCta` | Ver si aplica en tu caso |

| # | Área | Tarea de ejemplo | Insignia |
|---|---|---|---|
| 1 | Contabilidad | Clasificar y conciliar movimientos contra los documentos que los respaldan. | Se ofrece |
| 2 | Compras | Armar la orden de compra desde la requisición y darle seguimiento al proveedor. | Se ofrece |
| 3 | Ventas y cotizaciones | Armar la cotización con las reglas de precio que ya usa el equipo. | Se ofrece |
| 4 | Facturación y cobranza | Emitir, mandar y dar seguimiento a lo que está por cobrarse. | Se ofrece |
| 5 | Recursos humanos | Contestar las preguntas que el personal hace todas las semanas y mantener el expediente en orden. | Se ofrece |
| 6 | Marketing | Preparar y adaptar materiales con la información y el tono que la empresa ya definió. | Se ofrece |
| 7 | Comercio exterior | Armar el expediente electrónico de una importación y dejarlo ordenado para cuando toque una auditoría. | Se ofrece |
| 8 | Dirección | Reunir en un solo lugar lo que hoy está en cinco reportes distintos. | Se ofrece |

> **Por qué las ocho dicen lo mismo.** Es la respuesta del operador del 2026-09-03 (HQA-D44):
> *«Todas "Se ofrece" por ahora»*. En el repo no hay nada que atestigüe trabajo entregado **por
> área** — los nueve giros del §11.10 son industrias, no áreas. Cuando atestigües un área con
> fecha, sube su fila en la fuente de verdad §11.12 y el sitio la refleja sin tocar código.

> **Nota de implementación (V4c).** Las ocho filas viven en `data/areas.json`, con `estado` y
> `fuente`; `check-copy.mjs` **falla** si una dice «hecho» sin citar una fila del ledger o el
> §11.12. El área es también la pista de entrada del diagnóstico (`/diagnostico?area=`).

## 8 · Tres maneras de entrar · `home.hacemos.*` — **casi sin cambios**

Se conserva completo: Capacitación (Próximos grupos) · Asesoría (Disponible hoy) ·
Implementación (Disponible hoy), con sus fichas, sus cuatro preguntas de diagnóstico y sus
seis tipos de construcción. **Un solo cambio de texto**, en el titular:

| Llave | Antes | Ahora |
|---|---|---|
| `headline` | Tres maneras de entrar a tu operación. | **Tres maneras de entrar a tu operación. Empieza por la que te quede.** |

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

## 10 · Trayectoria · `home.trayectoria.*` y `home.casos.*` — **fusionadas, sin cifras nuevas**

| Llave | Texto |
|---|---|
| `trayectoria.kicker` | Trayectoria |
| `trayectoria.headline` | **Lo que ya se hizo, sin nombres.** |
| `trayectoria.body` | Aquí no se nombra a ningún cliente sin permiso por escrito, y no se publica ninguna cifra medida por nosotros. Lo que sí se puede contar: cuánto, de qué tipo y en qué giros. |

Los seis contadores se quedan idénticos —**+100** empresas asesoradas · **+50** soluciones
construidas para empresas · **3** líneas de trabajo · **9** giros atendidos · **2** productos en
producción · **24/7** atención del asistente— con su línea de agentes autónomos y su nota
íntegra: *«+100» y «+50» son estimación del operador al 2026-09-02; no hay registro contable de
esa etapa.*

Los siete tipos de trabajo (`home.casos.t1`–`t7`) se conservan palabra por palabra:
Cotizadores · Agentes de IA · Asistentes de IA · Adopción de Claude Enterprise · Modelos en tu
infraestructura · Estructuración de procesos · Sesiones de asesoría.

La línea de giros cierra la sección, **una sola vez en toda la página**:

| Llave | Texto |
|---|---|
| `casos.giros` | Entregado en giros como construcción, logística, mueblerías, retail, escuelas privadas y negocios en línea. |

> **Baja.** La sección «A quién ayudamos» (`home.ayudamos.*`) desaparece: repetía los mismos
> seis giros y su cuerpo decía «también PyMEs», que HQA-D37 retira del sitio. Su frase de casa
> —«…y cualquier industria con una operación que se pueda describir»— se conserva pegada a la
> línea de giros de arriba.

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

## 12 · Voces · `home.voces.*`

| Llave | Texto |
|---|---|
| `kicker` | Voces |
| `headline` | **Cómo se siente tener un sistema trabajando.** |
| `divulgacion` | Voces ilustrativas de quienes operan con un asistente así. No son testimonios verificados. |
| `q1` | Lo que cambió no fue la herramienta. Fue que por fin escribimos cómo se hace una cotización — y entonces sí se pudo automatizar. |
| `q2` | Pensé que iba a ser otro chatbot. Es un paso del proceso que ya nadie hace a mano, y alguien lo revisa antes de que salga. |
| `q3` | Nos dijeron que en un área todavía no convenía. Esa conversación fue la que nos hizo confiar. |

> **Lo que hay que saber de esta sección, dicho una vez.** Las tres citas están escritas por
> nosotros: **no son testimonios y no se presentan como tales** (HQA-D40; fuente de verdad §1
> regla 2 y §9; LFPC art. 32). Por eso van sin nombre, sin empresa, sin estrellas y sin
> etiqueta por tarjeta: una sola línea de divulgación bajo el titular, integrada al diseño.
> Las tres anteriores hablaban de reservas de hotel y no le decían nada a este público; estas
> hablan de oficina. **`[EVIDENCIA]`**: se sustituyen por citas reales el día que haya permiso
> escrito (guía §5.7).

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
| `a7` | Se define en el diagnóstico. No prometemos integraciones que no existan: si tu ERP o tu sistema de facturación tiene por dónde conectarse, se revisa ahí —con nombre y apellido— antes de que aparezca en una propuesta. |

*(`a2` a `a6` son las respuestas de hoy, intactas. `a1` y `a7` son nuevas y son las dos que el
público de empresa pregunta primero.)*

## 14 · El siguiente paso · `home.cta.*`

| Llave | Texto |
|---|---|
| `kicker` | El siguiente paso |
| `headline` | **Cuéntanos con qué área quieres empezar.** |
| `body` | Nos escribes, te contesta una persona, y vemos si hay algo que valga la pena hacer. A veces la respuesta honesta es «todavía no» — también te la vamos a dar. |
| `button` | Escríbenos |
| `ctaMessage` | Hola, quiero platicar sobre la operación de mi empresa. El área por la que quiero empezar es… |
| `mailLabel` | hello@osppy.com |
| `microcopy` | Sin formularios: te contesta una persona. |

---

## Lo que cambia respecto de la casa de hoy

| | Hoy | V4 |
|---|---|---|
| Secciones | 11 | 14 |
| Orden | identidad → servicios → giros → método | WHY → HOW → WHAT |
| Sujeto | «empresas de cualquier tamaño — también PyMEs» | empresas medianas y grandes con equipos por área |
| Nuevas | — | El silencio (2) · Lo que creemos (3) · Sin jerga (5) · Cómo se ve (6) · **Dónde entra: las ocho áreas** (7) · Cuánto cuesta (9) |
| Bajas | «Quiénes somos» y «A quién ayudamos» | su contenido se reparte entre el héroe, la 3 y la 10 |
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
