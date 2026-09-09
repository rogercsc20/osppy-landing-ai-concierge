# Sitio v6 · 01 · Estructura y copy

> **Fecha: 2026-09-08.** Repo del sitio, `docs/`. Español (HQA-D3). **Estado: aprobado en la compuerta 2
> (operador, 2026-09-08, 00:18; HQA-D147).**
> **Qué es:** el mapa del sitio, las secciones de la casa en el orden aprobado, el copy final de cada una
> con su prueba y su fuente, el pie, los metadatos y la forma de `messages/es.json`.
> **De dónde sale:** la historia (`../../osppy-hq/business/marca/2026-09-07-historia-de-osppy.md`, HQA-D140 a
> D146), el fundamento §9 y §10, FDV §2 y §11.10 a §11.12, `pricing.md` §6, y las decisiones HQA-D128 a
> D139 del 2026-09-07. `§` solo es el fundamento; `historia §N` es la historia.
> **Reglas que este documento obedece:** tú (D129) · español e inglés (D132; el inglés se escribe desde
> este español aprobado, en la FASE 4) · hello@osppy.com y sin formulario (D133, D25) · sin analítica (D134)
> · persona y aire (D135) · el fundador no aparece (D136) · muchas fotos reales, ninguna generada (D137) ·
> un solo llamado a la acción, repetido a lo más dos veces · cero palabra del banco · cero guion largo.

---

## 1. El mapa del sitio

La más corta que cumple el §10: **una casa** y nada más. Ningún tiempo de los diez segundos necesita otra
página. Sin páginas de producto (D88, D108), sin páginas por industria, sin página de precios (el precio es
un tiempo de la casa, D43). Sin páginas legales: el sitio no recoge datos de nadie (sin formulario, D25 y
D133; sin analítica ni rastreo, D134), así que no hay aviso propio que escribir; el día que se recoja un
dato, se escribe desde D25 y `/aviso` sigue siendo del bot.

| Ruta | Qué es | Razón |
|---|---|---|
| `/` | redirección 307 a `/es` | el sitio es de dos idiomas con el español por defecto (D132); una sola casa por idioma |
| `/es` | la casa en español | los seis tiempos, en el orden aprobado |
| `/en` | la casa en inglés | D132; mismas llaves, texto escrito desde el español aprobado; `hreflang` cruzado |
| `/aviso`, `/login`, `/dashboard/*` | redirecciones a sistemas vivos | contratos, no diseño (D104); no se tocan ni se enlazan desde la casa |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | generados por Next | `/es` y `/en` con alternates; la imagen OG con la marca y la frase, sin foto |

**El cambio de idioma:** un enlace en la navegación ("EN" en `/es`, "ES" en `/en`), `<html lang>` por
ruta, y `alternates.languages` en los metadatos. Sin detección automática ni cookie: quien entra a `/es` lee
español hasta que él cambie.

**Propuesta de mecánica** (decisión de construcción, FASE 4, dicha aquí porque toca las rutas):
`app/[locale]/` con `locale` limitado a `es` y `en`, y los mensajes leídos directo de `messages/<locale>.json`;
`next-intl` no hace falta para una casa de un solo nivel y queda en la lista de retiro (D138).

---

## 2. Las secciones de la casa, en orden

Orden aprobado: recibimiento · quiénes somos · cómo trabajamos · cómo ayudamos · que es real · cómo empezar
a hablar (D130, D144). **Propuesta de la sesión:** las tres cifras de investigación (D146) van en una
sección propia, "Lo que dicen los datos", justo antes de "que es real": primero lo que el mercado reporta
(la mayoría se queda en pilotos), luego lo que Osppy ya tiene operando. Si el operador prefiere, caben
dentro de "que es real" como una franja; el copy no cambia.

**El único llamado a la acción** es "Hablemos" y aparece dos veces: en el recibimiento y en la sección de
contacto. Los dos llevan a `#hablemos` y el botón final es un enlace a `mailto:hello@osppy.com` (y a
WhatsApp el día que exista el número, D133). La navegación no lleva botón.

**Navegación mínima:** la marca ("Osppy", texto o glifo: FASE 3) · Quiénes somos · Cómo trabajamos · Cómo
ayudamos · Hablemos · el cambio de idioma. Anclas dentro de la misma página.

