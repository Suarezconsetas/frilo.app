# Especificación SEO del sitio Frilo (v2.1)

v2.1 del 19-10-2026: incorpora el brief SEO v3 (Drive, carpeta del proyecto) con P10 (interés compuesto), P11 (cuentas de ahorro de alto rendimiento, reemplaza la comparativa /ahorro/…) y los cambios de P12.

Implementa el `Brief_SEO_wireframes_Frilo.md` (v2, 19-10-2026) sobre el lienzo "Frilo — Sitio web (wireframes)". Este documento es lo que se lleva al código: metadatos, datos estructurados, enlaces internos, reglas técnicas y la capa de afiliados.

- Versión: v2 del 19-10-2026.
- Stack previsto: Next.js en Vercel, contenido en MDX dentro del repositorio.
- Todo lo marcado `[VERIFICAR]` sigue siendo un marcador: no publicar sin validar contra la fuente oficial.

---

## 1. Decisiones de esta versión

| Tema | Decisión | Motivo |
|---|---|---|
| CTA del header | Botón "Probar la app gratis" con degradé manzana → `#2FB35E` y texto oliva, en todas las páginas, junto a "Entrar". Repetido en el footer y en el cierre de la Home. | Pedido explícito. Contraste del texto oliva ≥ 4,7:1 en el extremo más oscuro del degradé. |
| Header y footer | Pasan a ser componentes únicos (`Header.dc.html`, `Footer.dc.html`). | Un cambio de CTA o de enlaces se hace una sola vez. En Next.js: `components/Header.tsx` y `components/Footer.tsx`. |
| Dólar programático | Descartado. `/dolar-hoy` es una sola página con la tabla de los últimos 30 días en texto, sin enlaces a páginas por fecha. | El almacenamiento no es el riesgo (una TRM por día pesa casi nada y puede leerse de datos.gov.co con caché de 24 h). El riesgo es SEO: cientos de páginas casi iguales se leen como contenido escaso. |
| Cuentas que rinden | Componente `BannerRendimiento` con 5 variantes y una página nueva de comparativa: `/guias/cuentas-de-ahorro-alto-rendimiento`. **Por ahora sin afiliados** (decisión del 19-10-2026): los enlaces van a la página oficial de cada banco con `rel="noopener"` y el aviso dice "Frilo no recibe pagos de estas entidades". | Frilo es un producto nuevo y aún no hay conversaciones con los bancos. La estructura queda lista para convertirse en referidos más adelante. |
| Hosting | Vercel Hobby solo permite uso personal no comercial. Sin afiliados ni publicidad, el sitio cabe en el plan gratis. | Cuando se firme el primer acuerdo de referidos o se agregue publicidad: pasar a Vercel Pro (USD 20/mes) o publicar el sitio de contenido en un hosting que permita uso comercial gratis (por ejemplo Cloudflare Pages). |

---

## 2. Reglas técnicas globales

### URLs e indexación

- Dominio canónico: `https://frilo.dev`. Rutas sin barra final; la variante con barra redirige con 301.
- **Decidido (20-10-2026):** la app pasa a `https://app.frilo.dev` con `noindex, nofollow` (meta y `X-Robots-Tag`), `robots.txt` con `Disallow: /` y fuera del sitemap. Todos los CTA apuntan ahí. El cambio de dominio se hace solo en la publicación manual (brief, sección 9).
- Inventario de URLs, metadatos, JSON-LD y keyword objetivo de cada página: `URLs_SEO_sitio_Frilo.xlsx`.
- `/lp/*` (pauta): `noindex, follow`, fuera del sitemap, sin header de navegación.
- Cada página indexable lleva `<link rel="canonical">` absoluto a sí misma.
- `<html lang="es-CO">` y `og:locale = es_CO`.

### robots.txt

```txt
User-agent: *
Disallow: /lp/
Disallow: /app/
Disallow: /api/

Sitemap: https://frilo.dev/sitemap.xml
```

No bloquear GPTBot, ClaudeBot, PerplexityBot ni Google-Extended: la visibilidad en buscadores con IA es parte de la estrategia GEO.

### sitemap.xml

Generado en build (`app/sitemap.ts`). Incluye Home, los 3 hubs, P01–P09, la guía de cesantías y la comparativa de cuentas. `lastmod` = fecha real de la última edición del contenido (la misma que se muestra en la página), no la fecha del build.

### Renderizado

- Las calculadoras se renderizan en el servidor con un ejemplo por defecto (ingreso de $8.000.000), así el HTML inicial ya trae una respuesta completa. Este es justo el punto débil de Compensar: su calculadora depende de JavaScript y la tabla aparece vacía.
- Páginas estáticas (SSG). `/dolar-hoy` se regenera una vez al día (`revalidate: 86400`) leyendo la API de datos.gov.co. No guarda nada en Supabase.

### Metadatos base (todas las páginas)

- `title` y `meta description` según la sección 4.
- Open Graph: `og:title`, `og:description`, `og:url`, `og:type` (`website` en herramientas y hubs, `article` en guías) y `og:image` de 1200×630. Una imagen por plantilla con el H1 sobreimpreso, generada con `next/og`.
- `twitter:card = summary_large_image`.
- `meta robots`: `index, follow, max-image-preview:large, max-snippet:-1`.

### llms.txt

Publicar `https://frilo.dev/llms.txt` con una línea por página clave (título, URL y una frase de qué responde). Los asistentes lo usan para entender el sitio rápido.

---

## 3. Estructura de contenido SEO/GEO (aplica a todas las plantillas)

Ya aplicada en los wireframes:

