# Sitio v6 · 02 · Sistema visual

> **Fecha: 2026-09-08.** Repo del sitio, `docs/`. Español (HQA-D3). **Estado: borrador para la compuerta 3.**
> **Qué es:** el sentimiento como criterio, los cinco principios del fundamento §9 como reglas verificables,
> el sistema (color, tipografía, espacio, movimiento, imagen, componentes), el prototipo con el copy real y
> sus capturas, y dónde diverge de la guía §8 y de Instagram.
> **Brief:** el fundamento §9 y nada más (prompt §6); persona y aire (HQA-D135); el fundador no aparece
> (D136); muchas fotos reales, ninguna generada, slalom.com como referencia de proporción (D137); modo
> claro; ni brillos, ni redes, ni robots, ni panel como héroe.
> **Los tokens viven en `app/globals.css`**; este documento explica por qué son los que son.

---

## 1. El sentimiento como criterio

| Sentimiento | Qué lo produce en pantalla | Qué lo rompe |
|---|---|---|
| Seguridad | Un titular serif grande y quieto; una sola cosa por pantalla; el método en cuatro pasos numerados; cifras con fuente al pie | Efectos, contadores animados, más de un botón, un panel como héroe |
| Confianza | Personas reales trabajando (fotos de banco con licencia, sin arquetipo); "los sistemas operan hoy" dicho sin adjetivos; el precio explicado sin cifra | Logos, testimonios, "expertos", superlativos, imagen generada |
| Alivio | Fondo cálido casi blanco (Lino), márgenes anchos, frase corta arriba, nada que grite; el cambio de idioma a la vista | Urgencia, cifras que compiten, atmósfera oscura, texto denso |
| Calidez | La serif con contraste suave (Newsreader), el cobre en pequeñas dosis, la foto de una persona sonriendo antes de cualquier texto | Frío corporativo (gris y azul), neón, iconos de plataforma |
| "En buenas manos" | Todo lo anterior junto, y el cierre: "Lo que sigue para tu empresa, lo construimos contigo" | Decirlo en vez de mostrarlo |

El montañista es la referencia del sentimiento (alguien capaz te ayuda en un lugar difícil), no la imagen:
la persona sonriendo del recibimiento hace ese trabajo sin cresta ni atardecer.

## 2. Los cinco principios, como reglas que se pueden comprobar

1. **Lo mostrado antes que lo dicho.** Lo que da seguridad es verificable a la vista: el método (cuatro
   etapas con lo que pasa en cada una), lo construido (nueve tipos de trabajo atestiguados, FDV §11.12),
   las cifras con su fuente y las dos del operador solas. Prueba: ningún adjetivo de calidad en toda la
   casa (`grep` de "expertos", "líderes", "mejor", "vanguardia" en `messages/*.json` = 0).
2. **Gente antes que abstracciones.** Seis fotografías, todas con personas trabajando (recibimiento,
   quiénes somos, método, cómo ayudamos, lo que ya opera, hablemos); cero ilustraciones, cero iconos, cero
   pantallas de software como imagen. Prueba: `grep -c "<svg"` en `components/` = 0.
3. **Calidez sin perder autoridad.** Serif editorial para titulares (Newsreader) y una sans clara para el
   cuerpo (Figtree); Tinta (`#1C2B33`) como texto, no negro; el verde Petróleo como único color de acción;
   cobre solo en etiquetas pequeñas y en los puntos de las listas. Prueba: dos familias, tres colores con
   nombre además del texto, ningún degradado.
4. **Alivio.** La primera pantalla tiene cuatro palabras, un botón y una foto; ninguna cifra; ningún
   movimiento. Prueba: en `hero.tsx` hay un `h1` y un `a`, nada más.
5. **Nativa en IA sin parecerlo.** La palabra IA aparece en la frase del recibimiento y en la de la
   empresa; ningún elemento gráfico la representa. Prueba: cero iconografía, cero "brillo", cero red de
   nodos, cero robot, en código y en fotos.

## 3. El sistema

### 3.1 Color

Modo claro, único. No hay modo oscuro: la atmósfera oscura es lo que tuvieron las cinco versiones
anteriores (fundamento §9) y el brief pide aire y calidez. Los roles son los que `check-contrast.mjs` mide;
los nombres de utilidad (Tailwind) son los de la casa.