> **Nota del 2026-09-08 (operador, HQA-D182).** El enlace de la navegación dejó de decir "Cómo ayudamos" y
> dice **"Áreas"** ("Areas" en inglés), y el ancla a la que apunta dejó de ser `#ayudamos` y es **`#areas`**,
> para que la barra del navegador diga `/es#areas`. Sigue siendo un ancla de la misma página, como los
> otros tres enlaces del menú; ninguna URL publicada cambia.

### 0 · El recibimiento

- **Dice:** **IA que ya trabaja.** (frase corta, D130) y el botón **Hablemos**. Nada más.
- **Prueba y fuente:** FDV §2 (afirmación autorizada: los sistemas de Osppy operan hoy en negocios reales) ·
  §10 "que ya lo hace" · D107 (la IA es la naturaleza).
- **Objeto que la distingue:** una fotografía real, a todo lo ancho, de una persona sonriendo en un lugar de
  trabajo real (se elige en la FASE 3, D137), y una sola línea grande encima. Es la única sección sin texto
  de apoyo.
- **No debe:** panel, tablero ni pantalla como héroe; atmósfera oscura; urgencia; una segunda frase; cifras.

### 1 · Quiénes somos

- **Dice:**
  - Encabezado: **Reimaginemos tu empresa.**
  - La frase: **Osppy es una consultora de tecnología y negocios, nativa en IA y profundamente humana. Te
    ayudamos a reimaginar tu empresa desde una perspectiva digital.**
  - Línea de origen: Llegamos a la consultoría desde construir y operar sistemas que hoy trabajan en
    negocios reales. Por eso empezamos por el negocio, no por la herramienta.
  - **Nuestro propósito.** Que las empresas con las que trabajamos prosperen y compitan al más alto nivel.
    Creemos que la tecnología vale cuando la gente que dirige y opera un negocio la entiende, la usa y la
    hace suya.
  - **Lo que creemos.** Que las personas y el negocio van primero y la tecnología después. Que la
    inteligencia artificial no es un proyecto aparte, sino una forma de trabajar. Que las mejores soluciones
    se construyen con el equipo del cliente y se quedan con él.
- **Prueba y fuente:** historia §1 y §2 (D140, D144) · §6 y FDV §2 para la línea de origen · C-1.
- **Objeto que la distingue:** un enunciado tipográfico grande (la frase) con una fotografía de personas
  trabajando al lado; los dos bloques cortos debajo, en dos columnas.
- **No debe:** manifiesto de valores; iconos; "expertos" ni "líderes" (banco); la construcción de Slalom
  ya está en la frase por decisión del operador y no se repite en ningún otro lugar de la casa.

### 2 · Cómo trabajamos

- **Dice:** encabezado **Cómo trabajamos.** y cuatro etapas (historia §3, D142, D144):
  1. **Diagnóstico.** Entendemos tu operación a profundidad: cómo trabaja tu gente, dónde está la información
     y qué duele de verdad.
  2. **Planeamos a tu lado.** Convertimos lo que encontramos en un plan estratégico: qué va primero, qué sigue
     y qué no vale la pena todavía, con alcance y criterios de éxito por escrito.
  3. **Implementación.** Construimos de la mano contigo y lo dejamos funcionando. Si tu gente puede hacerlo, la
     capacitamos para que lo haga.
  4. **Acompañamiento.** Nos quedamos hasta que tu equipo camina solo, y después seguimos cerca: operación,
     mantenimiento y lo que venga.
- **Prueba y fuente:** §4 · guion de asesoría §2 y §9 · D114 · pricing §6 (alcance y criterios; planes de
  operación) · D50.
- **Objeto que la distingue:** cuatro pasos numerados en secuencia (los números salen del código, no del
  copy), cada uno con su título y sus dos líneas; una fotografía de trabajo real por etapa o una sola grande
  al lado (FASE 3). Es la única sección con secuencia.
- **No debe:** parecer una lista de servicios; prometer plazos; nombrar clientes.

### 3 · Cómo ayudamos

