# Sitio v6 · 02 · Sistema visual

> **Fecha: 2026-09-08.** Repo del sitio, `docs/`. Español (HQA-D3). **Estado: compuerta 3 abierta** (el operador
> corrigió el prototipo ocho veces el 2026-09-08, HQA-D148 a D158; el sitio está en vivo en www.osppy.com desde
> las 15:54 con su palabra, HQA-D156 y D157).
> **Reescrito el 2026-09-08 a las 16:40 (prompt de industrias §3).** Hasta esa hora este documento describía la
> paleta del primer prototipo (Lino, Tinta, Petróleo, cobre; luego el azul brillante como fondo), que ya no
> existe: lo que manda es el sistema tal como quedó en el prototipo, y este documento lo describe. La primera
> versión queda en el historial (`0cb7fee`, `f62ea2e`).
> **Qué es:** el sentimiento como criterio, los cinco principios del fundamento §9 como reglas verificables, el
> sistema (color, tipografía, espacio, movimiento, imagen, componentes), el prototipo y dónde diverge de la
> guía §8 y de Instagram.
> **Brief:** el fundamento §9 y nada más (prompt v6 §6); persona y aire (HQA-D135); el fundador no aparece
> (D136); muchas fotos reales, ninguna generada, slalom.com como referencia de proporción (D137); el azul del
> logo como color de la marca (D149); modo claro por defecto y el oscuro detrás de un botón (D153).
> **Los tokens viven en `app/globals.css`**; este documento explica por qué son los que son.

---

## 1. El sentimiento como criterio

| Sentimiento | Qué lo produce en pantalla | Qué lo rompe |
|---|---|---|
| Seguridad | Un titular serif grande y quieto; una sola cosa por pantalla; el método en cuatro pasos numerados; cifras con fuente al pie | Efectos, contadores animados, más de un botón, un panel como héroe |
| Confianza | Personas reales trabajando (fotos de banco con licencia, sin arquetipo); "los sistemas operan hoy" dicho sin adjetivos; el precio explicado sin cifra | Logos, testimonios, superlativos, imagen generada |
| Alivio | Fondo cálido casi blanco, márgenes anchos, frase corta arriba, nada que grite; el cambio de idioma a la vista | Urgencia, cifras que compiten, texto denso |
| Calidez | La serif con contraste suave (Newsreader), fotos muy grandes de gente en su trabajo, la persona sonriendo antes de cualquier texto | Frío corporativo (gris y azul), neón, iconos de plataforma |
| "En buenas manos" | Todo lo anterior junto, y el cierre: "Lo que sigue para tu empresa, lo construimos contigo" | Decirlo en vez de mostrarlo |

El montañista es la referencia del sentimiento (alguien capaz te ayuda en un lugar difícil), no la imagen:
la persona sonriendo del recibimiento hace ese trabajo sin cresta ni atardecer.

## 2. Los cinco principios, como reglas que se pueden comprobar

1. **Lo mostrado antes que lo dicho.** Lo que da seguridad es verificable a la vista: el método (cuatro
   etapas con lo que pasa en cada una), las cifras con su fuente y las dos del operador solas, y desde el
   prompt de industrias las tendencias de cada industria con su fuente al pie. Prueba: ningún adjetivo de
   calidad en toda la casa (`grep` de "expertos", "líderes", "mejor", "vanguardia" en `messages/*.json` = 0;
   "un experto" solo dentro del botón, HQA-D148).

   > **Nota del 2026-09-08 (operador, HQA-D182).** El encabezado de la sección de las áreas dice "Áreas en
   > las que nos especializamos." y en inglés "Our areas of expertise.". "Nos especializamos" y "expertise"
   > dicen qué ES Osppy, que es la razón por la que el banco prohíbe "expertos" y "líderes" (*se dice qué se
   > hizo, no qué se es*) y por la que este principio pide cero adjetivos de calidad. El operador lo decidió
   > mirando el sitio vivo, con la objeción dicha antes de escribirlo, y eligió además "expertise" en inglés
   > sabiendo que la sesión recomendaba "Areas we specialize in.". Es la segunda excepción con fila, después
   > de "Habla con un experto" (D148), y no ensancha la regla: la prueba del `grep` sigue en cero para
   > "expertos", "líderes", "mejor" y "vanguardia" en `messages/*.json`, y el linter no cambia. Su nota
   > gemela vive en `../osppy-hq/business/marca/banco-prohibido.md`.