| Rol (`:root`) | Utilidad | Valor | Uso |
|---|---|---|---|
| `--bg` | `lino` | `#FAF7F1` | fondo de toda la casa |
| `--surface` | `arena` | `#F1EBE1` | el bloque de precio, y nada más |
| `--text` | `tinta` | `#1C2B33` | titulares y texto principal (el mismo Tinta del glifo) |
| `--text-2` | `humo` | `#4B5A62` | texto secundario |
| `--accent` | `petroleo` | `#175E58` | el botón |
| `--accent-text` | `petroleo-texto` | `#145550` | enlaces y cifras grandes |
| `--primary-foreground` | `blanco` | `#FFFFFF` | texto sobre el botón |
| `--warm` | `cobre` | `#C46A3E` | puntos de lista (decorativo) |
| `--warm-text` | `cobre-texto` | `#9C4A22` | etiquetas pequeñas y números de etapa |
| `--line` | `linea` | `#E3DBCD` | reglas finas |

Contraste medido (WCAG, el 2026-09-08): texto sobre fondo 13.61:1 · texto secundario sobre fondo 6.68:1 ·
texto sobre arena 12.28:1 · secundario sobre arena 6.03:1 · enlace sobre fondo 8.03:1 · enlace sobre arena
7.24:1 · cobre texto sobre fondo 5.75:1 · cobre decorativo sobre fondo 3.58:1 · blanco sobre el botón
7.56:1. Todos por encima del mínimo (4.5:1 texto, 3:1 decorativo).

### 3.2 Tipografía

- **Titulares:** Newsreader (Google Fonts, variable con eje óptico), servida por `next/font` desde el
  propio sitio, respaldo Georgia y serif. Tamaños fluidos: `clamp(3rem, 7vw, 5.5rem)` el recibimiento,
  `clamp(2.5rem, 5.5vw, 4.25rem)` las secciones, `clamp(2rem, 3.5vw, 2.75rem)` las cifras. Interlínea
  1.02, espaciado -0.02em.
- **Cuerpo:** Figtree (Google Fonts, variable), respaldo system-ui. 18 px el texto de las secciones,
  21 a 27 px la frase de la empresa, 14 px las fuentes de las cifras y el pie.
- **Medida:** ninguna columna de texto pasa de 56 caracteres; la frase, de 34.
- Guía §12 don't 3 (Fraunces) respetado por no usarse.

### 3.3 Espacio y retícula

- Contenedor de 80rem con márgenes de 1.5rem (móvil) y 2.5rem (escritorio); retícula de doce columnas a
  partir de 768 px; el recibimiento parte en 5 y 7 a partir de 1024 px, con la foto sangrando al borde
  derecho.
- Cada sección respira 6rem (móvil) a 9rem (escritorio) arriba y abajo. Es el "mucho espacio" de D135.
- Reglas finas (`linea`) separan bloques dentro de una sección; ninguna sección pinta su propia banda
  (eso deja `check-sections.mjs` en pie, ver §6).

### 3.4 Movimiento

Casi ninguno, a propósito: transición de color en botones y enlaces (150 ms), desplazamiento suave en las
anclas, y las dos cosas desaparecen con `prefers-reduced-motion`. Sin gsap, sin lenis, sin motion: nada en
la casa se gana un efecto todavía; si una foto o una cifra lo justifica en la compuerta 3, se agrega con su
razón.

### 3.5 Imagen

- Solo fotografía real de banco con licencia (Unsplash, Pexels), personas en lugares de trabajo reales;
  ninguna generada (el `hero.webp` de la v5 no se renderiza y sale del manifiesto en la FASE 4); ningún
  arquetipo (apretón de manos, robot, cerebro, holograma).
- Una foto por sección salvo "Lo que dicen los datos" (solo cifras). Radios de 1.25rem; la del
  recibimiento sin radio y a sangre.
- Pipeline: `scripts/photos.manifest.json` → `optimize-photos.mjs` → `public/photos/*.webp` (lado largo
  1600) y `lib/photos.generated.ts` (con placeholder borroso). Alt en los dos idiomas desde el manifiesto.
- El día que exista fotografía propia de Osppy trabajando, entra por el mismo pipeline y sustituye una
  por una, empezando por el recibimiento.

### 3.6 Componentes mínimos