> **Nota del 2026-09-08 (operador, HQA-D182).** El encabezado de esta sección ya no dice "Cómo ayudamos."
> sino **"Áreas en las que nos especializamos."**, y en inglés **"Our areas of expertise."**. Lo de arriba
> queda escrito como se aprobó el día que se aprobó. Las otras cuatro cadenas de "Cómo ayudamos" no cambian:
> la pista del hover (`ayudamos.ver`), el eyebrow de cada página de área (`area.eyebrow`), el título dentro de
> cada página de industria (`industria.ayudamosTitulo`) y los ocho `h1` de industria. **El ancla sí cambia**,
> por decisión del operador el mismo día: `#ayudamos` pasa a `#areas` y `ayudamos-title` a `areas-title`,
> en la sección, en el enlace del menú, en el "volver" de cada página de área y en la prueba que afirma el
> orden de las secciones. Las llaves de `messages/*.json` siguen llamándose `ayudamos.*`: son llaves de
> mensaje, no URLs, y renombrarlas no le enseñaría nada a nadie. La frase dice qué ES Osppy, que es
> justo lo que el principio 1 del sistema visual y el banco evitan; es una excepción decidida por el operador
> y anotada, no un descuido, y tiene su nota del mismo día en
> `../osppy-hq/business/marca/banco-prohibido.md` y en el §2 del sistema visual.

> **Nota del 2026-09-08 (operador, HQA-D182).** El orden de las ocho áreas ya no es el de la lista de abajo.
> Es **Inteligencia artificial · Nube · Datos · Sistemas · Producto digital · Estrategia · Planeación y
> entrega · Experiencia**, dictado por el operador mirando el sitio vivo. La lista de abajo se queda escrita
> en el orden en que se aprobó, con su texto, que no cambió ni una palabra. El orden vive en el orden de las
> llaves de `ayudamos.areas` en `messages/es.json` y `messages/en.json` (la sección las lee con
> `Object.values`) y en `data/areas.json`, que lleva las mismas ocho en el mismo orden. Ningún slug y ninguna
> URL se movieron; `app/sitemap.ts` sale del mismo objeto, así que el sitemap las lista en el orden nuevo.

- **Dice:** encabezado **Cómo ayudamos.** y las ocho áreas (historia §5), sin insignia:
  - **Estrategia.** Decidir qué tecnología necesita tu negocio, en qué orden y para qué, antes de comprar nada.
  - **Datos.** Juntar la información que hoy está repartida, ordenarla y que tu gente sepa leerla.
  - **Inteligencia artificial.** Poner la inteligencia artificial a hacer trabajo dentro de tu operación
    (responder, clasificar, redactar, revisar), con una persona que decide.
  - **Nube.** Mover y modernizar tus sistemas, y operarlos con orden.
  - **Sistemas.** Implementar y conectar las aplicaciones con las que trabajan tu equipo y tus clientes.
  - **Experiencia.** Diseñar cómo tus clientes y tu gente viven cada proceso, del primer contacto al servicio.
  - **Producto digital.** Construir el producto o la plataforma que tu negocio necesita, por dentro, no solo
    configurarlo.
  - **Planeación y entrega.** Llevar el proyecto de principio a fin: alcance, prioridades, fechas y entregas.
  - Debajo, con su propio encabezado, **Lo que ya se ha construido:** cotizadores · asistentes de inteligencia
    artificial · agentes de inteligencia artificial (sistemas que hacen una tarea completa por su cuenta, con
    la información del negocio y las reglas que alguien escribió) · adopción de Claude Enterprise · modelos
    desplegados en la infraestructura del cliente, con Amazon Bedrock · estructuración y automatización de
    procesos · plantillas con los membretes de la empresa · un sistema para manejar auditorías.
- **Prueba y fuente:** §4 y D112 (las ocho áreas como capacidad) · FDV §11.12 (los nueve tipos de trabajo,
  todos "Hecho") · oferta-reglas §4 (nombrar herramientas es describir capacidad, con el concepto primero).
- **Objeto que la distingue:** una retícula de ocho, solo texto (nombre y línea), sin iconos; y debajo una
  lista corrida de lo construido. `data/areas.json` lleva las ocho como `ofrecido` para que la compuerta lo
  lea; la sección no dice "entregado" de ninguna área.
- **No debe:** insignias de "hecho" por área; iconos; áreas de oficina (FDV §11.12) como estructura;
  "a la medida".

### 4 · Lo que dicen los datos (propuesta de lugar)