2. **Gente antes que abstracciones.** Catorce fotografías en la casa, todas con personas trabajando
   (recibimiento, quiénes somos, cómo trabajamos, las ocho áreas, lo que ya opera, hablemos); cero
   ilustraciones, cero pantallas de software como imagen. Prueba: cada `Photo` de `components/` apunta a una
   fila del manifiesto con persona.
3. **Calidez sin perder autoridad.** Serif editorial para titulares (Newsreader) y una sans clara para el
   cuerpo (Figtree); el negro y el azul del logo como únicos colores de marca (HQA-D149), el azul en dos
   tonos (brillante y profundo). Prueba: dos familias, un solo matiz de acento, ningún degradado (el velo del
   recibimiento es el único).
4. **Alivio.** La primera pantalla tiene cuatro palabras, un botón y una foto; ninguna cifra; ningún
   movimiento. Prueba: en `hero.tsx` hay un `h1` y un `a`, nada más.
5. **Nativa en IA sin parecerlo.** La palabra IA aparece en la frase del recibimiento y en la de la empresa;
   ningún elemento gráfico la representa. Prueba: cero iconografía en el contenido, cero brillo, cero red de
   nodos, cero robot, en código y en fotos; la foto de "Inteligencia artificial" es una persona con una
   herramienta de IA en pantalla (HQA-D158). **Los SVG en línea que sí existen y por qué:** el icono del logo
   (`Logo`), su O como marca de agua (`LogoRing`), la línea y las formas de fondo (`Ribbon`, `Shapes`) y, desde
   el 2026-09-08 (HQA-D158), el sol y la luna del botón de modo: es un control con `aria-label`, no
   decoración ni iconografía de contenido, y la regla de "cero iconografía" no lo alcanza.

   > **Nota del 2026-09-09 (operador, HQA-D182).** La frase de arriba que dice que la foto de "Inteligencia
   > artificial" es una persona con una herramienta de IA en pantalla ya no describe el sitio. El operador la
   > cambió mirando el sitio vivo, pidiendo algo más agentic, y con eso **reabrió D158** a sabiendas. Lo que
   > entró es `ia-operacion`, una persona frente a un muro de pantallas en una sala de operación: no existe
   > fotografía honesta de un agente, así que lo que se fotografía es una persona supervisando trabajo que ya
   > corre solo, que es la frase misma del área. **Lo demás del principio sigue en pie y no se tocó:** cero
   > robot, cero red de nodos, cero brillo, cero iconografía de IA. La sesión dejó dicho, y el operador
   > decidió igual, que a la foto elegida no se le ve la cara y que la pantalla curva del fondo lleva formas
   > abstractas que rozan esa frontera. De paso sale de la imagen la marca ChatGPT, que era otra empresa en
   > la pantalla.

## 3. El sistema

### 3.1 Color

Los colores de la marca son los del logo (`osppy-brand-export/osppy-icon-source.svg`): negro `#0A0F0E` y azul
`#2FC4D9` (HQA-D149). El azul brillante falla como texto sobre claro (2.0:1) y el blanco sobre él también
(2.1:1), así que el azul brillante va como **fondo de botón con texto negro** (9.2:1) y como **cifra sobre el
negro** (9.2:1) o sobre la banda (4.5:1, solo en tamaños grandes); el mismo matiz, profundo, es el texto de
enlace sobre claro (`#0C6F7E`, 5.3:1); y las bandas son un petróleo profundo del mismo matiz con texto blanco
(`#0F4C5C`, 9.5:1), no el azul brillante (D153, D154). El cobre salió (D149). Modo claro por defecto; el oscuro
es una opción detrás del botón de modo (D152, D153). Los roles son los que `scripts/check-contrast.mjs` mide
en los dos modos (medido el 2026-09-08 a las 16:35: todos por encima del mínimo).