1. **Respuesta directa bajo el H1.** 40 a 60 palabras con la keyword principal y la respuesta concreta (fórmula, cifra o pasos), no solo una invitación a usar la herramienta. En herramientas es el lead; en guías, la caja "La respuesta corta"; en el glosario, la primera oración con la sigla en negrita.
2. **Línea de confianza (E-E-A-T).** Autor, revisor, fecha de actualización visible y enlace a "Cómo calculamos" o "Cómo hacemos nuestras guías". Ninguno de los competidores revisados muestra autor ni fecha.
3. **H2 con forma de pregunta o con la variante de la keyword**, uno por intención.
4. **Formatos alternados:** prosa, tabla con `<caption>`, pasos numerados (`<ol>`) y un ejemplo desarrollado con cifras.
5. **Preguntas frecuentes visibles** con `<details>`. El JSON-LD FAQPage solo puede contener las preguntas que se ven en la página.
6. **Fuentes oficiales enlazadas (E-E-A-T y GEO).** Cada dato normativo o de tasas enlaza a su fuente de gobierno en el mismo párrafo donde se usa, y cada página cierra con un bloque "Fuentes oficiales" antes de las preguntas frecuentes. Entidades: DIAN (control cambiario), UGPP, Minsalud, Banco de la República, Superintendencia Financiera, Fogafín, datos.gov.co, Secretaría del Senado (leyes), Función Pública y Colpensiones (decretos). Enlaces externos con `target="_blank" rel="noopener"`, sin `nofollow`: citar fuentes de autoridad es una señal de rigor para Google y para los motores de IA. Fuentes secundarias (Gerencie, Actualícese) solo como apoyo, nunca en el bloque de fuentes oficiales.
7. **Breadcrumb visible** con `aria-current="page"` en el último nivel y su BreadcrumbList.
8. **Bloque de enlaces relacionados** con anchor descriptivo (nunca "Ver más" solo).

---

## 4. Metadatos y schema por página

| ID | URL | Title (≤ 65) | Meta description | H1 | Robots | Schema |
|---|---|---|---|---|---|---|
| Home | `/` | Frilo: calculadoras de aportes y cesantías para independientes | Calcula tu planilla de independiente, aparta tu prima y tus cesantías y sigue el dólar. Gratis, en pesos o en dólares, sin registro. | Frilo (isotipo + wordmark; ver sección 12) | index | Organization + WebSite + FAQPage |
| Hub | `/calculadoras` | Calculadoras para independientes y contratistas \| Frilo | Calculadoras gratis para independientes en Colombia: aportes, fecha de pago de la planilla, cesantías e intereses y dólar hoy. Sin registro. | Calculadoras para independientes y contratistas en Colombia | index | CollectionPage + ItemList + BreadcrumbList |
| P01 | `/calculadoras/aportes-independientes` | Calculadora de aportes para independientes 2026 \| Frilo | Calcula cuánto pagas de salud, pensión, ARL y Fondo de Solidaridad como independiente o contratista en 2026. Gratis y sin registro. | Calculadora de aportes para independientes 2026 | index | WebApplication + FAQPage + BreadcrumbList |
| P03 | `/calculadoras/cesantias` | Calculadora de cesantías e intereses de cesantías 2026 \| Frilo | Calcula tus cesantías y los intereses del 12% en 2026, con contrato laboral o como independiente. Incluye años anteriores. Sin registro. | Calculadora de cesantías e intereses de cesantías 2026 | index | WebApplication + FAQPage + BreadcrumbList |
| P05 | `/calculadoras/fecha-pago-planilla` | Fechas de pago de la planilla de seguridad social 2026 \| Frilo | Consulta la fecha límite para pagar la planilla de seguridad social en 2026 según los últimos dígitos de tu documento. Calendario completo. | Fechas de pago de la planilla de seguridad social 2026 | index | WebApplication + FAQPage + BreadcrumbList |
| P07 | `/dolar-hoy` | Dólar hoy en Colombia: precio y TRM actualizada \| Frilo | Consulta el precio del dólar hoy en Colombia y la TRM oficial del día, con histórico, conversor de dólares a pesos y alertas por correo. | Dólar hoy en Colombia: TRM del [fecha] | index | WebPage + FAQPage + BreadcrumbList (+ Dataset opcional) |
| Hub | `/guias` | Guías para independientes y freelancers en Colombia \| Frilo | Guías claras sobre planilla, IBC, prima, cesantías y pagos en dólares para independientes y freelancers en Colombia, con fuentes oficiales. | Guías para independientes y freelancers en Colombia | index | CollectionPage + ItemList + BreadcrumbList |
| P02 | `/guias/ibc-independientes` | IBC para independientes 2026: qué es y cómo calcularlo \| Frilo | Qué es el IBC de un independiente, cómo calcularlo en 2026 con el 40% de tus ingresos y cómo cambiarlo en SOI. Con calculadora gratis. | IBC para independientes 2026: qué es y cómo calcularlo | index | Article + FAQPage + BreadcrumbList |
| P04 | `/guias/descargar-planilla-seguridad-social` | Descargar planilla de seguridad social: paso a paso \| Frilo | Descarga tu planilla de seguridad social, verifica que el pago quedó registrado y conoce qué cambia si eres independiente. Guía 2026. | Cómo descargar y verificar tu planilla de seguridad social | index | Article + HowTo (opcional) + FAQPage + BreadcrumbList |
| P12 | `/guias/cesantias-independientes` | Cesantías para independientes: cómo crear las tuyas \| Frilo | Si trabajas por prestación de servicios no tienes cesantías. Aprende cuánto apartar cada mes, dónde guardarlas y cómo hacerlas rendir. | Cesantías para independientes: cómo crear las tuyas si tu contrato no las trae | index | Article + FAQPage + BreadcrumbList |
| P08 | `/guias/cuenta-en-dolares-colombia` | Cuenta en dólares en Colombia: opciones y requisitos \| Frilo | Compara las opciones para tener una cuenta en dólares en Colombia: requisitos, costos y tiempos de apertura. Guía para freelancers en 2026. | Cuenta en dólares en Colombia: opciones, requisitos y costos | index | Article + FAQPage + BreadcrumbList |
| P09 | `/guias/recibir-pagos-en-dolares-colombia` | Cómo recibir pagos del exterior en dólares en Colombia \| Frilo | Recibe pagos del exterior en dólares en Colombia: opciones, costos, tiempos y qué debes declarar. Guía para freelancers e independientes. | Cómo recibir pagos del exterior en dólares en Colombia | index | Article + FAQPage + BreadcrumbList |
| P06 | `/glosario/sln` | Qué significa SLN en la planilla de seguridad social \| Frilo | Te explicamos qué significa la novedad SLN en la planilla de seguridad social, cuándo se reporta y cómo afecta tus aportes. | Qué significa SLN en la planilla de seguridad social | index | DefinedTerm (en DefinedTermSet) + BreadcrumbList |
| P10 | `/calculadoras/interes-compuesto` | Calculadora de interés compuesto y simulador de ahorro \| Frilo | Simula cuánto crece tu ahorro con interés compuesto: monto inicial, aporte mensual, tasa efectiva anual y plazo. Gratis y sin registro. | Calculadora de interés compuesto: simula cuánto rinde tu ahorro | index | WebApplication + FAQPage + BreadcrumbList |
| P11 | `/guias/cuentas-de-ahorro-alto-rendimiento` | Cuentas de ahorro de alto rendimiento en Colombia 2026 \| Frilo | Compara las cuentas de ahorro con mayor rentabilidad en Colombia: tasa EA, cuota de manejo, 4x1000 y respaldo de Fogafín. Datos de 2026. | Cuentas de ahorro de alto rendimiento en Colombia: cuáles pagan más en 2026 | index | Article + ItemList de DepositAccount + FAQPage + BreadcrumbList |
| SEM | `/lp/planilla-independientes` | ¿Cuánto pagas de planilla como independiente? \| Frilo | (no aplica) | ¿Cuánto pagas de planilla como independiente en 2026? | noindex, follow | ninguno |

