# Copy de las tres páginas de servicio, español · tanda E5a (para aprobación)

> **2026-09-04.** Repo: `osppy-landing-ai-concierge`. Compuerta previa de E5b (inglés) y E5c
> (construcción). Plan: `../../osppy-hq/prompts/2026-09-03-landing-v4-consultora-master-prompt.md`
> §3.3 (mapa de reubicación) y §4.5 (el render de las tres páginas).
> **Esto es texto para leer y corregir, no código.** Nada de aquí ha entrado a `messages/*.json`:
> el árbol de llaves cambia de forma y aterrizarlo antes de recablear los componentes levanta
> `MISSING_MESSAGE`. La razón completa está en la primera página de
> `2026-09-04-copy-casa-v4-en.md` y vale igual aquí.
> **Cómo se lee:** cada bloque trae su llave y su texto exacto. Tachar, reescribir encima o
> decir "este bloque sobra" es la forma de aprobarlo. Los renglones marcados **DECISIÓN** son
> los que no puedo cerrar yo.
>
> **De dónde sale el texto.** Los renglones marcados **(mudado)** vienen palabra por palabra de
> `2026-09-04-copy-mudado-a-servicios.md`, el documento que E3c escribió al bajar 84 renglones de
> la casa. No se reescriben: se colocan. Los renglones marcados **(nuevo)** los escribió esta
> sesión contra las fuentes de la tabla de abajo. Los marcados **(reusado)** son llaves que hoy
> viven en la casa y que estas páginas vuelven a decir en su propio contexto.

## Las fuentes que este copy obedece, bloque por bloque

| Bloque | Fuente | Qué me deja decir |
|---|---|---|
| Estado de la línea | `oferta.md` §2 · fuente de verdad §3.1 | Las tres son ✅. Capacitación se imparte, se contrata y se agenda hoy |
| Estado de cada taller | catálogo §1.2 y §4 | **Ninguna ficha va como ✅.** Hoy son 🚧 o 🔜, y su significado público está en la leyenda del §1.2 |
| Cuántas sesiones se han impartido | fuente de verdad §3.1 | **Nada.** "Ya lo hacemos", nunca cuántas veces (operador, 2026-09-03) |
| Tipos de trabajo entregado | fuente de verdad §11.10 y §11.12 | Los nueve tipos, en genérico, sin cliente y sin cantidad |
| Precio | `pricing.md` §6 · catálogo §11 | Estructura y ninguna cifra. Cierra con "Las cifras, en la primera conversación." |
| Integraciones | `oferta.md` §2 · catálogo §15 | El ERP y el sistema de facturación, en genérico. **Ninguna marca** |
| Límites de promesa | guía §5.8 | Sin resultados financieros, sin horas, sin reemplazo, sin fechas de lo no lanzado |
| Encuadres sensibles | guía §6.7 y §7.6 | La IA propone, la persona revisa y decide. Se practica con información ficticia o anonimizada |
| Público | HQA-D37, y la decisión 3 de la compuerta E3a | La segmentación por tamaño **no se dice en el sitio**, aunque siga vigente en hq |

**Reglas de forma, las mismas de la casa:** tú y no usted (HQA-D35) · sin raya larga en nada que
lea un cliente (HQA-D79) · sin guillemets (HQA-D59) · **IA Corporativa** con mayúscula y puede ir
sola, **Osppy IA Empresarial** nunca va solo (HQA-D97, guía §4.3) · "a la medida" prohibida en el
sitio, la idea se dice con la fórmula de la guía §5.8 · **cero cifras nuevas**: no hay una sola en
este documento, así que `copy-allow.json` no se toca en E5c.

## Lo que hace distinta a cada página

Tres páginas con el mismo esqueleto y distinto texto es la trampa que el plan v3 ya nombró. Estas
tres no comparten forma, y no por decoración: cada una carga un peso distinto.

| Página | Su bloque pesado | Su forma |
|---|---|---|
| `/capacitacion` | **Las rutas.** Es la única página con un catálogo adentro | Una lista con estados reales. Se recorre |
| `/asesoria` | **Lo que creemos.** Las tres convicciones son el corazón, no un adorno | Tres convicciones y tres salidas. Es un argumento |
| `/implementacion` | **Los agentes.** Abre con el diagrama que baja del héroe de la casa | Un diagrama, tres familias y tres fases. Es un inventario |

---
---

# `/capacitacion` · `servicios.capacitacion.*`

## 1 · Héroe

| Llave | Texto | Origen |
|---|---|---|
| `kicker` | Capacitación | reusado |
| `headline` | **Tu equipo sale sabiendo usar la IA en su propio trabajo.** | **DECISIÓN 1** |
| `body` | Talleres en vivo, por grupo, con las tareas que tu equipo ya hace. | nuevo |
| `cta` | Contacta un asesor | reusado |
| `ctaMessage` | Hola, quiero platicar sobre capacitación de IA para mi equipo. | reusado |
| `metaTitle` | Capacitación · Osppy | reusado |
| `metaDescription` | **Talleres prácticos de inteligencia artificial para dueños, gerentes y equipos, con tareas reales de tu operación.** | **DECISIÓN 2** |