| Rol (`:root`) | Utilidad | Claro | Oscuro | Uso |
|---|---|---|---|---|
| `--bg` | `lino` | `#F6F4EF` | `#0A0F0E` | fondo de la casa (17.6:1 y 19.3:1 con el texto) |
| `--surface` | `espuma` | `#E8EFF0` | `#16211F` | el bloque de precio |
| `--text` | `texto` | `#0A0F0E` | `#FFFFFF` | titulares y texto |
| `--text-2` | `texto-2` | `#45585C` | `#B8C6C9` | texto secundario (6.8:1 y 11.0:1) |
| `--accent` | `azul` | `#2FC4D9` | igual | botones, cifras sobre negro y sobre banda, puntos, foco |
| `--accent-text` | `azul-texto` | `#0C6F7E` | `#2FC4D9` | enlaces y cifras sobre el fondo (5.3:1 y 9.2:1) |
| `--primary-foreground` | `negro` | `#0A0F0E` | igual | texto sobre el azul (9.2:1) |
| `--band`, `--on-band`, `--on-band-2` | `profundo`, `sobre-profundo`, `sobre-profundo-2` | `#0F4C5C`, `#FFFFFF`, `#CFE3E8` | iguales | "Reimaginemos tu empresa", "Cómo ayudamos", la banda de cierre de las páginas de área (9.5:1 y 7.2:1) |
| `--dark`, `--on-dark`, `--on-dark-2` | `negro`, `sobre-negro`, `sobre-negro-2` | `#0A0F0E`, `#FFFFFF`, `#B8C6C9` | iguales | "Lo que dicen los datos" y el pie (19.3:1 y 11.0:1) |
| `--tint`, `--tint-2` | `tinte`, `tinte-2` | `#DCEBEE`, `#EFE6D6` | `#12211F`, `#1A1F1B` | las formas suaves detrás de las secciones claras |
| `--line` | `linea` | `#DCE3E4` | `#26312F` | reglas finas |

Las marcas de agua son la O del logo en el azul brillante a baja opacidad (0.35 en la banda, 0.22 y 0.16 en
"Cómo ayudamos", 0.14 y 0.09 sobre el negro): siempre detrás del texto y a una opacidad que deja el contraste
medido intacto (D150, D151, D157). El color de tema del navegador del teléfono es el negro de la marca (D157).

### 3.2 Tipografía

- **Titulares:** Newsreader (Google Fonts, variable con eje óptico), servida por `next/font` desde el propio
  sitio, respaldo Georgia y serif. Tamaños fluidos: `clamp(3.25rem, 9vw, 7.5rem)` el recibimiento,
  `clamp(2.75rem, 6.5vw, 5.25rem)` la banda, `clamp(2.5rem, 5.5vw, 4.25rem)` las secciones,
  `clamp(2rem, 3.5vw, 2.75rem)` las cifras. Interlínea 1.02, espaciado -0.02em.
- **Cuerpo:** Figtree (Google Fonts, variable), respaldo system-ui. 18 px el texto de las secciones, 23 a
  30 px la frase de la empresa, 14 px las fuentes de las cifras y el pie.
- **Medida:** ninguna columna de texto pasa de 56 caracteres; la frase, de 34.

### 3.3 Espacio, bandas y fondos

- Contenedor de 80rem con márgenes de 1.5rem (móvil) y 2.5rem (escritorio); retícula de doce columnas a
  partir de 1024 px. Cada sección respira 6rem (móvil) a 9rem (escritorio). Es el "mucho espacio" de D135.
- **Bandas, por decisión del operador (D149, D153, D154):** "Reimaginemos tu empresa" y "Cómo ayudamos" en el
  petróleo profundo con texto blanco y marcas de agua; "Lo que dicen los datos" y el pie en el negro de la
  marca con cifras en azul; el resto sobre el lino. Las páginas de área cierran con la banda profunda.
- **Fondos:** la línea gruesa (`Ribbon`) solo, tenue, detrás de los cuatro pasos (variante b, 0.22) y de
  "Hablemos" (variante a, 0.2); las formas suaves (`Shapes`) detrás de los bloques de la historia y de "Lo que
  ya opera". Nada de esto baja el contraste de un texto.
- **Regla de construcción:** `min-h` y `overflow-hidden` nunca en un `<section>`; van en un `div` adentro.
  Desde HQA-D149 tres secciones pintan su propia banda, y eso ahora está permitido: `check-sections.mjs` se
  reescribió a esta regla en la FASE 4 (§6). No es teoría: un `overflow-hidden` heredado apagó el panel
  pegajoso de "Cómo ayudamos" (HQA-D159).

### 3.4 Movimiento