Las cifras de caracteres de la sección 6 del brief se mantienen. Las páginas nuevas de esta versión (hubs, cesantías para independientes, comparativa) siguen las mismas reglas: 55 a 65 caracteres en el title y 120 a 150 en la meta description.

---

## 5. Plantillas JSON-LD

Un solo `<script type="application/ld+json">` por página con `@graph`. Los `@id` permiten que Organization, WebSite y el autor se reutilicen en todo el sitio.

### 5.1 Global (en todas las páginas)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://frilo.dev/#organization",
      "name": "Frilo",
      "url": "https://frilo.dev",
      "logo": "https://frilo.dev/logos/isotipo-oliva.png",
      "slogan": "Tus finanzas, mejor con Frilo",
      "areaServed": "CO",
      "sameAs": ["[URL LinkedIn de Frilo]", "[URL Instagram de Frilo]"]
    },
    {
      "@type": "WebSite",
      "@id": "https://frilo.dev/#website",
      "url": "https://frilo.dev",
      "name": "Frilo",
      "inLanguage": "es-CO",
      "publisher": { "@id": "https://frilo.dev/#organization" }
    },
    {
      "@type": "Person",
      "@id": "https://frilo.dev/#nicolas",
      "name": "Nicolás Suárez",
      "jobTitle": "Fundador de Frilo",
      "url": "https://frilo.dev/quienes-somos",
      "sameAs": ["[URL LinkedIn de Nicolás]"]
    }
  ]
}
```

### 5.2 BreadcrumbList (ejemplo P01)

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://frilo.dev" },
    { "@type": "ListItem", "position": 2, "name": "Calculadoras", "item": "https://frilo.dev/calculadoras" },
    { "@type": "ListItem", "position": 3, "name": "Aportes para independientes" }
  ]
}
```

### 5.3 Herramientas: WebApplication (P01, P03, P05)

```json
{
  "@type": "WebApplication",
  "@id": "https://frilo.dev/calculadoras/aportes-independientes#app",
  "name": "Calculadora de aportes para independientes 2026",
  "url": "https://frilo.dev/calculadoras/aportes-independientes",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "inLanguage": "es-CO",
  "isAccessibleForFree": true,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "COP" },
  "publisher": { "@id": "https://frilo.dev/#organization" },
  "dateModified": "[AAAA-MM-DD]"
}
```

Junto con un `WebPage` que lleve `author`, `reviewedBy`, `lastReviewed` y `dateModified`:

```json
{
  "@type": "WebPage",
  "@id": "https://frilo.dev/calculadoras/aportes-independientes",
  "url": "https://frilo.dev/calculadoras/aportes-independientes",
  "name": "Calculadora de aportes para independientes 2026",
  "isPartOf": { "@id": "https://frilo.dev/#website" },
  "mainEntity": { "@id": "https://frilo.dev/calculadoras/aportes-independientes#app" },
  "author": { "@id": "https://frilo.dev/#nicolas" },
  "reviewedBy": { "@type": "Organization", "name": "Equipo de finanzas Frilo", "parentOrganization": { "@id": "https://frilo.dev/#organization" } },
  "lastReviewed": "[AAAA-MM-DD]",
  "dateModified": "[AAAA-MM-DD]"
}
```

### 5.4 Guías: Article (P02, P04, P08, P09, guía de cesantías)

```json
{
  "@type": "Article",
  "headline": "IBC para independientes 2026: qué es y cómo calcularlo",
  "description": "[meta description]",
  "mainEntityOfPage": "https://frilo.dev/guias/ibc-independientes",
  "inLanguage": "es-CO",
  "author": { "@id": "https://frilo.dev/#nicolas" },
  "publisher": { "@id": "https://frilo.dev/#organization" },
  "datePublished": "[AAAA-MM-DD]",
  "dateModified": "[AAAA-MM-DD]",
  "image": "https://frilo.dev/og/guias/ibc-independientes.png",
  "citation": ["[URL Ley 2277 de 2022 en secretariasenado.gov.co]"]
}
```