Header (marca, cuatro anclas, cambio de idioma) · Hero · Quienes · Metodo · Ayudamos · Datos · Real ·
Hablemos · Footer · Photo (envoltura de `next/image` por slug) · Container. Un botón (relleno Petróleo,
píldora), un estilo de enlace, un estilo de etiqueta. Sin biblioteca de componentes.

## 4. El prototipo

Construido en `app/[locale]/` y `components/` con el copy real de `messages/es.json` y `messages/en.json`,
los tokens de `app/globals.css` y seis fotos del manifiesto (recibimiento, quienes, asesoria, calidad,
mantenimiento, hablemos). Compila (`npm run build`) y pasa `lint`; la compuerta de copy da cero fallas en
los dos idiomas (las nueve que reporta hoy son archivos de la v5 en su lista de metadatos, FASE 4).

Capturas contra `npm run start`, en `captures/v6/` (carpeta ignorada por git): `es-light-360.png`,
`es-light-768.png`, `es-light-1024.png`, `es-light-1440.png` y las cuatro de `en`. La pregunta para cada
una es la del fundamento: **¿se siente en buenas manos, o qué lo rompe?**

Fotos que el operador aprueba una por una (D137), por sección:

| Sección | Slug | Qué es | Fuente |
|---|---|---|---|
| Recibimiento | `recibimiento` | mujer sonriendo en su escritorio, pared de ladrillo claro | Mailchimp en Unsplash, M7HM8VgYxW4 |
| Quiénes somos | `quienes` | dos colegas conversan sobre un documento | Vitaly Gariev en Unsplash, 0iTp1WNlMGc |
| Cómo trabajamos | `asesoria` | cuatro personas frente a una laptop, riendo | Jud Mackrill en Unsplash, Of_m3hMsoAA |
| Cómo ayudamos | `calidad` | ingeniera con laptop en una planta | ThisisEngineering en Unsplash, ZPeXrWxOjRQ |
| Lo que ya opera | `mantenimiento` | tres personas con una laptop en una línea de producción | ThisisEngineering en Unsplash, WjOWazUPAss |
| Hablemos | `hablemos` | dos mujeres conversan en un escritorio | Vitaly Gariev en Unsplash, aoweP90-XwM |

## 5. Dónde diverge de la guía §8 y de Instagram

Anotado para el operador; no se resuelve aquí (si la marca entera sigue al sitio, es otra fila).

- **Fondo.** El feed de Instagram es claro sobre marfil; el sitio usa Lino (`#FAF7F1`), un marfil más
  neutro. Misma familia de calidez; no es el mismo valor.
- **La marca.** El sitio escribe "Osppy" en Newsreader; el glifo Tinta (`../osppy-content/activos/
  osppy-glifo-tinta.svg`) no aparece todavía. Entra el día que el operador lo decida, como favicon y en
  el pie.
- **El verde.** El Petróleo del sitio (`#175E58`) es un verde azulado profundo elegido por contraste y
  calidez; no es el hex de la guía (§8 no se leyó, por instrucción). Si el operador quiere un solo
  Petróleo para todo, el token cambia en una línea.
- **Tipografía.** Newsreader y Figtree son del sitio; Instagram y los decks siguen con lo que la guía §9
  dice. Fraunces no aparece en ningún lado.
- **Cobre.** La guía lo dosifica "una vez por slide"; en el sitio es un color de etiqueta y de puntos de
  lista, en pequeño, varias veces por pantalla.

## 6. Lo que la FASE 4 decide sobre las compuertas (adelantado aquí)

- `check-contrast.mjs`: mide los roles de arriba; hoy exige también un `[data-theme="dark"]` que no existe
  y fallaría por "token ausente". Decisión propuesta: quitar los modos oscuro, hotel y panel del script
  con nota fechada, y dejar los pares de la luz.
- `check-sections.mjs`: la regla "ninguna sección pinta su propia banda" coincide con este sistema; se
  queda con nota fechada. El bloque de precio pinta arena, pero es un `div` dentro de la sección.
- `check-copy.mjs`: `METADATA_FILES` a `app/[locale]/layout.tsx`, `page.tsx` y `opengraph-image.tsx`.
- `playwright.config.ts`: `/es` existe otra vez; `tests/` se escribe.

---

*Sitio v6 · 02 · Sistema visual · 2026-09-08 · borrador para la compuerta 3 · el criterio de aceptación
es el sentimiento, no un número.*