Casi ninguno, a propósito: transición de color en botones y enlaces (150 ms), la foto del área que aparece
al pasar el cursor (opacidad, 500 ms), desplazamiento suave en las anclas; todo desaparece con
`prefers-reduced-motion`. Sin gsap, sin lenis, sin motion. **Excepción del 2026-09-08 (operador, HQA-D165):** las
cifras grandes (tendencias de industria, "Lo que dicen los datos", "Lo que ya opera") cuentan de cero a su valor al
entrar en pantalla (1.4 s, `components/cifra.tsx`, sin biblioteca); los años no cuentan; con reducción de movimiento
no hay conteo.

### 3.5 Imagen

- Solo fotografía real de banco con licencia (Unsplash y Pexels; ninguna Unsplash+), personas en lugares de
  trabajo reales; ninguna generada (el `hero.webp` de la v5 salió del manifiesto y de `public/photos/` en la FASE 4, con
  trece fotos más que ya no se renderizaban: el manifiesto tiene 21 filas y el sitio usa 21); ningún arquetipo (apretón de manos, robot, cerebro, holograma); nada de estética de IA (D158: la foto de
  "Inteligencia artificial" es una persona real con una herramienta de IA en pantalla).
- Las fotos son grandes y predominantes (D137, D151): el recibimiento a pantalla completa; "Nuestro
  propósito" y "Cómo trabajamos" a todo lo ancho; las ocho de "Cómo ayudamos" llenan la mitad derecha al pasar
  el cursor y abren su página de área a todo lo ancho. Radios de 1.25rem solo en las dos fotos enmarcadas
  ("Lo que ya opera", "Hablemos").
- Pipeline: `scripts/photos.manifest.json` (con `origen` por foto: banco, autor, id, licencia, fecha y
  decisión) → `optimize-photos.mjs` → `public/photos/*.webp` y `lib/photos.generated.ts` (con placeholder
  borroso). Lado largo 1600 para las enmarcadas y **2400 (`ladoLargo`) para las que van a sangre**. Alt en los
  dos idiomas desde el manifiesto.
- El día que exista fotografía propia de Osppy trabajando, entra por el mismo pipeline y sustituye una por
  una, empezando por el recibimiento.

### 3.6 Componentes mínimos

`Header` (icono y marca, cuatro anclas, botón de modo, cambio de idioma) · `Hero` · `Quienes` · `Metodo` ·
`Ayudamos` con `AreasHover` · `Datos` · `Real` · `Hablemos` · `Footer` · `Photo` (envoltura de `next/image`
por slug) · `Logo` (variantes `tile` y `glyph`) y `LogoRing` (la marca de agua) · `Ribbon` y `Shapes` ·
`ThemeToggle` (sol y luna, dos trazos en línea, `aria-label` y `aria-pressed`) · `Container`. Un botón (relleno
azul, texto negro, píldora), un estilo de enlace. Sin biblioteca de componentes (`lucide-react` sigue huérfana
y se decide en la FASE 4).

## 4. El prototipo

Construido en `app/[locale]/` y `components/` con el copy real de `messages/es.json` y `messages/en.json`,
los tokens de `app/globals.css` y las fotos del manifiesto; ocho páginas de área en `/es/<área>` y
`/en/<area>` (D152). Compila, pasa `lint`, las cuatro compuertas y las siete pruebas. Capturas contra el
servidor en `captures/v6/` (compuerta 3) y `captures/v6b/` (los tres arreglos de HQA-D158), carpetas ignoradas
por git. La pregunta para cada una es la del fundamento: **¿se siente en buenas manos, o qué lo rompe?**

Fotos por sección (el operador aprueba una por una, D137):