### 5.5 FAQPage (todas las páginas con preguntas visibles)

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Puedo calcular la liquidación de mi planilla antes de pagar?",
      "acceptedAnswer": { "@type": "Answer", "text": "[Mismo texto visible en la página]" }
    }
  ]
}
```

Google ya casi no muestra resultados enriquecidos de FAQ para sitios que no son de gobierno o salud. Se mantiene porque ayuda a los buscadores con IA a extraer pares de pregunta y respuesta.

### 5.6 Glosario: DefinedTerm (P06)

```json
{
  "@type": "DefinedTerm",
  "@id": "https://frilo.dev/glosario/sln",
  "name": "SLN",
  "alternateName": "Suspensión temporal o licencia no remunerada",
  "description": "[Primera oración visible de la página]",
  "inDefinedTermSet": {
    "@type": "DefinedTermSet",
    "@id": "https://frilo.dev/glosario",
    "name": "Glosario de la planilla de seguridad social"
  }
}
```

### 5.7 Comparativa de cuentas: ItemList de DepositAccount

```json
{
  "@type": "ItemList",
  "name": "Cuentas de ahorro con mayor rentabilidad en Colombia",
  "itemListOrder": "https://schema.org/ItemListOrderDescending",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "DepositAccount",
        "name": "Cuenta de ahorros Lulo Bank",
        "provider": { "@type": "BankOrCreditUnion", "name": "Lulo Bank" },
        "annualPercentageRate": "[X.XX]",
        "feesAndCommissionsSpecification": "[VERIFICAR]"
      }
    }
  ]
}
```

No usar `Review` ni `AggregateRating` en esta página: no hay reseñas propias y Google penaliza las autoasignadas.

### 5.8 Dólar hoy: Dataset (opcional)

`Dataset` con `name`, `description`, `creator` (Superintendencia Financiera), `distribution` (la URL de la API de datos.gov.co), `temporalCoverage` de los últimos 30 días y `dateModified`. Solo si la tabla es visible en HTML.

---

## 6. Enlazado interno

### Matriz (✓ = enlace contextual en el cuerpo, además de header y footer)

| Desde \ Hacia | Home | Hub calc. | P01 | P02 | P03 | P04 | P05 | P06 | P07 | P08 | P09 | Guía ces. | Cuentas |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Home | | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | | ✓ | | ✓ | ✓ | ✓ |
| P01 | | ✓ | | ✓ | ✓ | ✓ | ✓ | | ✓ | | | | ✓ |
| P02 | | | ✓ | | | ✓ | | | | | | | ✓ |
| P03 | | ✓ | ✓ | | | | | | | | | ✓ | ✓ |
| P04 | | | ✓ | ✓ | | | ✓ | ✓ | | | | | ✓ |
| P05 | | ✓ | ✓ | | | ✓ | | | | | | | |
| P06 | | | ✓ | | | ✓ | | | | | | | |
| P07 | | | ✓ | | | | | | | ✓ | ✓ | | ✓ |
| P08 | | | | | | | | | ✓ | | ✓ | | |
| P09 | | | ✓ | | | | | | ✓ | ✓ | | | ✓ |
| Guía ces. | | | ✓ | ✓ | ✓ | | | | ✓ | | | | ✓ |
| Cuentas | | | ✓ | | | | | | | | | | |

Las columnas de "Cuentas" vienen del banner de afiliados. El resto replica la sección 8 del brief.

### Reglas de anchor text

- Usar la keyword principal o una secundaria de la página destino, de forma natural ("calculadora de aportes para independientes", "IBC para independientes").
- Las marcas de terceros (Mi Planilla, SOI, Porvenir, Bancolombia) aparecen solo como texto en el cuerpo o en tablas, nunca como anchor hacia nuestras propias páginas.
- Los enlaces a los bancos llevan `target="_blank" rel="noopener"` mientras no haya acuerdo comercial. Si se convierten en referidos, pasan a `rel="sponsored noopener"`. Los enlaces a normas oficiales van como enlaces normales: citar fuentes de autoridad suma confianza.

---

## 7. Capa de cuentas que rinden (sin afiliados por ahora)

Enlaces actuales, a la página oficial de cada entidad:

- Lulo Bank: `https://www.lulobank.com/`
- RappiPay (RappiCuenta): `https://www.rappipay.co/rappicuenta/alta-rentabilidad-cuentas/`
- Nu: `https://www.nu.com.co/cuenta`
- Solo en la tabla de P11: Pibank `https://www.pibank.co/`, Ualá `https://www.uala.com.co/`, Global66 `https://www.global66.com/` [confirmar URL]

### Ubicaciones

| Página | Variante del banner | Gancho adicional |
|---|---|---|
| Home | `prima` (sección "Lo que apartas también puede rendir") | Fila en la tabla comparativa y pregunta frecuente "¿Cómo gana dinero Frilo?" |
| P01 Aportes | `aportes`, justo debajo del resultado | El resultado calcula los intereses de un año sobre la prima y las cesantías apartadas, con una tasa de ejemplo ajustable. |
| P03 Cesantías | `cesantias`, debajo del resultado | El modo independiente lleva a "Lleva tus cesantías en Frilo". |
| Guía cesantías | `cesantias`, en el H2 "¿Dónde guardar tus cesantías para que rindan?" | |
| P02 IBC | `aportes`, después de los pasos de SOI | |
| P04 Descargar planilla | `guia`, antes de las preguntas frecuentes | |
| P07 Dólar hoy | `dolar`, después del conversor | |
| P09 Recibir dólares | `dolar`, antes de las preguntas frecuentes | |
| Hubs | Tarjeta "Ponlo a rendir" hacia la comparativa (sin enlaces de afiliado directos) | |
| Comparativa `/ahorro/…` | Tabla completa + simulador de rendimiento | Es la página de dinero: el destino de todos los banners. |
| **Sin banner** | Landing SEM, glosario SLN y P08 | La landing tiene un solo objetivo; P06 y P08 se mantienen editoriales. |

### Reglas de cumplimiento

1. Hoy: etiqueta "Información de referencia" en cada banner, aviso "Frilo no recibe pagos de estas entidades" en el banner y en la comparativa, y una página `/transparencia` enlazada desde el footer. Cuando haya referidos: cambiar el aviso a "Contenido con enlaces de afiliado" y los `rel` a `sponsored`.
2. Orden siempre por tasa E.A. de mayor a menor, con fecha de consulta junto a la tabla. Nunca reordenar por comisión.
3. Hablar de "cuentas de ahorro que rinden" y "poner a rendir", no de "invertir". Son cuentas de ahorro, no productos de inversión, y prometer rentabilidad de inversión exige otro marco legal.
4. Mostrar en la tabla si cada entidad está vigilada por la Superintendencia Financiera y cubierta por Fogafín. `[VERIFICAR por entidad]`
5. Sin logos de las entidades hasta que el programa de afiliados lo autorice por escrito. Mientras tanto, solo el nombre en texto.
6. `rel="noopener"` hoy; `rel="sponsored noopener"` cuando sean enlaces de referidos.

### Medición

- Medir desde ya los clics hacia cada banco con UTM propio (`utm_source=frilo&utm_medium=banner&utm_campaign=p01-aportes`). Esos datos son el argumento para negociar un programa de referidos con cada entidad.
- Evento en GA4 o PostHog: `bank_click` con `{pagina, variante, entidad, posicion}`.
- Cruzar con el first touch del registro (nota "Regla de conversión" del lienzo) para separar los ingresos que vienen de SEO y de SEM.

---

## 8. Ventajas frente a la competencia revisada