- **Dice:** encabezado **Lo que dicen los datos.** y tres cifras con su fuente al pie (D146):
  - **Dos de cada tres** organizaciones reportan mejoras de productividad y eficiencia con la inteligencia
    artificial. *Deloitte, State of AI in the Enterprise, 2026.*
  - **Solo el 5%** de las empresas obtiene valor sustancial de la inteligencia artificial, y logra cinco veces
    más aumento de ingresos que las rezagadas en las áreas donde la aplica. *BCG, The Widening AI Value Gap,
    2025.*
  - **En México, el 66%** de las grandes empresas sigue en pilotos aislados; solo el 13.8% ha llevado la
    inteligencia artificial al núcleo de su negocio. *Accenture, IPADE y Empresas Globales, Estudio de
    Adopción de IA en México, 2026.*
- **Prueba y fuente:** las tres verificadas contra la página del informe el 2026-09-08 (historia §4,
  tabla R1 a R3); cada cifra entra a `scripts/copy-allow.json` con su enlace.
- **Objeto que la distingue:** tres numerales grandes con una línea cada uno y la fuente en letra pequeña.
  Es la única sección con cifras ajenas, y lo dice con la fuente.
- **No debe:** presentarlas como resultado de Osppy; sumarles adjetivos; la cifra de costos de BCG.

### 5 · Lo que ya opera

- **Dice:**
  - Encabezado: **Los sistemas de Osppy operan hoy en negocios reales.**
  - Dos cifras, solas: **Más de 100** empresas asesoradas · **Más de 50** soluciones construidas.
  - Una línea: Sistemas operando en manufactura, automotriz, logística, construcción, comercio exterior y
    retail.
- **Prueba y fuente:** FDV §2 (afirmación autorizada, sin calificar) · FDV §11.11 (cifras firmes, sin nota,
  D145) · FDV §11.10 (los seis giros, todos atestiguados; tope de seis, `CLAUDE.md`).
- **Objeto que la distingue:** el enunciado como titular, los dos numerales grandes, y los seis giros en una
  sola fila de palabras. `data/industries.json` lleva los seis como `hecho` con fuente `FDV §11.10`.
- **No debe:** logos, testimonios, nombres, conteos que no sean estos dos; encabezar los giros con
  "entregado"; más de seis giros.

### 6 · Hablemos

- **Dice:**
  - Encabezado: **Lo que sigue para tu empresa, lo construimos contigo.**
  - Línea: Cuéntanos cómo opera tu empresa y te decimos dónde podemos ayudar y dónde no.
  - Botón: **Hablemos** (`mailto:hello@osppy.com`); debajo, el correo escrito: hello@osppy.com.
  - **Cómo cobramos.** La capacitación se cotiza por grupo y por resultado, nunca por hora. La asesoría y las
    implementaciones se cotizan por separado, con alcance y criterios de éxito por escrito. Después de
    entregar, hay planes de operación: alojamiento, monitoreo y mantenimiento. **Las cifras, en la primera
    conversación.**
- **Prueba y fuente:** historia §2 cierre y §4 tiempo 5 · D133 · pricing §6 y D43 (el único texto de precio).
- **Objeto que la distingue:** una fotografía cálida de una conversación de trabajo, el titular, el botón y
  la lista de cómo cobramos en cuatro líneas. Segunda y última aparición del llamado a la acción.
- **No debe:** formulario (D25); "desde", rangos ni hora (D43); urgencia; un segundo botón.

---

## 3. El pie

- **Marca:** Osppy.
- **Legal (D25):** Osppy es un nombre comercial. © 2026 Osppy. *(la razón social entra el día que exista)*
- **Lugar (propuesta):** Guadalajara, México. *(oferta.md §1; sin calle ni teléfono, D25)*
- **Contacto:** hello@osppy.com. *(WhatsApp cuando exista el número, D133)*
- **Productos, por conversación (D88, D108), sin nombrarlos:** Osppy también desarrolla productos propios para
  las industrias en las que opera. Pregúntanos por ellos. *(enlace al mismo correo)*
- **Idioma:** el mismo enlace de cambio que la navegación.
- **Sin** aviso de privacidad (no hay dato que recoger, D134), sin redes sociales hasta que el operador dé
  las cuentas que quiere enlazar (la de Instagram existe; enlazarla es su decisión).

---

## 4. Metadatos

