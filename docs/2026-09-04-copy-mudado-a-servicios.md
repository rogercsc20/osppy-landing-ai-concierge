# Copy que sale de la casa · dónde va cada renglón (E3c)

> **2026-09-04.** Escrito por la tanda E3c en el momento de borrar estas llaves de
> `messages/*.json`, **antes** de borrarlas y no después. El plan v4 §8 nombra este riesgo
> primero entre todos: *"El copy se reparte entre cuatro superficies y algo se cae en el
> camino"*. La mitigación escrita era la tabla §3.3 del plan; esto es esa tabla con el
> **texto** adentro, en los dos idiomas, para que E5a no tenga que reconstruirlo desde
> `git show`.
>
> **Por qué un documento y no llaves parqueadas en el JSON.** `getMessages()` carga el
> archivo completo del idioma en cada ruta, así que una llave parqueada pesa en la primera
> carga de todas las páginas, y el sitio ya está 45% arriba de su presupuesto (HQA-D86).
> Un documento pesa cero y dice lo mismo.

---

## `home.creemos`

**Destino:** `/asesoria` · `/advisory` — las tres convicciones y su nota. El corazón de esa página, no un adorno (plan §4.5)

| Llave | Español | English |
|---|---|---|
| `kicker` | Lo que creemos | What we believe |
| `headline` | La IA vale la pena cuando hace una tarea completa, con reglas escritas, y alguien la revisa. | AI is worth it when it does a whole task, under written rules, with someone reviewing it. |
| `c1Titulo` | Una tarea completa, no un pedazo | A whole task, not a slice |
| `c1Body` | Media tarea automatizada deja a una persona terminándola a mano y revisando el doble. Si no se puede hacer completa, todavía no toca. | Half an automated task leaves a person finishing it by hand and checking twice as much. If it can't be done end to end, it isn't time yet. |
| `c2Titulo` | Reglas escritas antes que código | Written rules before code |
| `c2Body` | El sistema hace lo que dice el proceso. Si el proceso vive en la cabeza de una persona, lo primero que entregamos es el proceso, no el sistema. | The system does what the process says. If the process lives in one person's head, the first thing we deliver is the process, not the system. |
| `c3Titulo` | Una persona revisa y decide | A person reviews and decides |
| `c3Body` | Estas herramientas se equivocan y a veces inventan. Por eso todo se arma para que alguien pueda revisar: la IA propone, la persona decide. | These tools get things wrong and sometimes make things up. That's why everything is built so someone can review it: the AI proposes, the person decides. |
| `nota` | La tecnología puede quitar tareas repetitivas; las decisiones, la atención importante y la responsabilidad siguen siendo de las personas. | Technology can take away repetitive tasks; the decisions, the attention that matters and the responsibility stay with people. |

## `home.cuanto`

**Destino:** `p1` a `/capacitacion` · `p2` a `/asesoria` y `/implementacion` · `p3` a `/implementacion` (plan §3.3)

| Llave | Español | English |
|---|---|---|
| `p1` | La capacitación se cotiza por grupo y por resultado, nunca por hora. | Training is priced per group and per result, never per hour. |
| `p2` | La asesoría y la implementación se cotizan por separado, cada una con alcance y criterios de éxito por escrito. | Advisory and builds are quoted separately, each with written scope and success criteria. |
| `p3` | Lo que queda entregado puede seguir bajo un plan de operación: hosting, monitoreo y mantenimiento. | What gets delivered can stay under an operation plan: hosting, monitoring and maintenance. |

## `home.casos`

**Destino:** `t1` a `/capacitacion` · `t2` y `t5` a `/asesoria` · `t3`, `t4`, `t6` a `t10` a `/implementacion`. **`t5` sigue sujeto a la pregunta 5 del plan §9**, que E5a tiene que cerrar: el dictado la mandó a implementación y `oferta.md` §2 la define dentro de la asesoría