| Sitio | Lo que hace mal | Cómo lo supera Frilo |
|---|---|---|
| Pago Simple (`/calculadora-de-aportes/`) | Title roto ("Calculadora de aportes \|"), calculadora en otro subdominio, sin preguntas frecuentes, sin fuentes, encabezado "Videotutorial" vacío, copyright desactualizado. | Calculadora en la misma URL, title completo, respuesta directa, fórmula en tabla, fuentes y fecha visibles. |
| Compensar (`/afiliaciones/calculadora-aportes`) | Depende de JavaScript, tabla de resultados vacía, jerarquía H1 → H4, sin fecha ni normas citadas, banners vencidos. | Renderizado en servidor con un ejemplo completo, jerarquía H1 → H2 → H3 limpia, normas citadas. |
| UGPP (`/calculadora-ibc`) | No se pudo cargar en la revisión. | Para revisar a mano: es la fuente oficial del IBC y la competencia más fuerte en autoridad para P02. |
| Investor.gov (interés compuesto) | Pasos claros y rango de variación de tasa, pero sin fórmula, sin FAQ, sin ejemplo, sin autor ni fecha, y con encabezados en inglés en una página en español. Pensada para EE. UU. | P10 en español de Colombia, con fórmula, tasa E.A. vs. nominal explicada, escenarios ± tasa (como su rango de varianza), tabla año a año, FAQ y revisor. |
| Tyba (interés compuesto) | Buen title y meta, aviso regulatorio; pero sin FAQ, sin fórmula, sin proyección visible, errata en "Aportes menusuales", jerarquía de encabezados irregular, muchas CTA de producto compitiendo con la herramienta y no explica tasa E.A. vs. capitalización. | P10 con resultado completo renderizado en servidor, gráfico y tabla, atajo de prima y cesantías (gancho propio), un solo CTA hacia P11 y explicación de E.A. vs. capitalización. Tyba además enlaza su calculadora de prima: vigilar como competidor de /calculadoras/prima-independientes. |
| Grupo R5 (referente) | Buen patrón herramienta + contenido + venta cruzada, pero sin autor, fecha ni preguntas frecuentes. | Se copió el patrón (herramienta arriba, pasos, venta cruzada hacia otras herramientas) y se agregó la capa de confianza. |
| Gerencie (referente) | Artículos muy largos con tabla de contenido, preguntas como H3 y fuentes oficiales; mucha publicidad y ventanas emergentes. | Mismo rigor de fuentes y tabla de contenido, sin ventanas emergentes y con un solo banner por página. |

---

## 9. Tabla de cambios por artboard

### Todas las páginas

| Elemento | Antes | Después | Justificación |
|---|---|---|---|
| Header | Copiado en cada artboard; botón "Crear cuenta gratis" en manzana plano | Componente único; "Probar la app gratis" con degradé, más estado activo con `aria-current` | Pedido 1 y mantenimiento |
| Footer | "[Footer completo]" en páginas internas | Componente único con todos los enlaces del brief, el CTA en degradé y el aviso de afiliados | Enlazado interno y transparencia |

### Home (`Main.dc.html`)

| Elemento | Antes | Después | Keyword o motivo |
|---|---|---|---|
| Title | Frilo · Home | Frilo: calculadoras de aportes y cesantías para independientes | Marca + calculadora de aportes / cesantías |
| H1 | Sabes cuánto cobras. Frilo te dice cuánto es tuyo. | Frilo (isotipo de la F + wordmark) | Marca; decisión del 19-10-2026 |
| H2 del hero | No existía | Calculadoras gratis para independientes: aportes, cesantías y planilla | calculadora de aportes, calculadora de cesantías |
| H2 sección problema | Tu contrato no trae prima ni cesantías… | ¿Qué tiene que calcular un independiente cada mes? | Formato de pregunta (GEO) |
| H2 funciones | No existía | Todo lo que calcula Frilo: planilla, cesantías y dólar | Temas del producto |
| H2 banner | Lo que apartas también puede rendir | Calcula cuánto rendirían tu prima y tus cesantías | Gancho de cuentas que rinden |
| H2 perfiles | Frilo es para ti si… | Calculadoras para freelancers en dólares y contratistas por prestación de servicios | calculadora de aportes para independientes y contratistas |
| H2 herramientas | Calculadoras gratis para independientes | Calculadora de aportes, de cesantías y de fecha de pago de la planilla | calculadora de aportes / intereses de cesantías / fecha de pago planilla |
| H2 comparativa | Frilo y las otras formas de hacer la cuenta | Calcular aportes con Frilo, con una hoja de cálculo o con el simulador del operador | calculadora de aportes |
| H2 guías | Guías para independientes | Guías para calcular y pagar tu planilla de seguridad social | planilla de seguridad social |
| H2 FAQ | Preguntas frecuentes sobre Frilo | Preguntas frecuentes sobre Frilo y sus calculadoras | Marca + calculadoras |
| Cierre | H2 "Más claridad, más libertad." | Isotipo grande + el lema como párrafo (no H2) | Dejar los H2 solo para temas con keyword |
| Lead del hero | …sigue el dólar en un solo lugar | Suma el lema "Sabes cuánto cobras; Frilo te dice cuánto es tuyo" y "ponlas a rendir" | Gancho de cuentas que rinden |
| Bloque de funciones 02 | "Arma tu propia prima…" | "…y ponlas a rendir" + enlace a /calculadoras/cesantias | calculadora de intereses de cesantías |
| Nueva sección | No existía | "Lo que apartas también puede rendir" con `BannerRendimiento` (prima) | Monetización |
| Tarjeta de cesantías | Tu saldo a febrero, con el 12% anual | Cesantías e intereses del 12%, con contrato o como independiente | calculadora de intereses de cesantías |
| Tarjeta de fecha de pago | `#` | /calculadoras/fecha-pago-planilla | fecha de pago planilla seguridad social |
| Tarjeta "De dólares a pesos" | Herramienta sin URL | Reemplazada por "Cuentas de ahorro que más rinden" | Sin datos de keywords; página de dinero |
| Guías | 3 tarjetas | 4: suma "Cómo descargar y verificar tu planilla…" | descargar planilla de seguridad social |
| Guía de dólar | Cómo recibir pagos del exterior en Colombia | …en dólares en Colombia | como recibir pagos en dolares en colombia |
| Preguntas frecuentes | 5 | 6: suma "¿Las cuentas que recomienda Frilo le pagan?" | Transparencia |
| Comparativa | 5 filas | 6: suma "Compara cuentas donde ponerlas a rendir" | Diferencial |

### P01 (`Calculadora.dc.html`)

