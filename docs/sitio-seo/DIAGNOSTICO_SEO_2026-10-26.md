# Diagnóstico SEO: datos estructurados y enlazado interno (26-oct-2026)

**Estado:** S1 a S5 aprobados e implementados el 26-oct-2026 (enriquecimiento en `apps/web/src/lib/seo.ts`, función `enriquecerGrafo`; logo nuevo en `apps/web/public/logos/isotipo-oliva.png`). E1 a E7 aprobados e implementados el 26-oct-2026: menú del header (`MenuDesplegable`, `lib/enlaces.ts`), bloques «Sigue con» (`SigueCon`, por página en `SIGUE_CON`), siglas al glosario, línea de confianza, tarjetas con ancla limpia (estas tres en `post-proceso` de `scripts/wireframes-a-tsx.py`, función `enlazar`, para que regenerar no las pierda) y `TerminosClave` en el Home y los hubs.

Hecho rastreando el HTML de producción (`frilo.dev`, 22 páginas: las 21 del sitemap más la landing de pauta). **No se cambió nada en el sitio.** Pendiente de aprobación de Nicolás, por número.

## 1. Datos estructurados

**Hoy:** Organization + WebSite + Person en todas las páginas; BreadcrumbList en las 21; FAQPage en 13 páginas (Home, 4 calculadoras, 7 guías, /dolar-hoy: 3 a 7 preguntas cada una, iguales al texto visible); Article en 6 guías; WebApplication + Offer en 4 calculadoras; Dataset en /dolar-hoy; DefinedTermSet en /glosario; ItemList en hubs y en la guía de cuentas (con DepositAccount); AboutPage en /quienes-somos.

**Aclaración sobre FAQ:** desde agosto de 2023 Google solo muestra el resultado enriquecido de FAQ a sitios de gobierno y de salud. Nuestras 13 FAQPage son correctas y se mantienen (ayudan a entender la página y a que otros buscadores/asistentes extraigan respuestas), pero no darán un cambio visible en Google. No vale la pena invertir más ahí.

| # | Qué | Por qué | Esfuerzo | Prioridad |
|---|---|---|---|---|
| S1 | **Arreglar el logo de Organization.** `https://frilo.dev/logos/isotipo-oliva.png` da 404 en las 21 páginas (solo existe el .svg). | Es la señal para el logo en resultados y el panel de marca; hoy está rota. | Bajo | Alta (error) |
| S2 | Enriquecer Person (Nicolás): `description`, `knowsAbout` (SEO, marketing de contenidos, finanzas personales para independientes), `worksFor` Frilo; en Organization `founder` → Person y `contactPoint` (correo público). | E-E-A-T para contenido financiero, con datos que ya están en /quienes-somos. Sin `sameAs` (no hay redes). | Bajo | Media |
| S3 | Conectar entidades: `breadcrumb` de cada WebPage → su BreadcrumbList; `about`/`mentions` de guías y calculadoras → los términos del glosario (IBC, PILA, ARL, FSP). | Refuerza el grafo de conocimiento y el vínculo guía ↔ glosario. | Medio | Media |
| S4 | `ProfilePage` para /quienes-somos (mainEntity Person). | Página de autor reconocible para Google. | Bajo | Baja |
| S5 | Completar WebApplication (`featureList`, `description`) y Dataset (`keywords`, `spatialCoverage` Colombia). | Descripción más precisa. Sin rating: no inventamos reseñas. | Bajo | Baja |

**Descartados:** HowTo (retirado por Google), Review/AggregateRating (no hay reseñas reales), SearchAction (no hay buscador), Speakable/Event/Video (no aplican). SoftwareApplication como resultado enriquecido exige calificaciones, así que no es elegible; se deja como está.

## 2. Enlazado interno

**Hallazgos:**
- Cero huérfanas. Todo el contenido está a 1 o 2 clics del Home. El pie de página enlaza 15 páginas en cada URL; el encabezado, 4 (Calculadoras, Dólar hoy, Guías, Cuentas que rinden); el cuerpo del Home, 12.
- El reporte de GSC con "solo el Home" probablemente refleja que Google aún no rastreó las demás: ese reporte cuenta solo enlaces vistos desde páginas ya rastreadas. No es un fallo del código. Solicitar indexación de las URL clave acelera que aparezcan.
- Aun así hay debilidades reales (abajo).

Enlaces entrantes desde el **cuerpo** de otras páginas (sin contar pie ni encabezado):

| Página | Entrantes en cuerpo |
|---|---|
| Calculadora de aportes | 14 |
| Cuentas de ahorro (guía) | 9 |
| Descargar planilla (guía) | 7 |
| Dólar hoy | 6 |
| Fecha de pago | 6 |
| IBC (guía) | 6 |
| Cesantías (calculadora) | 5 |
| Interés compuesto | 5 |
| Cuenta en dólares / Recibir pagos / Cesantías independientes (guías) | 4 cada una |
| /glosario/sln, /quienes-somos, /metodologia | 3 |
| /transparencia | 2 |
| **/glosario** | **1** |

| # | Oportunidad | Detalle | Esfuerzo | Prioridad |
|---|---|---|---|---|
| E1 | Menú del encabezado con las calculadoras y guías principales | Hoy las 4 calculadoras y las guías solo están en el pie. Un menú desplegable "Calculadoras" (aportes, cesantías, fecha de pago, interés compuesto) y "Guías" (IBC, planilla, cesantías, dólares) las enlaza prominente desde todas las páginas. | Medio | Alta |
| E2 | Bloques "Sigue con" al final de cada guía y calculadora (3 enlaces del mismo tema) | Racimos: **Planilla** (aportes, IBC, fecha de pago, descargar planilla, glosario) · **Prima y cesantías** (cesantías calc, interés compuesto, cesantías independientes, cuentas) · **Dólar** (dólar hoy, cuenta en dólares, recibir pagos, cuentas). Sube las entrantes de las páginas con 4 a 6. | Medio | Alta |
| E3 | Enlazar al glosario desde la primera mención de IBC, PILA, ARL, FSP y SLN | El glosario tiene 1 entrante en cuerpo y los términos aparecen en casi todas las guías sin enlace. Ancla `#ibc`, `#pila`… | Bajo | Alta |
| E4 | Enlazar la línea "Escrito y revisado por Nicolás Suárez" a /quienes-somos y "Cómo calculamos" a /metodologia en todas las páginas | En las páginas que salen de los wireframes ese texto no lleva enlace (solo lo tiene el componente de las páginas de texto). Mejora el E-E-A-T y sube las entrantes de las páginas de confianza. | Bajo | Media |
| E5 | Enlaces específicos faltantes | Calculadora de cesantías: añadirla en IBC (guía), fecha de pago, descargar planilla y dólar hoy. Interés compuesto: en dólar hoy y cuenta en dólares. Cuenta en dólares: enlazarla desde el Home (hoy no está), la calculadora de aportes y el hub. | Bajo | Media |
| E6 | Anclas limpias en las tarjetas | Muchas tarjetas envuelven título + descripción en el mismo `<a>` y el ancla queda larga ("Calculadora de aportes para independientes 2026Salud, pensión…"). Dejar solo el título como texto del enlace. | Bajo | Baja |
| E7 | Enlazar /glosario desde el Home y desde los hubs /guias y /calculadoras | Dar entrada al glosario fuera del pie. | Bajo | Media |

Sin tocar: la landing de pauta (/lp) es aislada a propósito; los legales reciben 12 enlaces por los banners de registro, sin problema.