| Llave | Español | English |
|---|---|---|
| `t1Titulo` | Adopción de Claude Enterprise | Claude Enterprise adoption |
| `t1Body` | Dejar a un equipo completo trabajando con una herramienta de IA de nivel empresarial, con orden y con reglas de uso. | Getting a whole team working with an enterprise-grade AI tool, with order and rules of use. |
| `t2Titulo` | Sesiones de asesoría | Advisory sessions |
| `t2Body` | Diagnóstico de la operación e identificación de dónde la IA ayuda, y dónde no. | A diagnostic of the operation and a map of where AI helps, and where it doesn't. |
| `t3Titulo` | Agentes de IA | AI agents |
| `t3Body` | Hacen una tarea completa por su cuenta, de forma autónoma, dentro de un proceso definido y con reglas escritas. | They do a whole task on their own, autonomously, inside a defined process, with written rules. |
| `t4Titulo` | Modelos en tu infraestructura | Models in your infrastructure |
| `t4Body` | Cuando la información no puede salir de tu casa, el modelo se despliega dentro de tu propia infraestructura, con Amazon Bedrock. | When the information can't leave your house, the model is deployed inside your own infrastructure, with Amazon Bedrock. |
| `t5Titulo` | Estructuración de procesos | Process structuring |
| `t5Body` | El trabajo previo: dejar el proceso escrito antes de automatizar nada. Sin esto no construimos agentes. | The groundwork: getting the process written down before automating anything. Without it, we don't build agents. |
| `t6Titulo` | Automatización de procesos | Process automation |
| `t6Body` | Una vez escrito, el proceso deja de hacerse a mano: el sistema lo ejecuta y una persona revisa el resultado. | Once it is written, the process stops being done by hand: the system runs it and a person reviews the result. |
| `t7Titulo` | Asistentes de IA | AI assistants |
| `t7Body` | Responden y atienden con la información que el negocio carga. Si algo no está, lo dicen o preguntan, no inventan. | They answer and attend with the information the business loads. If something isn't there, they say so or ask; they don't make things up. |
| `t8Titulo` | Cotizadores | Quoting tools |
| `t8Body` | Sistemas que arman una cotización con las reglas y los precios del negocio, para que no dependa de una sola persona. | Systems that put a quote together using the business's own rules and prices, so it doesn't depend on one person. |
| `t9Titulo` | Plantillas con los membretes de tu empresa | Templates with your company's letterhead |
| `t9Body` | Los documentos que salen a un cliente se arman ya con tu formato, tu membrete y tus datos, sin rehacerlos cada vez. | Documents that go out to a client are built with your format, your letterhead and your details, without being redone each time. |
| `t10Titulo` | Sistema para manejar auditorías | A system for handling audits |
| `t10Body` | El expediente se arma conforme pasan las cosas, no la semana que llega el auditor, y cada documento queda donde se busca. | The file is assembled as things happen, not the week the auditor arrives, and every document ends up where someone will look for it. |
| `tiposTitulo` | De qué tipo: | Of what kind: |

## `home.hero.diagrama`

**Destino:** `/implementacion`, su sección de agentes (compuerta E0-2)

| Llave | Español | English |
|---|---|---|
| `tarea` | La tarea | The task |
| `proceso` | El proceso | The process |
| `procesoEtiqueta` | escrito por alguien | written by someone |
| `agente` | El agente | The agent |
| `resultado` | El resultado | The result |
| `pie` | El paso que casi nadie tiene escrito es el segundo. | The step almost nobody has written down is the second one. |
| `alt` | Diagrama de cuatro pasos: la tarea pasa por un proceso escrito por alguien, un agente la ejecuta y produce un resultado. | Four-step diagram: the task goes through a process someone wrote down, an agent runs it, and it produces a result. |

## `home.hacemos.capacitacion.ficha`

**Destino:** `/capacitacion`, la ficha de formato, público, estado y precio

| Llave | Español | English |
|---|---|---|
| `f1Label` | Formato | Format |
| `f1Value` | Taller práctico, en vivo y por grupo | Live, hands-on, per group |
| `f2Label` | Para quién | Who it's for |
| `f2Value` | Dueños, gerentes y equipos | Owners, managers, and teams |
| `f3Label` | Estado | Status |
| `f3Value` | Se imparte hoy: se contrata y se agenda como la asesoría y la implementación | Running today: booked and scheduled like advisory and implementation |
| `f4Label` | Precio | Pricing |
| `f4Value` | Se cotiza por grupo y por resultado | Quoted per group and per outcome |

## `home.hacemos.asesoria.diagnostico`

**Destino:** `/asesoria`, la sección del diagnóstico

| Llave | Español | English |
|---|---|---|
| `preguntasTitulo` | El diagnóstico empieza con preguntas como: | The diagnostic starts with questions like: |
| `preguntas[0]` | ¿Dónde se va el tiempo de tu equipo? | Where does your team's time actually go? |
| `preguntas[1]` | ¿Qué proceso se repite igual todas las semanas? | Which process repeats the same way every week? |
| `preguntas[2]` | ¿Qué información ya tienes que nadie está usando? | What information do you already have that nobody is using? |
| `preguntas[3]` | ¿Qué conviene automatizar, y qué todavía no? | What's worth automating, and what isn't yet? |

## `home.hacemos.implementacion.tipos`

**Destino:** `/implementacion`, lo que se construye

| Llave | Español | English |
|---|---|---|
| `tiposTitulo` | Lo que se ha construido: | What has been built: |
| `tipos[0]` | Adopción de Claude Enterprise | Claude Enterprise adoption |
| `tipos[1]` | Agentes de IA | AI agents |
| `tipos[2]` | Modelos en tu infraestructura, con Amazon Bedrock | Models in your infrastructure, with Amazon Bedrock |
| `tipos[3]` | Estructuración de procesos | Process structuring |
| `tipos[4]` | Automatización de procesos | Process automation |
| `tipos[5]` | Asistentes de IA | AI assistants |
| `tipos[6]` | Cotizadores | Quoting tools |
| `tipos[7]` | Plantillas con los membretes de tu empresa | Templates with your company's letterhead |
| `tipos[8]` | Sistema para manejar auditorías | A system for handling audits |