| Elemento | Antes | Después | Keyword |
|---|---|---|---|
| Title | (no definido) | Calculadora de aportes para independientes 2026 \| Frilo | calculadora de aportes |
| Lead | Invitación a usar la herramienta | Respuesta directa con la fórmula y "liquidación de aportes en línea" | calculadora de liquidacion aportes en linea |
| Resultado | "IBC: …" en texto | "IBC" enlaza a P02 | ibc para independientes |
| Resultado | Prima y cesantías en una línea | Suma los intereses estimados de un año con tasa de ejemplo + enlace a la comparativa | Gancho de afiliados |
| Botón secundario | "Ir a pagar la planilla" | "Dónde pagar la planilla" (ancla a #operadores) | Conecta con la sección de operadores |
| Banner | No existía | `BannerRendimiento` (aportes) bajo el resultado | Monetización |
| H2 del ejemplo | Ejemplo: facturas $8.000.000 al mes | Ejemplo de liquidación de aportes: facturas $8.000.000 al mes (con pasos numerados) | calculadora de liquidacion aportes |
| Nueva sección | No existía | Dónde pagar la planilla: Mi Planilla, SOI, Pago Simple, Compensar y otros operadores | marcas de terceros (mención nominativa) |
| Preguntas frecuentes | 4 | 6: suma liquidación antes de pagar y comparación con Mi Planilla o SOI | calculadora de liquidacion planilla |
| Otras herramientas | Prima, cesantías, dólar, dólares a pesos | Fecha de pago, descargar planilla, cesantías, dólar hoy | fecha de pago planilla seguridad social |

### Guía de cesantías (`Guia.dc.html`)

| Elemento | Antes | Después | Motivo |
|---|---|---|---|
| H2 | Qué son las cesantías y por qué no las tienes | ¿Por qué un independiente no tiene cesantías? | Formato de pregunta (GEO) |
| Calculadora embebida | Input sin lógica | Funcional, modo independiente de P03, con enlace a la calculadora completa | Un solo componente |
| H2 "Dónde guardarlas" | Placeholder | Criterios + `BannerRendimiento` (cesantías) | Monetización |
| H2 intereses | Sin enlace | Enlace a /calculadoras/cesantias con el anchor "calculadora de intereses de cesantías" | Evitar canibalización con P03 |
| Sigue leyendo | Prima, IBC, aportes | Cuentas que rinden, IBC (→ P02), aportes | Enlace a P02 |

### P07 (`DolarHoy.dc.html`)

| Elemento | Antes | Después | Keyword |
|---|---|---|---|
| Title | (no definido) | Dólar hoy en Colombia: precio y TRM actualizada \| Frilo | dolar hoy colombia |
| Bajo el H1 | Solo la línea de fuente | "El valor del dólar hoy en Colombia es [X] pesos… El precio del dólar colombiano hoy…" | valor del dolar hoy / precio del dolar colombiano hoy |
| H2 del gráfico | Cómo se ha movido | Precio del dólar hoy en Colombia: cómo se ha movido | precio dolar hoy colombia |
| H2 del conversor | Convierte tu pago | Convierte dólares a pesos con la TRM de hoy | valor del dolar hoy colombia |
| Tabla | 3 filas con enlace a páginas diarias | Últimos 30 días en texto, sin enlaces | Programático descartado |
| Banner | No existía | `BannerRendimiento` (dólar) | Monetización |
| Preguntas frecuentes | Placeholder | 4 preguntas visibles, incluida "¿A cómo está el dólar en Colombia hoy?" | a como el dolar en colombia hoy |
| Enlaces | Calculadora | Calculadora, P08 y P09 | Matriz de enlaces |

### Landing SEM (`LandingSEM.dc.html`)

| Elemento | Antes | Después | Motivo |
|---|---|---|---|
| Title | Landing de pauta · … | ¿Cuánto pagas de planilla como independiente? \| Frilo | Coherencia con el anuncio |
| Header | "Gratis · sin tarjeta" | Botón "Probar la app gratis" con degradé | Pedido 1 |
| Robots | — | `noindex, follow`, fuera del sitemap | No competir con P01 |

### Páginas nuevas

Hubs `/calculadoras` y `/guias`, P02, P03, P04, P05, P06, P08, P09 y `/guias/cuentas-de-ahorro-alto-rendimiento`. Cada una sigue la ficha de la sección 6 del brief (la comparativa, la sección 4 de este documento) y la estructura de la sección 3. Componentes interactivos ya funcionales en el lienzo: P02 (IBC), P03 (dos modos), P05 (buscador por dígitos) y simulador de rendimiento de la comparativa.

---

## 10. Pendientes y datos que necesito

1. **Keywords de ahorro.** Hechas: incorporadas en el brief v3 y aplicadas a P10, P11 y P12. Falta revisar KD y SERP de "calculadora interés compuesto" (5.400/mes, sin KD en el export) Pibank, Ualá y Global66 entran a la tabla de P11 (confirmar sus URL oficiales: www.pibank.co, www.uala.com.co, www.global66.com). El banner de rendimiento sigue mostrando solo Lulo Bank, RappiPay y Nu.
2. **Referidos.** Pospuesto: por ahora enlaces directos a cada banco (sección 7).
3. **Revisor.** Hecho: "Revisado por el equipo de finanzas Frilo" (decisión del 20-10-2026, sin nombre propio). Conviene crear `/equipo` o `/metodologia` que explique quién revisa y con qué criterio, y enlazarla desde la línea de revisión: Google pide señales de experiencia en contenido financiero.
4. **Datos verificados el 20-10-2026.** Salario mínimo 2026 $1.750.905 (Decreto 1469 de 2025); auxilio de transporte $249.095 (Decreto 1470 de 2025); tarifas ARL (Decreto 1772 de 1994); tabla FSP de la Ley 797 de 2003, vigente en 2026 porque la Ley 2381 de 2024 entraría en vigencia el 1-abr-2027; calendario del Decreto 1990 de 2016 (art. 3.2.2.1); tasas de las seis cuentas. Siguen pendientes: efecto de la novedad SLN en cada subsistema, siglas de novedades PILA (Resolución 2388 de 2016), datos de cuentas en dólares de P08 y salarios mínimos de 2021-2025 en P03.
5. **Capturas.** Descartadas (decisión del 20-10-2026): P04 lista los portales de Miplanilla, Aportes en Línea, Pago Simple y Enlace Operativo con sus enlaces, y explica los pasos en texto.
6. **Hosting comercial** cuando haya referidos o publicidad (sección 1).
7. **Keywords sin datos del brief (sección 7):** prima para independientes, dólares a pesos, "trm hoy" y los perfiles `/para/`.
8. **Revisar a mano** `ugpp.gov.co/calculadora-ibc` (no cargó en la revisión).
9. **Actualización anual:** P01, P02, P03 y P05 se actualizan al año siguiente en la primera quincena de diciembre (pico de enero).

---

## 11. Keywords a investigar para la comparativa de cuentas

Exportar en Semrush (base Colombia) con volumen, KD, CPC, intención y SERP features. Rol propuesto entre paréntesis; se confirma con los datos.

**Grupo 1 · Cuentas que más pagan (candidatas a principal)**
- cuentas de ahorro con mayor rentabilidad
- cuentas de ahorro con mayor rentabilidad colombia
- cuenta de ahorros que más paga
- cuentas de ahorro que más pagan en colombia
- mejores cuentas de ahorro colombia
- cuenta de ahorro rentable
- cuentas de ahorro de alto rendimiento
- cuenta de ahorros con rentabilidad diaria
- bancos que más pagan por ahorrar

**Grupo 2 · Intención de prima y cesantías (el gancho propio de Frilo)**
- dónde ahorrar la prima
- qué hacer con la prima
- en qué invertir la prima
- dónde guardar las cesantías
- qué hacer con las cesantías

**Grupo 3 · Decisión y comparación (secundarias o H2)**
- cuenta de ahorro vs cdt / cdt o cuenta de ahorros
- dónde ahorrar dinero en colombia
- dónde poner a rendir mi dinero
- cuenta de ahorros sin cuota de manejo
- cuenta de ahorros exenta de 4x1000
- bancos digitales colombia / neobancos colombia

**Grupo 4 · Confianza (preguntas frecuentes)**
- bancos digitales están cubiertos por fogafín
- lulo bank es seguro
- nu colombia es seguro
- rappipay es confiable

**Grupo 5 · Simulador (soporte)**
- simulador de ahorro
- calculadora de ahorro
- calcular intereses cuenta de ahorros
- calculadora interés compuesto

**Grupo 6 · Marcas de terceros (solo tabla, nunca title, H1 ni URL)**
- lulo bank tasa / lulo bank rentabilidad / lulo bank cuenta de ahorros
- rappicuenta rentabilidad / rappipay tasa
- cajitas nu tasa / nu colombia rentabilidad
- lulo bank vs nu / nu vs rappipay (si tienen volumen, pueden justificar páginas comparativas propias)
- otras entidades para evaluar si entran a la tabla: pibank tasa, ualá colombia rendimiento, global66 cuenta remunerada

Nota: "qué hacer con las cesantías" lo buscan sobre todo asalariados que retiran del fondo. Si el volumen es alto, conviene una guía aparte en `/guias/` en vez de forzarla en la comparativa.

---

## 12. Uso de la F (isotipo) en el sitio

Objetivo: que quien vea "Frilo" en un lugar y la F en otro (la app, el ícono del navegador, un anuncio) los reconozca como la misma marca.

| Dónde | Versión | Tamaño |
|---|---|---|
| Header (todas las páginas) | Isotipo manzana + wordmark manzana, sobre oliva | Isotipo 34 px de alto, wordmark 24 px |
| H1 de la Home | Isotipo manzana + wordmark manzana | Isotipo 72–104 px, wordmark 52–76 px |
| Tarjeta "Así se ve tu mes" (Home) | Isotipo oliva sobre blanco | 26 px |
| H2 "Todo lo que calcula Frilo" | Isotipo oliva | 36 px |
| Resultado de cada calculadora (P01, P03, P05) | Isotipo manzana + "Calculado con Frilo" | 24 px |
| Banner de cuentas que rinden | Isotipo manzana junto al eyebrow | 24 px |
| Cierre de la Home | Isotipo manzana grande | 88 px |
| Footer | Isotipo oliva + wordmark oliva | 34 / 24 px |
| Landing SEM | Isotipo manzana + wordmark manzana | 34 / 24 px |
| Favicon, `apple-touch-icon` y `manifest` | Ícono de app (F manzana sobre cuadro oliva con esquinas redondeadas) | 32, 180 y 512 px |
| `og:image` | Plantilla con la F en una esquina y el H1 de cada página | 1200×630 |
| JSON-LD `Organization.logo` | Ícono de app en PNG | 512 px |

Reglas del brandbook que se respetan: la F manzana solo va sobre oliva y la F oliva sobre fondos claros; nunca menos de 24 px de alto; sin cambiar colores ni proporciones; el degradé del pliegue es parte del logo.

**H1 de la Home en código.** El H1 debe tener texto real además del logo:

```html
<h1 class="hero-logo">
  <svg aria-hidden="true" focusable="false"><!-- isotipo --></svg>
  <svg aria-hidden="true" focusable="false"><!-- wordmark --></svg>
  <span class="sr-only">Frilo</span>
</h1>
```

En el lienzo se resolvió con `alt="Frilo"` en el wordmark; en producción conviene el `<span class="sr-only">` para que el texto del H1 no dependa de un atributo `alt`.


---

## 13. Cambios v2.1 (brief v3)

| Página | Cambio | Keyword |
|---|---|---|
| P10 nueva `/calculadoras/interes-compuesto` | Calculadora con monto inicial, aporte mensual, tasa (E.A. o nominal), capitalización (diaria a anual), plazo en meses o años, escenarios con la tasa ± N puntos y tabla de proyección; atajo "mi prima y mis cesantías" (16,66% del ingreso); gráfico de crecimiento; enlace a P11 | calculadora interés compuesto (5.400) |
| P11 `/guias/cuentas-de-ahorro-alto-rendimiento` | Reemplaza `/ahorro/cuentas-de-ahorro-rentables` (redirigir 301 si llegó a publicarse). H1 y H2 del brief; tabla con tasa E.A., cuota de manejo, exenta de 4x1000, rentabilidad diaria, Fogafín y fecha de consulta; seis entidades con enlace a su web oficial (Lulo Bank, RappiPay, Nu, Pibank, Ualá y Global66; decisión del 19-10-2026); simulador que enlaza a P10 | cuentas de ahorro de alto rendimiento (880), cuenta de ahorros sin cuota de manejo (480) |
| P12 Guía de cesantías | H2 del brief ("Qué son las cesantías…", "Cuánto apartar cada mes", "Dónde guardar las cesantías para que rindan", nuevo "Qué hacer con las cesantías cuando las tengas"); enlaces a P11 y P10 | dónde guardar las cesantías / qué hacer con las cesantías |
| Home | Herramientas: "Calculadora de interés compuesto" reemplaza la tarjeta de cuentas; Guías: suma P11 | calculadora interés compuesto / cuentas de ahorro de alto rendimiento |
| Footer y hubs | Suman P10 y P11; el hub de calculadoras gana la sección "Ahorro" | — |
| Banner | Anchor "Compara cuentas de ahorro de alto rendimiento" hacia P11 | cuentas de ahorro de alto rendimiento |


---

## 14. Datos verificados el 20-10-2026

### Cuentas de ahorro (P11 y banner)

| Entidad | Tasa sin condiciones | Notas | Fogafín (según su web) |
|---|---|---|---|
| Pibank | 11% E.A. | $0 cuota; 4x1000 exento a solicitud; liquida sobre saldo diario, abona el 1.º de cada mes; sin PSE; 20 transferencias al mes | Sí |
| Global66 (pesos) | 11% E.A. | $0 apertura y mantenimiento; dólares hasta 6% E.A. (la página también dice 8% en Bóvedas) | Sí, depósito en pesos |
| Lulo Bank | 9,50% E.A. en Bolsillos (10% Lulo Pro) | Lulo cuenta 0,10%; $0 cuota | No lo indica |
| RappiPay | 9% E.A. en Bolsillos | Bóvedas 9,8% a 13% según plazo; retiro anticipado al 0,1%; $0 cuota | Sí (confirmado por Nicolás) |
| Nu | 8,25% E.A. en Cajitas | La misma página dice 9,25% y "hasta 9,70% en Cajitas o CDT": inconsistencia de la fuente | Sí, hasta $50 millones |
| Ualá | 5% E.A. | 8,25% con 1 compra al mes; 10,5% con $400.000 en compras al mes; remunera hasta $10.500.000; 4x1000 exento hasta 65 UVT | Sí |
| Littio (USD) | Hasta 6% u 8% E.A. | No vigilada por la Superfinanciera; activos digitales; sin Fogafín | No aplica |

El banner muestra la cuenta en pesos con la tasa más alta sin condiciones (Pibank, 11%, empata con Global66) y la cuenta en dólares con la tasa más alta (Littio, hasta 8%, con aviso de que no es vigilada ni tiene Fogafín). Decisión del 20-10-2026; la verificación semanal avisa si cambian.

### SERP de "calculadora interés compuesto" (top 5 en Google Colombia, según Nicolás)

1. Investor.gov: pasos claros y rango de varianza; sin fórmula, FAQ ni autor; mezcla inglés.
2. Tyba: buen title, aviso regulatorio; sin FAQ ni fórmula; muchas CTA de producto.
3. Moneychimp: herramienta antigua con muy poco contenido.
4. Javi Linares: el más completo (fórmula, 4 modos de uso, ejemplos, tabla); pero fórmula incompleta para aportes, resultados en imágenes, widget externo y mucha carga comercial.
5. Hapi: sin H1 visible, calculadora en un dominio externo, sin fórmula ni autor.

Ninguno es de Colombia con contexto local (prima, cesantías, tasas reales de cuentas). P10 compite con: fórmula completa con aportes, tabla y escenarios renderizados en el sitio, atajo de prima y cesantías, enlace a tasas reales verificadas (P11) y autor/revisor/fecha. Siguiente mejora sugerida: los "modos" de Javi Linares (cuánto aportar al mes para llegar a una meta, cuánto tiempo tardo).


## 15. P10 v2: lo mejor de los competidores (20-10-2026)

| Idea | Tomada de | Cómo quedó en P10 |
|---|---|---|
| Tres modos: cuánto tendré, cuánto ahorrar al mes para una meta, cuánto tiempo tardo | Javi Linares (4 modos) | Selector arriba de la calculadora; campo de meta |
| Rango de variación de la tasa | Investor.gov | Escenarios con la tasa ± N puntos |
| Capital invertido vs. capital + rendimientos | Tyba | Tres cifras: capital aportado, intereses, capital + intereses |
| Gráfico de reparto aportes vs. intereses | Javi Linares | Barras apiladas con leyenda |
| Ejemplo a 1, 5, 10 y 20 años | Hapi | Tabla "¿Cuánto crecen $1.000.000?" al 9% y 11% E.A. |
| Retención en la fuente en el resultado | Simuladores de Pibank y Nu | Interruptor que la descuenta (7% de los intereses, por verificar) |
| Regla del 72 | Investor.gov | Línea bajo el gráfico + pregunta frecuente |
| Otras calculadoras relacionadas | Tyba, Javi Linares | Bloque final con 4 enlaces internos |

Lo que no se copió: widgets en dominios externos (Hapi, Javi Linares), resultados en imágenes, CTA de producto repetidas y textos en otro idioma.

---

## 16. Cambios del 20-10-2026 (tarde)

- **Fuentes oficiales:** bloque añadido en P05, P07, P08, P09, P10, P11 y P04; listas de fuentes enlazadas en P01, P02, P03 y P12.
- **P08:** tabla con requisitos, costo y apertura de Bancolombia (filial Panamá/Puerto Rico y Cuenta Global Wenia), Davivienda (cuenta internacional, Panamá), Global66 y Littio; paso de cuenta de compensación y FAQ de declaración con el enlace de la DIAN.
- **P09:** sección "Qué debes declarar" (DIAN), tabla de opciones y comparación cuenta vs. plataforma.
- **P10 y P11:** retención en la fuente del 7% sobre rendimientos, sin base mínima (Gerencie, tabla 2026).
- **P05:** NIT con dígito de verificación; consecuencias de pagar tarde (mora a tasa de usura, UGPP).
- **P02:** definición completa del IBC (Ley 2277 art. 89, Decreto 379 de 2026 para cuenta propia) y FAQ de cotizar por encima del 40%.
- **P06:** cómo afecta la SLN a cada subsistema (Minsalud caso 5).
- **P12:** fondos de cesantías para independientes (aportes voluntarios, deducción hasta 1/12).
- **Landing SEM:** se quitó el bloque de testimonio.
- **Fechas:** todas las líneas de confianza dicen "Actualizado el 20 de octubre de 2026".
- **Pendiente:** siglas de novedades PILA (P06), Fogafín de Lulo, festivo del 12 de julio de 2027 (Chiquinquirá; no se cargó). Los marcadores de DolarHoy y las capturas de la Home se llenan en desarrollo con datos reales.