> **DECISIÓN 1 · El titular del héroe.** Hoy la llave dice *"Tu equipo sale sabiendo usarla en su
> propio trabajo."* y la tarjeta de la casa dice *"Tu equipo sale sabiendo usar la IA en su propio
> trabajo."*
>
> **Recomendación: gana la versión de la casa**, la que dice "usar la IA". El "usarla" del héroe
> es un pronombre sin antecedente **en su propia página**: funcionaba en la casa, donde la tarjeta
> vive debajo de un titular que ya nombró la inteligencia artificial, y deja de funcionar aquí,
> donde es la primera línea que alguien lee al aterrizar. Además hace que el sitio diga la misma
> promesa con dos redacciones, y el clic de la casa lleva justo aquí.
>
> **Ninguna prueba se rompe con el cambio:** `smoke.spec.ts` lee el titular **del JSON**, no de un
> literal, así que sigue el valor a donde vaya.

> **DECISIÓN 2 · La descripción para buscadores.** Hoy dice *"para dueños, gerentes y equipos de
> **empresas medianas y grandes**"* y en inglés *"medium and large companies"*. La decisión 3 de la
> compuerta E3a sacó esa segmentación del sitio (operador, 2026-09-04: *"no menciones empresas
> medianas y grandes, simplemente para empresas, o corporaciones o algo así"*), y esas dos llaves
> se quedaron atrás porque E3a era el copy de la casa.
>
> **Recomendación: quitar la segmentación y no sustituirla por otra.** El renglón de arriba
> dice "para dueños, gerentes y equipos" y cierra con "de tu operación", que es la palabra que
> este sitio usa en todos lados. **HQA-D37 no se mueve:** a quién se le vende sigue definido en
> hq, y lo que cambia es que el sitio no lo dice en voz alta.
>
> **La misma corrección le toca al inglés en E5b**, y es la misma llave.

## 2 · Qué es · `servicios.capacitacion.queEs.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Qué es | nuevo |
| `p1` | Talleres en vivo y por grupo, con tareas reales de tu negocio. No se enseña inteligencia artificial en abstracto: se enseña a hacer una tarea del puesto de forma más rápida, más clara y más segura. | nuevo, catálogo §2 |
| `p2` | Primero enseñamos a usar bien las herramientas. Después vemos qué problemas se repiten, y solo entonces vale la pena hablar de dejar algo funcionando. | nuevo, catálogo §16 |

> **Nota de fuente, no decisión.** El §16 del catálogo dice ese mismo párrafo en primera persona y
> dirigido a *"dueños y equipos de PyMEs"*. Esa frase contradice a HQA-D37 desde el 2026-09-03, la
> bitácora de E1 ya la dejó anotada como hueco preexistente **con dueño O**, y aquí simplemente
> **no se copia el público**: el texto de arriba conserva el método y no repite la segmentación.

## 3 · Para quién · `servicios.capacitacion.paraQuien.*`

Tres objetos, no tres tarjetas (plan §4.5). Los tres perfiles y lo que cada uno necesita salen del
catálogo §3 palabra por palabra en su sustancia.

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Para quién | nuevo |
| `q1Titulo` | Dueños y dirección | nuevo, catálogo §3 |
| `q1Body` | Criterio para decidir dónde usar IA, qué comprar y qué no delegar. | nuevo, catálogo §3 |
| `q2Titulo` | Gerentes y mandos medios | nuevo, catálogo §3 |
| `q2Body` | Método para estandarizar, supervisar y sostener el uso dentro de su área. | nuevo, catálogo §3 |
| `q3Titulo` | Equipos de trabajo | nuevo, catálogo §3 |
| `q3Body` | Rutinas concretas para hacer mejor las tareas de todos los días. | nuevo, catálogo §3 |

## 4 · Las rutas · `servicios.capacitacion.rutas.*`

**Este es el bloque pesado de la página y el único del sitio que lleva un catálogo adentro.**

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Las rutas | nuevo |
| `intro` | Las rutas son paralelas, no una escalera. Cada quien entra por la suya. | nuevo, catálogo §4 |
| `r1Titulo` | Entrada | nuevo, catálogo §5 |
| `r1Body` | Una charla corta para dirección y un taller de arranque para todo el equipo, desde cero. | nuevo, catálogo §5 |
| `r1Estado` | Estamos terminando el material. | nuevo, catálogo §1.2 (🚧) |
| `r2Titulo` | Operativa | nuevo, catálogo §6 |
| `r2Body` | Talleres por área y por puesto: documentos, fotos y notas de voz; hojas de cálculo para ventas, cartera y operación; ventas y cotizaciones; atención a clientes; administración, facturación y cobranza; compras y proveedores; operaciones en campo; recursos humanos y conocimiento interno. | nuevo, catálogo §6 |
| `r2Estado` | Se prepara con tu operación al contratarlo. | nuevo, catálogo §1.2 (🔜) |
| `r3Titulo` | Dirección | nuevo, catálogo §7 |
| `r3Body` | Para quien decide y para quien sostiene el uso en su área: dónde conviene la IA y dónde no, cómo lograr que de verdad se use, uso seguro y política interna, y la formación de un responsable interno. | nuevo, catálogo §7 |
| `r3Estado` | Se prepara con tu operación al contratarlo. | nuevo, catálogo §1.2 (🔜) |
| `r4Titulo` | Avanzada | nuevo, catálogo §8 |
| `r4Body` | Para quien ya la usa todos los días: automatizar tareas repetitivas sin programar, y diseñar un asistente de conocimiento para su área. | nuevo, catálogo §8 |
| `r4Estado` | Se prepara con tu operación al contratarlo. | nuevo, catálogo §1.2 (🔜) |
| `continuosTitulo` | Y después del taller | nuevo, catálogo §9 |
| `continuosBody` | Una clínica mensual donde traes el trabajo que te quita tiempo, y un taller armado con los ejemplos de tu propia industria. | nuevo, catálogo §9 |
| `nota` | La capacitación se imparte, se contrata y se agenda hoy. Qué tan listo está el material cambia de un taller a otro, y te lo decimos antes de agendar, no después. | nuevo, `oferta.md` §2 |

> **Lo que el plan daba por cierto y no lo era, dicho en vez de acomodado.** El §4.5 dice
> *"RUTAS: del catálogo §1.2: charla, taller, ruta operativa, ruta de dirección, ruta avanzada,
> continua"*. **Dos cosas no cuadran al abrir el archivo.** (1) El §1.2 **no contiene ninguna
> ruta**: es la leyenda de estados, la tabla que dice qué significa ✅, 🚧 y 🔜 y qué puedes decirle
> a un cliente con cada una. Las rutas viven en el §4, que es lo que decía el prompt de traspaso y
> no el plan. (2) Esa lista de seis **mezcla dos niveles**: "charla" y "taller" son las dos fichas
> **dentro** de la ruta de entrada (E0 y E1), no rutas hermanas de las otras. El catálogo §4 dice
> **cuatro rutas** y las nombra: entrada, operativa, dirección y avanzada, con los programas
> continuos y sectoriales colgando debajo de las cuatro, no al lado. La tabla de arriba sigue al
> catálogo: cuatro rutas y un bloque de continuos aparte.

> **DECISIÓN 3 · Cómo se dice el estado de una ruta, cuando el catálogo solo marca fichas.**
> Ninguna ficha está en ✅ y **el sitio no puede marcar ninguna** mientras no digas cuál (catálogo
> §1.2, corrección del 2026-09-03). Pero el catálogo marca **talleres**, no **rutas**, así que el
> estado de una ruta no existe en ninguna fuente y hay que derivarlo. Lo que hice: cada ruta lleva
> el estado que comparten sus fichas, y las dos redacciones salen de la leyenda del §1.2.
>
> | Marca del catálogo | Fichas | Lo que el sitio dice |
> |---|---|---|
> | 🚧 en producción | la charla y el taller de entrada, y la clínica mensual | "Estamos terminando el material." |
> | 🔜 a solicitud | las trece restantes | "Se prepara con tu operación al contratarlo." |
>
> **Lo que dejé fuera a propósito, y es tu llamada.** La leyenda del §1.2 autoriza decir, para un
> 🔜, *"necesito dos a tres semanas"*. **No lo publiqué.** Un plazo en una página es un compromiso
> con cualquiera que la lea, y el catálogo lo escribió como una frase de conversación, con la
> operación del cliente enfrente. Si quieres que el plazo aparezca, se agrega en una llave y en
> letras, nunca en cifras, para no abrir `copy-allow.json` por un plazo.
>
> Lo mismo con el precio de la charla de entrada: el catálogo §11 la pone "sin costo o costo
> simbólico" porque es adquisición. **Publicar "sin costo" es una promesa comercial**, no una
> estructura de precio, y no la escribí. Si la quieres, es una llave más.

## 5 · Lo que se ha hecho · `servicios.capacitacion.hecho.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Lo que se ha hecho | nuevo |
| `t1Titulo` | Adopción de Claude Enterprise | **mudado** (`home.casos.t1Titulo`) |
| `t1Body` | Dejar a un equipo completo trabajando con una herramienta de IA de nivel empresarial, con orden y con reglas de uso. | **mudado** (`home.casos.t1Body`) |

> **Por qué solo un renglón.** Es el único de los diez tipos de la casa que el §3.3 manda a esta
> página, y es el correcto: los otros nueve son implementación o asesoría. La página no gana nada
> con un inventario prestado, y la fuente de verdad §3.1 prohíbe expresamente publicar **cuántas**
> sesiones se han impartido, que es la cifra que un bloque de trayectoria pediría a gritos.

## 6 · Dónde encaja · `servicios.capacitacion.encaja.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Dónde encaja | nuevo |
| `body` | La capacitación es la fase de Exploración del método: entendemos tu operación e identificamos dónde la IA ayuda de verdad, y dónde no hace falta. Mientras el equipo aprende a usarla, salen a la luz los problemas que sí se repiten. | reusado (`home.como.p1Body`) más una frase nueva |
| `enlaceTitulo` | La fase siguiente es el diagnóstico | nuevo |
| `enlaceCta` | Ver Asesoría | reusado (`home.como.p2Cta`) |

## 7 · Precio · `servicios.capacitacion.precio.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Precio | nuevo |
| `body` | La capacitación se cotiza por grupo y por resultado, nunca por hora. | **mudado** (`home.cuanto.p1`) |
| `cierre` | Las cifras, en la primera conversación. | nuevo, `pricing.md` §6 |

## 8 · Preguntas · `servicios.capacitacion.faq.*`

| Llave | Texto | Origen |
|---|---|---|
| `q1` | ¿Cuánto dura un taller? | nuevo |
| `a1` | La duración sale del alcance, no al revés: de lo que el grupo tiene que salir sabiendo hacer. Va escrita en la propuesta, junto con el alcance y con lo que se entrega. | nuevo, catálogo §11 |
| `q2` | ¿Se puede practicar con información real de la empresa? | nuevo |
| `a2` | Se practica con información ficticia, pública o anonimizada. Si decides usar datos reales necesitas autorización interna, y quedan fuera contraseñas, datos bancarios, datos personales sensibles y bases completas de clientes. | nuevo, guía §7.6 |
| `q3` | ¿Un taller deja mi proceso automatizado? | nuevo |
| `a3` | No. Un taller enseña capacidades. Si al terminar aparece un problema que valga la pena resolver con un sistema, se cotiza por separado, con alcance y criterios de éxito por escrito. | nuevo, guía §5.8 (fórmula aprobada) |
| `q4` | ¿Con qué herramienta se practica? | nuevo |
| `a4` | Con Claude, que es la recomendación inicial de Osppy. Los principios son transferibles a otras herramientas, y eso se dice en cada taller. | nuevo, catálogo §2 |

## 9 · Cierre · `servicios.capacitacion.cierre.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Platícanos tu operación y vemos por dónde empezar. | nuevo, fuente de verdad §3.1 |
| `cta` | Contacta un asesor | reusado |

> **Por qué no dice "inscríbete".** La fuente de verdad §3.1 marca el llamado válido de esta línea
> como *"Platícanos tu operación"* y prohíbe expresamente *"inscríbete"*: no hay fechas abiertas ni
> un calendario público, y un botón de inscripción promete un calendario que no existe.

---
---

# `/asesoria` · `servicios.asesoria.*`

## 1 · Héroe

| Llave | Texto | Origen |
|---|---|---|
| `kicker` | Asesoría | reusado |
| `headline` | Antes de construir nada, entender dónde. | reusado, sin cambio |
| `body` | Una primera sesión de diagnóstico de la operación, para identificar dónde la inteligencia artificial ayuda y dónde no hace falta. | reusado, sin cambio |
| `cta` · `ctaMessage` · `metaTitle` · `metaDescription` | sin cambio | reusado |

## 2 · Lo que creemos · `servicios.asesoria.creemos.*`

**El corazón de esta página, no un adorno** (plan §4.5). Bajan de la casa **íntegras**: los nueve
renglones son palabra por palabra los de `home.creemos.*`.

| Llave | Texto | Origen |
|---|---|---|
| `kicker` | Lo que creemos | **mudado** |
| `headline` | La IA vale la pena cuando hace una tarea completa, con reglas escritas, y alguien la revisa. | **mudado** |
| `c1Titulo` | Una tarea completa, no un pedazo | **mudado** |
| `c1Body` | Media tarea automatizada deja a una persona terminándola a mano y revisando el doble. Si no se puede hacer completa, todavía no toca. | **mudado** |
| `c2Titulo` | Reglas escritas antes que código | **mudado** |
| `c2Body` | El sistema hace lo que dice el proceso. Si el proceso vive en la cabeza de una persona, lo primero que entregamos es el proceso, no el sistema. | **mudado** |
| `c3Titulo` | Una persona revisa y decide | **mudado** |
| `c3Body` | Estas herramientas se equivocan y a veces inventan. Por eso todo se arma para que alguien pueda revisar: la IA propone, la persona decide. | **mudado** |
| `nota` | La tecnología puede quitar tareas repetitivas; las decisiones, la atención importante y la responsabilidad siguen siendo de las personas. | **mudado**, guía §6.7 |

## 3 · El diagnóstico · `servicios.asesoria.diagnostico.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | El diagnóstico | nuevo |
| `body` | La primera sesión mira cómo trabajas hoy, área por área, e identifica dónde la inteligencia artificial ayuda y dónde no hace falta. Termina con el alcance por escrito, o termina con un no. | nuevo, `oferta.md` §2 |
| `preguntasTitulo` | El diagnóstico empieza con preguntas como: | **mudado** |
| `preguntas[0]` | ¿Dónde se va el tiempo de tu equipo? | **mudado** |
| `preguntas[1]` | ¿Qué proceso se repite igual todas las semanas? | **mudado** |
| `preguntas[2]` | ¿Qué información ya tienes que nadie está usando? | **mudado** |
| `preguntas[3]` | ¿Qué conviene automatizar, y qué todavía no? | **mudado** |

## 4 · Un diagnóstico tiene tres salidas · `servicios.asesoria.salidas.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Un diagnóstico tiene tres salidas | nuevo |
| `s1Titulo` | Vale la pena mirar aquí | nuevo, plan §4.5 |
| `s1Body` | Hay un área con una tarea concreta que se repite, se puede hacer completa, y sabemos cuál es. | nuevo |
| `s2Titulo` | Primero, el proceso por escrito | nuevo, plan §4.5 |
| `s2Body` | El área es la correcta y el proceso vive en la cabeza de una persona. Entonces lo primero que se entrega es el proceso, no el sistema. | nuevo |
| `s3Titulo` | Todavía no | nuevo, plan §4.5 |
| `s3Body` | A veces la respuesta es: todavía no. Y también te lo decimos. | **mudado** (`home.porque.cierre`) |

> **Esta es la frase que más gana con la mudanza.** En la casa vivía al final de un párrafo de
> cinco y se perdía; aquí es una de tres salidas con el mismo peso visual que las otras dos, en la
> única página del sitio donde la honestidad es el producto.

## 5 · Estructuración de procesos · `servicios.asesoria.estructuracion.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Estructuración de procesos | **mudado** (`home.casos.t5Titulo`) |
| `body` | El trabajo previo: dejar el proceso escrito antes de automatizar nada. Sin esto no construimos agentes. | **mudado** (`home.casos.t5Body`) |

> **DECISIÓN 4 · ¿Dónde vive la estructuración de procesos?** Es la pregunta 5 del §9 del plan y
> lleva abierta desde la sesión de planeación. Las dos lecturas, sin acomodar ninguna:
>
> | Lectura | Qué la sostiene |
> |---|---|
> | **Asesoría** (como está arriba) | `oferta.md` §2 define la asesoría como el servicio que *"incluye estructurar los procesos que hacen falta antes de implementar agentes o automatización"*. La fuente de verdad §3.1 repite lo mismo en la columna de lo que la asesoría **sí** puede prometer. El §3.3 del plan siguió a la fuente de verdad |
> | **Implementación** | Tu dictado: *"estructuración de procesos, automatización de procesos, y todo ese tipo de cosas, pues, obviamente, van a ir en implementación"*. Y la fuente de verdad §11.12 la lista bajo **tipos de trabajo entregado**, junto a los agentes y los cotizadores, no como un servicio de asesoría |
>
> **Recomendación: se queda en asesoría, y aquí está el argumento que no es "porque lo dice el
> documento".** El bloque 2 de esta misma página ya promete *"si el proceso vive en la cabeza de
> una persona, lo primero que entregamos es el proceso, no el sistema"*. Si la estructuración se
> va a implementación, esa convicción queda prometiendo en `/asesoria` un entregable que solo se
> vende en la otra página, y el sitio se contradice a un clic de distancia. La lectura de tu
> dictado también se puede honrar sin moverla: **es lo último de la asesoría y lo primero de la
> implementación**, y por eso el bloque 6 de abajo enlaza directo a la página siguiente.
>
> **Si decides que va a implementación**, el cambio no es solo mover este bloque: `/implementacion`
> pasa de tres familias a cuatro renglones en la primera, y el bloque 2 de `/asesoria` se queda
> sin su salida natural. Es una llave por idioma más el rediseño de esos dos bloques, todo dentro
> de E5c.

## 6 · Dónde encaja · `servicios.asesoria.encaja.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Dónde encaja | nuevo |
| `body` | La asesoría es la fase de Diagnóstico del método: qué información existe, dónde vive y qué tan lista está para que un sistema trabaje con ella. Cuando el proceso ya está escrito y el alcance definido, sigue la implementación. | reusado (`home.como.p2Body`) más una frase nueva |
| `enlaceTitulo` | La fase siguiente es construir | nuevo |
| `enlaceCta` | Ver Implementación | reusado (`home.como.p3Cta`) |

## 7 · Precio · `servicios.asesoria.precio.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Precio | nuevo |
| `body` | La asesoría se cotiza por separado, con alcance y criterios de éxito por escrito. | **mudado** (`home.cuanto.p2`, partido) |
| `cierre` | Las cifras, en la primera conversación. | nuevo, `pricing.md` §6 |

> **`home.cuanto.p2` se parte en dos, y las dos mitades dicen lo mismo.** El renglón original era
> *"La asesoría y la implementación se cotizan por separado, cada una con alcance y criterios de
> éxito por escrito"*, y el §3.3 lo manda a las dos páginas. En cada una queda su propia mitad, en
> singular. Nada se pierde y ninguna página habla de la otra en su bloque de precio.

## 8 · Preguntas · `servicios.asesoria.faq.*`

| Llave | Texto | Origen |
|---|---|---|
| `q1` | ¿Cuánto dura un diagnóstico? | nuevo |
| `a1` | Sale del tamaño de la operación y de cuántas áreas entran. Va escrito en la propuesta antes de empezar, junto con lo que se entrega. | nuevo, catálogo §11 |
| `q2` | ¿Y si resulta que no conviene? | nuevo |
| `a2` | Entonces esa es la respuesta y te la damos. Un diagnóstico que solo puede terminar en un proyecto no es un diagnóstico. | nuevo |
| `q3` | ¿La asesoría obliga a implementar con ustedes? | nuevo |
| `a3` | No. Lo que sale del diagnóstico se entrega por escrito y es tuyo. Si decides construir, eso se cotiza por separado. | nuevo, guía §5.8 |
| `q4` | ¿Para qué tipo de empresa es? | nuevo |
| `a4` | Para empresas con áreas separadas, donde el trabajo ya pasa por varias manos. No hay una lista fija: cambia según la industria, el equipo, el tamaño y los procesos que ya tienes. | nuevo, fuente de verdad §3.1 sin la segmentación por tamaño |

## 9 · Cierre · `servicios.asesoria.cierre.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Cuéntanos con qué área quieres empezar. | reusado (`home.cta.headline`), llamado válido de la fuente de verdad §3.1 |
| `cta` | Contacta un asesor | reusado |

---
---

# `/implementacion` · `servicios.implementacion.*`

## 1 · Héroe

| Llave | Texto | Origen |
|---|---|---|
| `kicker` | Implementación | reusado |
| `headline` | Sistemas que quedan trabajando dentro de tu operación. | reusado, sin cambio |
| `body` | Agentes, asistentes y automatización de procesos que se quedan operando, con alcance y criterios de éxito por escrito. | reusado, sin cambio |
| `cta` · `ctaMessage` · `metaTitle` · `metaDescription` | sin cambio | reusado |

## 2 · Agentes de IA · `servicios.implementacion.agentes.*`

El diagrama que baja del héroe de la casa (compuerta E0-2). Los siete renglones del diagrama son
palabra por palabra los de `home.hero.diagrama.*`.

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Agentes de IA | nuevo |
| `body` | Un agente hace una tarea completa por su cuenta, dentro de un proceso definido y con reglas escritas. Completa quiere decir de principio a fin: media tarea automatizada deja a una persona terminándola a mano y revisando el doble. | nuevo, sobre `home.creemos.c1Body` |
| `revision` | La IA propone; una persona revisa y decide. Todo se arma para que esa revisión sea posible. | nuevo, guía §6.7 |
| `diagrama.tarea` | La tarea | **mudado** |
| `diagrama.proceso` | El proceso | **mudado** |
| `diagrama.procesoEtiqueta` | escrito por alguien | **mudado** |
| `diagrama.agente` | El agente | **mudado** |
| `diagrama.resultado` | El resultado | **mudado** |
| `diagrama.pie` | El paso que casi nadie tiene escrito es el segundo. | **mudado** |
| `diagrama.alt` | Diagrama de cuatro pasos: la tarea pasa por un proceso escrito por alguien, un agente la ejecuta y produce un resultado. | **mudado** |

## 3 · Lo que se ha construido · `servicios.implementacion.construido.*`

Los tipos, agrupados en **tres familias** en vez de una fila de tarjetas iguales (plan §4.5). Cada
nombre y cada cuerpo bajan de `home.casos.*` palabra por palabra.

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Lo que se ha construido | **mudado** (`home.hacemos.implementacion.tiposTitulo`, sin los dos puntos) |
| `f1Titulo` | Hacen la tarea | nuevo, plan §4.5 |
| `f1i1Titulo` | Agentes de IA | **mudado** (`t3`) |
| `f1i1Body` | Hacen una tarea completa por su cuenta, de forma autónoma, dentro de un proceso definido y con reglas escritas. | **mudado** |
| `f1i2Titulo` | Asistentes de IA | **mudado** (`t7`) |
| `f1i2Body` | Responden y atienden con la información que el negocio carga. Si algo no está, lo dicen o preguntan, no inventan. | **mudado** |
| `f1i3Titulo` | Automatización de procesos | **mudado** (`t6`) |
| `f1i3Body` | Una vez escrito, el proceso deja de hacerse a mano: el sistema lo ejecuta y una persona revisa el resultado. | **mudado** |
| `f2Titulo` | Producen documentos | nuevo, plan §4.5 |
| `f2i1Titulo` | Cotizadores | **mudado** (`t8`) |
| `f2i1Body` | Sistemas que arman una cotización con las reglas y los precios del negocio, para que no dependa de una sola persona. | **mudado** |
| `f2i2Titulo` | Plantillas con los membretes de tu empresa | **mudado** (`t9`) |
| `f2i2Body` | Los documentos que salen a un cliente se arman ya con tu formato, tu membrete y tus datos, sin rehacerlos cada vez. | **mudado** |
| `f2i3Titulo` | Sistema para manejar auditorías | **mudado** (`t10`) |
| `f2i3Body` | El expediente se arma conforme pasan las cosas, no la semana que llega el auditor, y cada documento queda donde se busca. | **mudado** |
| `f3Titulo` | Viven en tu casa | nuevo, plan §4.5 |
| `f3i1Titulo` | Modelos en tu infraestructura | **mudado** (`t4`) |
| `f3i1Body` | Cuando la información no puede salir de tu casa, el modelo se despliega dentro de tu propia infraestructura, con Amazon Bedrock. | **mudado** |

> **Las tres familias del plan cubren siete de los nueve tipos, y los dos que faltan no se
> perdieron.** Vale la pena decirlo porque parece un hueco y no lo es: **adopción de Claude
> Enterprise** se fue a `/capacitacion` y **estructuración de procesos** a `/asesoria`, los dos
> por el §3.3. Siete más dos son los nueve, y ninguna página los repite.
>
> **Ojo con el orden de las decisiones:** este agrupamiento **ya supone que la decisión 4 sale
> hacia asesoría**. Si sale hacia implementación, la estructuración vuelve aquí y la primera
> familia pasa de tres renglones a cuatro. El plan escribió las tres familias sin notar que
> dependían de una pregunta abierta.

## 4 · Cómo se conecta · `servicios.implementacion.conecta.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Cómo se conecta | nuevo |
| `body` | Lo que se construye se conecta con el ERP y el sistema de facturación que ya usas. Hasta dónde llega esa conexión se define en el diagnóstico y queda por escrito antes de que aparezca en una propuesta. | nuevo, `oferta.md` §2 |
| `nota` | No publicamos marcas de sistemas. Nombrar uno exige una instancia ya entregada, y eso es una conversación, no una página. | nuevo, catálogo §15 y operador 2026-09-03 |

## 5 · Las tres fases · `servicios.implementacion.fases.*`

Tres de las cinco fases del método pasan por aquí, y son el destino de tres de los cinco clics de
la casa. Los tres cuerpos son los de `home.como.*` palabra por palabra.

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Las tres fases | nuevo |
| `f1Titulo` | Diseño de solución | reusado (`home.como.p3Titulo`) |
| `f1Body` | El proceso queda por escrito y la solución se dibuja encima, con una prueba de concepto acotada (PoC) antes de construir en grande. | reusado (`home.como.p3Body`) |
| `f2Titulo` | Implementación | reusado (`home.como.p4Titulo`) |
| `f2Body` | Desarrollo del sistema y de su operación técnica (MLOps). Se cotiza por separado, con alcance y criterios de éxito por escrito: el impacto lo mides tú, con tus números. | reusado (`home.como.p4Body`) |
| `f3Titulo` | Soporte y monitoreo | reusado (`home.como.p5Titulo`) |
| `f3Body` | Gobernanza y reentrenamiento: lo entregado queda bajo un plan de monitoreo y mantenimiento, y el sistema se ajusta conforme tu operación cambia. | reusado (`home.como.p5Body`) |

## 6 · Después de entregar · `servicios.implementacion.despues.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Después de entregar | nuevo |
| `body` | Lo que queda entregado puede seguir bajo un plan de operación: hosting, monitoreo y mantenimiento. | **mudado** (`home.cuanto.p3`) |

## 7 · Precio · `servicios.implementacion.precio.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Precio | nuevo |
| `body` | La implementación se cotiza por separado, con alcance y criterios de éxito por escrito. | **mudado** (`home.cuanto.p2`, la otra mitad) |
| `cierre` | Las cifras, en la primera conversación. | nuevo, `pricing.md` §6 |

## 8 · Preguntas · `servicios.implementacion.faq.*`

| Llave | Texto | Origen |
|---|---|---|
| `q1` | ¿Qué pasa si mi proceso no está escrito? | nuevo |
| `a1` | Es lo más común, y es el primer trabajo. Escribir el proceso va antes que cualquier automatización: no construimos agentes sobre procesos que solo viven en la cabeza de alguien. | nuevo, sobre `home.faq.a3` |
| `q2` | ¿La información de mi empresa sale de mi infraestructura? | nuevo |
| `a2` | Depende de lo que construyamos, y se define por escrito antes de empezar: qué información puede usarse, qué se anonimiza y qué se queda fuera. Cuando no puede salir, el modelo se despliega dentro de tu propia infraestructura. | nuevo, guía §6.7 |
| `q3` | ¿Quién opera el sistema después? | nuevo |
| `a3` | Lo entregado queda bajo un plan de monitoreo y mantenimiento, y se ajusta conforme tu operación cambia. No entregamos una herramienta y nos vamos. | nuevo, sobre `home.faq.a4` |
| `q4` | ¿Cuánto tarda? | nuevo |
| `a4` | Sale del alcance, y el alcance sale del diagnóstico. Antes de eso cualquier fecha sería inventada, así que no la damos. | nuevo, guía §5.8 |

## 9 · Cierre · `servicios.implementacion.cierre.*`

| Llave | Texto | Origen |
|---|---|---|
| `titulo` | Cuéntanos con qué área quieres empezar. | reusado (`home.cta.headline`) |
| `cta` | Contacta un asesor | reusado |

---
---

# La deuda mecánica que E5b y E5c heredan

Para que no se descubra con una compuerta en rojo.

1. **`copy-allow.json` no se toca.** No hay una sola cifra nueva en este documento: los plazos,
   las duraciones y los precios se dicen en estructura o en letras. Es deliberado, y es lo que
   evita abrir el archivo de excepciones por una página de servicios. **Si apruebas el plazo de
   preparación o el costo de la charla (decisión 3), esa llave sí entra al archivo con su fuente.**
2. **Las tres `headline` conservan su nombre de llave.** `smoke.spec.ts` las lee del JSON para
   afirmar que cada ruta pinta la suya, así que el valor de `servicios.capacitacion.headline` puede
   cambiar sin tocar la prueba, pero el nombre no.
3. **`servicios.<slug>.cta` también se lee desde la prueba**, por nombre accesible del botón. Los
   tres siguen diciendo "Contacta un asesor".
4. **El árbol de `en.json` queda idéntico.** Este documento agrega alrededor de cien llaves en
   `servicios.*`; `check:parity` falla ruidosamente si E5b deja una sola sin su gemela.
5. **`check-sections.mjs` prohíbe `min-h-screen` dentro de un `<section>`.** El esqueleto actual ya
   lo respeta poniendo la altura en el envoltorio interior; los bloques nuevos heredan la regla.
6. **`check-copy.mjs` mira los metadatos de las tres páginas** desde E2 (`METADATA_FILES`), así que
   la corrección de la decisión 2 la ve la compuerta.
7. **Ninguna ficha del catálogo se marca ✅** en el JSON, en un componente ni en un `alt`. El
   bloque 4 de `/capacitacion` es el único sitio del sitio que habla de estados de taller.

# Lo que encontré abierto y no toqué

- **`home.faq.a6` contradice a `pricing.md` §6 y al renglón que acaba de bajar a estas páginas.**
  Dice *"La capacitación y la asesoría se cotizan por grupo y por resultado; la implementación, por
  separado"*, y tanto `pricing.md` §6 como `home.cuanto.p2` dicen que **la asesoría se cotiza por
  separado**, como la implementación. Es una llave de **la casa**, y esta tanda no toca la casa;
  queda escrito aquí para que E5c o E6 lo levante con una llave por idioma. **Dueño O**, porque es
  un renglón de precio.
- **`nav.cta` dice "Escríbenos" y el cierre dice "Contacta un asesor".** Sigue igual que al
  terminar E3c. Alinearlos es una llave por idioma y es tu decisión, no una corrección mía.
- **El catálogo §1 y §16 siguen diciendo "PyMEs"** y contradicen a HQA-D37 desde el 2026-09-03.
  Este documento no copió esa segmentación, pero la fuente sigue como estaba. **Dueño O**, tal como
  lo dejó la bitácora de E1.
- **El número público de WhatsApp sigue vacío** y los seis CTA de estas tres páginas caen a
  `mailto:hello@osppy.com`.

---

# Las cuatro decisiones, juntas

| # | Qué | Recomendación |
|---|---|---|
| **1** | El titular de `/capacitacion`: "usarla" o "usar la IA" | **"usar la IA"**, la versión de la casa. El pronombre no tiene antecedente en su propia página |
| **2** | La descripción de `/capacitacion` dice "empresas medianas y grandes" | **Quitar la segmentación** y no sustituirla. HQA-D37 no se mueve; el sitio deja de decirlo en voz alta |
| **3** | Cómo se dice el estado de una ruta, y si se publican el plazo de preparación y el costo de la charla | **Dos redacciones derivadas de la leyenda del catálogo §1.2.** El plazo y el costo **no** se publican salvo que lo pidas |
| **4** | Dónde vive la estructuración de procesos | **Asesoría.** Si sale a implementación, se rediseñan dos bloques dentro de E5c |

**Ninguna se tomó sola.** Ninguna fila del ledger se escribió en esta tanda: el ID máximo sigue en
HQA-D98 y estas cuatro son decisiones tuyas, no lecturas de la sesión. La que las cierre escribe
sus filas.

*Documento de copy · tanda E5a · 2026-09-04 · Español (MX) · El inglés (E5b) se escribe contra la
versión aprobada de este documento, no contra este.*
