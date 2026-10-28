# Auditoría UX móvil de frilo.dev — 28-oct-2026

**Alcance:** las 21 páginas del sitemap en producción, medidas con anchos de iPhone (390 y 375) y Samsung (360 y 412). Se midió el DOM real (desborde horizontal, tamaños táctiles, texto, campos) y se revisó el Home en pantalla. **Estado: U1–U9 implementados el mismo día** (ver «Implementado» al final). Pendiente: ejecutar en un teléfono real y con VoiceOver/TalkBack lo que aquí no se puede medir.

## Hallazgos priorizados

| # | Hallazgo | Dónde | Impacto | Esfuerzo |
|---|---|---|---|---|
| U1 | **La página se ensancha y se puede arrastrar de lado.** Un texto solo para lectores de pantalla (`position:absolute`) dentro de la tabla de cuentas escapa del contenedor con scroll y estira el documento a 905 px en un teléfono de 360. Arreglo: `position:relative` en el contenedor de la tabla. | `/guias/cuentas-de-ahorro-alto-rendimiento` (y cualquier página con `TablaCuentas`) | Alto | Bajo |
| U2 | **Desborde de 25 px en el Home** en pantallas de 388 px o menos (todo Samsung de 360 y iPhone SE/mini de 375): `minmax(340px,1fr)` y `minmax(320px,1fr)` más el relleno de la página no caben. Arreglo: `minmax(min(340px,100%),1fr)`. Hay 22 reglas `minmax` con anchos fijos que conviene revisar. | Home (hero y pasos «01 · Aportes») | Alto | Bajo |
| U3 | **Los campos de formulario miden 13,3 px** (tamaño por defecto del navegador). iOS Safari hace zoom automático al tocarlos y deja la página ampliada. Deben ser de 16 px o más. | Todas las calculadoras, alerta del dólar, registro | Alto | Bajo |
| U4 | **La calculadora queda a 1.220 px del inicio** en `/calculadoras/aportes-independientes`: con una pantalla de 800 px hay que bajar más de una pantalla y media. El encabezado ocupa 250 px (logo, dos filas de menú y botones apilados, sin menú hamburguesa) y el hero lo sigue. | Calculadoras y Home | Alto | Medio |
| U5 | **El aviso de cookies tapa entre el 21 % y el 35 % de la pantalla** (166 a 308 px), con el mismo fondo oliva del hero: se confunde con la página. Sigue ahí hasta que se responde. | Todas | Medio | Bajo |
| U6 | **Enlaces con área táctil menor a 44 px**: pie de página (38 px de alto), enlaces dentro de los bloques «Sigue con» (19 a 27 px de alto), «metodología · transparencia · quiénes somos», migas de pan. 20 a 33 elementos por página. | Todas | Medio | Bajo |
| U7 | **Texto de 12 a 13 px** en notas, etiquetas y avisos del Home (21 elementos), incluido «COP/USD» y «Rechazar» a 13,3 px. | Home y calculadoras | Medio | Bajo |
| U8 | **Hero del Home con el logo grande repetido**, que ocupa unos 150 px de pantalla antes del título, y el `h1` de la página es «Frilo» (texto de 30 px) mientras el título real, «Calculadoras gratis para independientes…», es un `h2`. Es un problema de jerarquía para usuarios de lector de pantalla y para SEO. | Home | Medio | Bajo |
| U9 | **Páginas muy largas en móvil** (17.421 px el Home, 15.761 px la calculadora de aportes, 11.000 a 12.000 px varias guías). El índice «En esta página» queda a 4.215 px en la calculadora. En móvil conviene plegarlo y subir el resultado. | Home, calculadoras, guías | Medio | Medio |

## Lo que está bien
- Etiqueta `viewport` correcta en todas las páginas.
- Ninguna página, salvo U1 y U2, se desborda en 360 px: calculadora de aportes, cesantías, interés compuesto, dólar hoy y guías de dólares miden 360 px exactos.
- Las tablas anchas (interés compuesto, cuentas) ya van dentro de un contenedor con desplazamiento.
- El menú desplegable nuevo funciona con toque, y los botones principales y campos miden 44 a 52 px de alto.

## Orden sugerido
1. U1, U2, U3 (corrigen fallos reales; cambios pequeños).
2. U5, U6, U7 (ajustes de CSS).
3. U8 y U4 (hero y encabezado del Home y de las calculadoras, con un borrador visual).
4. U9 (estructura de páginas largas).

## Implementado (28-oct-2026)
- **U1** `TablaCuentas` y los contenedores con scroll llevan `position: relative`; el texto oculto usa la clase `sr-only`.
- **U2** El generador (`ajustes_moviles` en `scripts/wireframes-a-tsx.py`) convierte `minmax(Npx, 1fr)` en `minmax(min(Npx, 100%), 1fr)`.
- **U3** `font: 600 18px/1 inherit` era inválido; se expandió a propiedades sueltas en CSS, generador y componentes (hay una prueba que lo impide).
- **U4** Encabezado plegable en móvil (`EncabezadoMovil`): 60 px en vez de 250. Títulos y entradillas más compactos en móvil: la calculadora de aportes baja de 1.220 px a unos 975 px.
- **U5** Aviso de cookies más compacto en móvil (borde manzana, botones a todo el ancho).
- **U6** Pie, «Sigue con», migas y enlaces sueltos con 44 px de alto.
- **U7** Texto mínimo de 14 px (generador y CSS).
- **U8** Se oculta en móvil el logo grande repetido del Home. El `h1` sigue siendo «Frilo», como en la especificación SEO (decisión pendiente: ver informe al usuario).
- **U9** «En esta página» pasa a una fila con desplazamiento en móvil (58 px en vez de ~330 px).
- Extra: control de ingreso (barra y botones ±) en la calculadora de aportes, el hero del Home, cesantías (salario e ingreso) y la guía de cesantías; campo de plazo del interés compuesto; selectores sin texto cortado.