| Sección | Slug | Qué es | Fuente |
|---|---|---|---|
| Recibimiento | `recibimiento` | mujer sonriendo de pie en su oficina, su equipo detrás | Manuel Guillén Vega en Pexels, 15104303 (D148) |
| Quiénes somos | `quienes` | dos colegas conversan sobre un documento | Vitaly Gariev en Unsplash, 0iTp1WNlMGc |
| Cómo trabajamos | `asesoria` | cuatro personas frente a una laptop, riendo | Jud Mackrill en Unsplash, Of_m3hMsoAA |
| Estrategia | `capacitacion` | una sesión en una sala de juntas | Campaign Creators en Unsplash, gMsnXqILjp4 |
| Datos | `contabilidad` | una laptop con un panel de cifras | Carlos Muza en Unsplash, hpjSkU2UYSU |
| Inteligencia artificial | `ia-asistente` (A) o `ia-mesa` (B) | una persona con un asistente de IA abierto en su laptop | Matheus Bertelli en Pexels, 16094042 y 16094048 (D158, pendiente O) |
| Nube | `nube-racks` (A) o `nube-pasillo` (B) | una ingeniera con laptop en un centro de datos | Christina Morillo en Pexels, 1181341 y 1181316 (D158, pendiente O) |
| Sistemas | `proceso-escrito` | un diagrama en una libreta junto a una laptop | ThisisEngineering en Unsplash, YcO98VqQlnA |
| Experiencia | `ventas` | un equipo alrededor de una mesa con laptops | Annie Spratt en Unsplash, hCb3lIB8L8E |
| Producto digital | `producto-pared` (A) o `producto-codigo` (B) | bocetos de pantallas en la pared; dos desarrolladoras con código | Christina Morillo en Pexels, 1181487 y 1181263 (D158, pendiente O) |
| Planeación y entrega | `compras` | una persona con documentos frente a un tablero | Bluestonex en Unsplash, Li6MH3rfyPo |
| Lo que ya opera | `mantenimiento` | tres personas con una laptop en una línea de producción | ThisisEngineering en Unsplash, WjOWazUPAss |
| Hablemos | `hablemos` | dos mujeres conversan en un escritorio | Vitaly Gariev en Unsplash, aoweP90-XwM |

Las que salen con D158: `sistemas` (persona con laptop y tableta), `implementacion` (oficina grande) y
`calidad` (ingeniera en planta) dejan "Cómo ayudamos"; siguen en el manifiesto hasta la poda de la FASE 4.

> **Nota del 2026-09-09 (operador, HQA-D182).** Cinco filas de la tabla de arriba dejaron de ser ciertas el
> mismo día, y la tabla se queda escrita como se aprobó:
>
> - **Planeación y entrega** ya no es `compras` sino **`entrega-tablero`**, dos personas frente a una pared de
>   notas de trabajo (silverkblack en Pexels, 39219855). La anterior leía como punto de venta, y su alt
>   describía una escena que la foto no tenía.
> - **Experiencia** ya no es `ventas` sino **`experiencia-mostrador`**, un mostrador de recepción con alguien
>   atendiendo y alguien siendo atendida (Cedric Fauntleroy en Pexels, 4266932). La anterior leía como
>   coworking y no como la experiencia de un cliente.
> - **Inteligencia artificial** ya no es `ia-asistente` sino **`ia-operacion`** (This Is Engineering en
>   Pexels, 3862132), por la decisión que la nota del principio 5 recoge.
> - **Nube** sigue siendo `nube-racks` y la misma fotografía, pero **recortada**: la fila declara
>   `recorte { izquierda 0, arriba 0.40, ancho 0.69, alto 0.60 }` y el optimizador lo aplica antes de
>   reescalar, porque el operador pidió acercar y `object-position` mueve el encuadre sin acercar. El recorte
>   elegido es además el único de los cuatro que deja fuera el emblema de una marca de ropa que la camisa
>   lleva en el pecho.
>
> - **Estrategia** ya no es `capacitacion` sino **`estrategia-documentos`**, tres personas revisando gráficas
>   impresas (Vlada Karpovich en Pexels, 7433823). HQA-D174 había dejado abierto "el logo de Apple" de la
>   anterior; al medirlo resultaron **tres empresas y dos pantallas de software**, todas legibles ampliando el
>   archivo entregado: Apple en la laptop del fondo, DELL en la de abajo a la derecha, el nombre LA NUIT PORTE
>   CONSEIL impreso en las ocho bolsas de la mesa, y dos escritorios de Windows con sus iconos, que además
>   chocan con el principio 2. Ningún recorte lo arreglaba: las bolsas estaban por toda la mesa.
>
> Las cinco traen `origen` completo en `scripts/photos.manifest.json`, con las descartadas y su razón. La
> fila de **Datos** de la tabla tampoco es cierta desde HQA-D174, que reemplazó `contabilidad` por dos
> colegas revisando un reporte impreso; queda anotado aquí porque nadie lo anotó entonces. **Sigue abierta
> (O)** la placa en cirílico "ШР-ЖЗ ОТШМ-7 ТП33" de la fotografía de manufactura, legible y sin recorte
> posible porque está a la misma altura que la cabeza del operario: el operador decidió el 2026-09-09 dejarla
> para una sesión propia.