## `home.porque`

**Destino:** `p1`, `p2` y `p3` **mueren**: el operador pidió que todo lo demás de esa pantalla se quitara. **`cierre` se muda a `/asesoria`**, donde el plan §4.5 dice que esa frase por fin tiene su lugar

| Llave | Español | English |
|---|---|---|
| `p1` | La frase se dice en juntas de dirección todo el tiempo. La que casi nunca sigue es la segunda: en qué área, con qué tarea, con qué reglas y quién revisa el resultado. | The sentence gets said in leadership meetings all the time. The one that almost never follows is the second: in which area, on which task, under which rules, and who reviews the result. |
| `p2` | Sin esa segunda frase pasan dos cosas. O no se hace nada en todo un año. O se compra una herramienta que nadie termina de usar, porque el proceso que iba a ordenar nunca estuvo escrito. | Without that second sentence, one of two things happens. Nothing gets done for a year. Or a tool gets bought that nobody quite adopts, because the process it was meant to tidy up was never written down. |
| `p3` | Nuestro trabajo empieza justo ahí: en convertir “necesitamos IA” en una tarea concreta de un área concreta. | That is exactly where our work starts: turning “we need AI” into one concrete task in one concrete area. |
| `cierre` | A veces la respuesta es: todavía no. Y también te lo decimos. | Sometimes the answer is: not yet. We tell you that too. |

## `home.trayectoria`

**Destino:** **Mueren las cuatro.** `c4` salió por instrucción del operador (24/7 era lenguaje de producto), `agentes` y `body` por el mismo dictado

| Llave | Español | English |
|---|---|---|
| `c4Valor` | 24/7 | 24/7 |
| `c4Label` | atención del asistente | assistant coverage |
| `agentes` | Además: agentes que hacen la tarea completa por su cuenta, de forma autónoma, operando hoy en sistemas en producción. | Also: agents that do the whole task on their own, autonomously, running in production systems today. |
| `body` | Aquí no se nombra a ningún cliente sin permiso por escrito, y no se publica ninguna cifra medida por nosotros. Lo que sí se puede contar: cuánto, de qué tipo y en qué giros. | No client is named here without written permission, and no figure measured by us is published. What can be told: how much, of what kind, and in which sectors. |

## `home.areas.body`

**Destino:** **Muere.**

| Llave | Español | English |
|---|---|---|
| `(valor)` | La IA no entra “en la empresa”. Entra en un área, con una tarea. Estas son las dieciséis donde más seguido empieza la conversación, cada una con un ejemplo de por dónde. | AI doesn't go “into the company”. It goes into an area, on a task. These are the sixteen where the conversation most often starts, each with an example of where to begin. |

## `home.cta.body`

**Destino:** **Muere.** El cierre va sin párrafos (compuerta E0-6)

| Llave | Español | English |
|---|---|---|
| `(valor)` | Nos escribes, te contesta una persona, y vemos si hay algo que valga la pena hacer. A veces la respuesta honesta es “todavía no”, y también te la vamos a dar. | You write, a person answers, and we work out whether there's anything worth doing. Sometimes the honest answer is “not yet”, and we'll give you that one too. |

## `home.productos`

**Destino:** **Muere.** Su función la hace el bloque de Productos del pie, construido en E2 (HQA-D88)

| Llave | Español | English |
|---|---|---|
| `kicker` | Productos | Products |
| `headline` | También construimos productos. | We build products too. |
| `body` | Además de trabajar dentro de la operación de otras empresas, Osppy construye producto propio: un mismo asistente por WhatsApp, un giro a la vez. | Besides working inside other companies' operations, Osppy builds its own product: one WhatsApp assistant, one sector at a time. |
| `hoteles.nombre` | Diana Hoteles | Diana Hoteles |
| `hoteles.estado` | En producción | In production |
| `hoteles.body` | Diana responde a los huéspedes por WhatsApp con la información del hotel, y el equipo ve todo y opera desde un panel. Opera hoy en hoteles en producción. | Diana answers guests on WhatsApp with the hotel's own information, and the team sees everything and operates from a panel. It runs in hotels in production today. |
| `hoteles.cta` | Conoce el producto | See the product |
| `citas.nombre` | Diana Citas | Diana Citas |
| `citas.estado` | En construcción | Under construction |
| `citas.body` | Diana, para negocios que viven de citas: clínicas, consultorios, spas. Está en construcción, sin fecha comprometida; buscamos clínicas fundadoras. | Diana, for appointment-based businesses: clinics, practices, spas. It's under construction, with no committed date; we're looking for founding clinics. |
| `citas.cta` | Quiero ser clínica fundadora | I want to be a founding clinic |

---

*Documento de mudanza · E3c · 2026-09-04 · Se cierra cuando E5c haya colocado el último
renglón, y hasta entonces es el contrato.*