| Campo | Texto |
|---|---|
| `title` | Osppy · Consultora de tecnología y negocios |
| `description` | Osppy es una consultora de tecnología y negocios, nativa en IA y profundamente humana. Te ayudamos a reimaginar tu empresa desde una perspectiva digital. |
| Open Graph | mismo título y descripción; imagen generada en build con "Osppy" y la frase, sobre el fondo del sistema visual (FASE 3); sin fotografía |
| `lang` y `alternates` | `es` en `/es`, `en` en `/en`, `hreflang` cruzado y `x-default` a `/es` |

Los textos de metadatos viven en `messages/*.json` (`meta.*`), así la primera pasada de `check-copy.mjs` los
revisa como copy; la segunda pasada (puntuación) revisa los `.tsx` que los renderizan.

---

## 5. La forma de `messages/es.json`

Una llave por texto que se renderiza, agrupada por sección. `messages/en.json` tiene exactamente las mismas
llaves (D132; `check-parity.mjs` sigue igual). Las llaves que llevan un año o una cifra están marcadas.

```
meta.title · meta.description
nav.marca · nav.quienes · nav.metodo · nav.ayudamos · nav.hablemos · nav.idioma
hero.frase · hero.cta
quienes.encabezado · quienes.frase · quienes.origen
quienes.proposito.titulo · quienes.proposito.texto
quienes.creemos.titulo · quienes.creemos.texto
metodo.encabezado · metodo.etapas[0..3].titulo · metodo.etapas[0..3].texto
ayudamos.encabezado · ayudamos.areas.{estrategia,datos,ia,nube,sistemas,experiencia,producto,entrega}.{nombre,texto}
construido.encabezado · construido.items[0..7]
datos.encabezado · datos.items[0..2].{cifra,texto,fuente}      ← cifras y años: copy-allow.json
real.encabezado · real.cifras[0..1].{numero,texto} · real.giros ← "100" y "50" pasan; se listan igual
hablemos.encabezado · hablemos.texto · hablemos.cta · hablemos.correo
precio.titulo · precio.lineas[0..2] · precio.cierre
footer.marca · footer.legal.nombre · footer.legal.copyright     ← "2026" pasa por ser llave legal
footer.lugar · footer.contacto · footer.productos.texto · footer.productos.cta
```

**Lo que cambia en las compuertas (FASE 4, anotado aquí porque el mapa lo decide):**

- `check-parity.mjs`: sin cambio; dos archivos, mismas llaves.
- `check-copy.mjs`: `METADATA_FILES` se reescribe a los archivos de la v6 (`app/[locale]/layout.tsx`,
  `app/[locale]/page.tsx`, `app/[locale]/opengraph-image.tsx`); hoy lista once archivos de la v5 que no
  existen y fallaría al primer `messages/es.json`. `scripts/copy-allow.json` recibe, con fuente y fecha:
  `datos.items[0].fuente` → `2026`; `datos.items[1].cifra` → `5%`, `.fuente` → `2025`; `datos.items[2].cifra`
  → `66%`, `.texto` → `13.8%`, `.fuente` → `2026`; y por trazabilidad `real.cifras[0].numero` → `100`,
  `real.cifras[1].numero` → `50` (FDV §11.11).
- `check-sections.mjs` y `check-contrast.mjs`: se deciden en la FASE 4 con nota fechada (prompt §4.5).
- `playwright.config.ts`: `webServer.url` apunta a `/es`, que vuelve a existir; `tests/` se crea con las
  pruebas de la FASE 4.
- `data/areas.json` (ocho, `ofrecido`) y `data/industries.json` (seis, `hecho`, fuente `FDV §11.10`): la
  compuerta ya sabe leerlos y así la distinción capacidad y prueba queda en un archivo, no en la cabeza de
  nadie.

---

## 6. Preguntas hechas y respuestas

Ninguna nueva en esta fase: el idioma ya estaba decidido (D132). Pendiente en la compuerta 2: el mapa, el
lugar de "Lo que dicen los datos", el copy sección por sección, el pie (el lugar "Guadalajara, México" es
propuesta), los metadatos.

---

*Sitio v6 · 01 · Estructura y copy · 2026-09-08 · aprobado en la compuerta 2 (HQA-D147) · el copy de cada sección es
el de la historia aprobada, ajustado al lugar; nada se inventa aquí.*