## 5. Dónde diverge de la guía §8 y de Instagram

Anotado para el operador; no se resuelve aquí (si la marca entera sigue al sitio, es otra fila).

- **Fondo.** El feed de Instagram es claro sobre marfil; el sitio usa un lino (`#F6F4EF`). Misma familia de
  calidez; no es el mismo valor.
- **La marca.** El sitio usa el icono del logo (el anillo y el punto en azul, sin su cuadro negro, D150) junto
  a "Osppy" en Newsreader, en el encabezado y el pie; el cuadro negro es el favicon (`app/icon.svg`). El glifo
  Tinta de Instagram (`../osppy-content/activos/osppy-glifo-tinta.svg`) es otro dibujo; el operador decide
  cuál gobierna la marca entera.
- **El azul.** El sitio usa el azul del logo como color de la marca (D149) en dos tonos, y un petróleo profundo
  del mismo matiz para las bandas (D153); la guía tenía el azul como "teal firma" con la regla de no usarlo
  como texto sobre claro (§12 don't 1), que el sitio respeta. El verde Petróleo de la guía y el cobre no
  aparecen en el sitio.
- **Tipografía.** Newsreader y Figtree son del sitio; Instagram y los decks siguen con lo que la guía §9
  dice. Fraunces no aparece en ningún lado.
- **Modo oscuro.** Es una opción del sitio (D152, D153); Instagram y los decks no lo tienen.

## 6. Las compuertas, con política (estado al 2026-09-08, cerrada la FASE 4)

- `check-contrast.mjs`: **hecho** (`4061752`): mide los roles de arriba en claro y en oscuro (el claro fundido
  bajo el oscuro, como la cascada); los modos hotel y panel de la v2 salieron con nota fechada.
- `check-copy.mjs`: **hecho** (`4061752`, ampliado en `1e23ee2`): `METADATA_FILES` nombra
  `app/[locale]/layout.tsx`, `page.tsx`, `opengraph-image.tsx`, `[area]/page.tsx` y
  `[area]/[industria]/page.tsx`. Las 24 cifras de industria y las tres de la casa están en
  `scripts/copy-allow.json` con su enlace y la fecha en que se leyeron.
- `check-sections.mjs`: **decidido y reescrito** en la FASE 4. La regla de la v2 ("ninguna sección pinta su
  propia banda") era falsa aquí desde D149 y D154, y no se obedeció a ciegas ni se borró en silencio: el
  script comprueba ahora la regla del §3.3 (una `<section>` no recorta ni fija su altura), que es la que un
  defecto real probó (D159). Se verificó que muerde: una sección con `overflow-hidden` o `min-h-*` lo hace
  salir con código 1.
- `capture.mjs`: **afinado** en la FASE 4, con nota fechada en la medición. Su conteo de elementos ocultos bajo
  reducción de movimiento venía de los reveals de la v2; este sitio no tiene reveals, pero sí ocho pistas
  ("Ver cómo ayudamos") que descansan en opacidad 0 y aparecen al pasar el cursor o al enfocar. Un elemento que
  declara las dos revelaciones es una afordancia y no cuenta; el que solo declara la del cursor sigue contando,
  porque un lector con teclado nunca lo vería. Sus rutas por defecto son las de la v6, no las borradas de la v5.
- `tests/casa.spec.ts`: **ocho pruebas** (`4061752`, `e5729d2`): los tiempos en orden, un solo llamado a la
  acción, las tres redirecciones, nada del banco en el HTML de los dos idiomas, el cambio de idioma, la
  reducción de movimiento, el modo oscuro, y la tarjeta de industria que abre su página con el ratón.
- `photos.manifest.json`: **podado** en la FASE 4 a las 21 fotos que la v6 renderiza; catorce filas salieron
  con su `.webp`, entre ellas `hero`, la única generada con un modelo. El campo `_` ya no admite ninguna.

---

*Sitio v6 · 02 · Sistema visual · 2026-09-08 · reescrito a las 16:40 con el sistema del prototipo en vivo ·
compuerta 3 cerrada esa noche · el criterio de aceptación fue el sentimiento, no un número.*
