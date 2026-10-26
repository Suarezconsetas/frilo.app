# Pendientes del sitio de contenido

Actualizado el 22 de octubre de 2026. **Fase 4 completada el 22-oct-2026**: sitio en `frilo.dev`, app en `app.frilo.dev`. La publicación (Fase 4) solo ocurre con la instrucción explícita de Nicolás: "Publica el sitio en producción".

## Después de publicar (Nicolás)

1. **Search Console:** agregar la propiedad `frilo.dev` (dominio), verificar y enviar `https://frilo.dev/sitemap.xml`. Pedir indexación de la Home y de las 4 calculadoras.
2. ~~**GTM y GA4**~~ configurados el 22-oct-2026 (ver sección Analítica).
3. **Supabase Auth:** cuando quieras, cambiar el *Site URL* a `https://app.frilo.dev` y dejar las Redirect URLs existentes un tiempo.
4. **Prueba de humo de usuarios actuales:** iniciar sesión en `app.frilo.dev` (deben volver a entrar una vez) y confirmar que el correo de recordatorio y las bajas funcionan.

## De Nicolás

Hechos hasta el 22-oct-2026: claves de Supabase y alias de staging, URL en Supabase Auth y Google OAuth, pruebas de registro (código y Google), `/quienes-somos` (sin foto ni redes por ahora), línea "Escrito y revisado por Nicolás Suárez con fuentes oficiales", revisión de P12, revisión legal de la política de datos, versión de la política `2026-10-22` (cookies, recordatorio, casilla de novedades en el sitio), cron de Vercel verificados, plantilla de correo de Supabase, Home con las capturas actuales (decisión de Nicolás).

1. **Probar la casilla de novedades:** marcada y sin marcar, y revisar la fila `marketing_frilo` en `autorizaciones` (otorgada true/false).
2. **Tasas de Lulo:** revisar a mano cada semana (tarea programada, informe los lunes).
3. **Redes sociales y foto de `/quienes-somos`:** fuera de alcance por ahora.

## Analítica (GTM + GA4): configuración de los tags

GTM `GTM-NPF6MT3S` se carga en `frilo.dev` solo si la persona acepta el aviso de cookies (consentimiento: analítica concedida; publicidad y personalización denegadas). Nunca viajan montos, ingresos ni correos. Nicolás configuró GTM y GA4 el 22-oct-2026; esta es la especificación de referencia.

**Eventos que el sitio ya envía al `dataLayer`**

| Evento | Cuándo | Parámetros |
|---|---|---|
| `signup_start` | Al pedir el código o pulsar Google en el bloque de registro (banners de aportes, prima, dólar, general y alerta del dólar) | `pagina`, `variante` (`aportes`, `prima`, `dolar`, `recordatorio`, `general`), `metodo` (`correo` o `google`) |
| `signup_complete` | Al verificar el código del correo | `pagina`, `variante`, `metodo` |
| `calc_result` | La primera vez que la persona usa una calculadora de la página | `pagina` (ruta) |
| `bank_click` | Clic en un enlace a un banco: banner de rendimiento y tabla de cuentas | `entidad`, `pagina` (ruta) |

Limitación: con Google, `signup_complete` no se dispara en el sitio (la persona sale a Google y vuelve a la app); el registro con Google se mide con `signup_start` y las altas nuevas de la app.

**En GTM**
1. Variables de capa de datos (versión 2): `pagina`, `variante`, `metodo`, `entidad`.
2. Una etiqueta *Google tag / GA4 config* con el ID `G-…` (disparador *All Pages*, consentimiento adicional `analytics_storage`).
3. Cuatro etiquetas *GA4 Event* con disparador *Evento personalizado* (nombre exacto del evento) y esos parámetros.
4. Los banners de rendimiento llevan además UTM en el enlace al banco: `utm_source=frilo&utm_medium=banner&utm_campaign={pagina}-{variante}`.

**En GA4**
1. Dimensiones personalizadas de alcance *evento*: `variante`, `metodo`, `entidad`, `pagina`.
2. Eventos clave: `signup_complete` y `bank_click`.
3. Administrar → Recopilación de datos: señales de Google y uso compartido de datos desactivados; retención 14 meses.
4. Informes sugeridos: embudo `calc_result` → `signup_start` → `signup_complete` por `pagina`; `bank_click` por `entidad`.

**Mejoras para después (código mío, cuando Nicolás lo pida)**
- `banner_view`: medir cuántas veces se ve cada banner (visibilidad al hacer scroll), con `variante` y `pagina`, para tener tasa de clic.
- Enviar `variante` en `bank_click` y un `cta_click` para los botones de "Probar la app" (ahora van a `app.frilo.dev` sin evento).
- Medir `signup_complete` de Google en la app (`/bienvenida`) con el mismo consentimiento.

## De Claude (cuando Nicolás lo indique)

1. ~~**Fase 4, publicación:**~~ (hecha) `app.frilo.dev` en el proyecto de la app; Supabase Auth, Google OAuth, enlaces de Resend y `NEXT_PUBLIC_APP_URL` a `app.frilo.dev`; `noindex` en la app; mover `frilo.dev` al proyecto del sitio; redirecciones (308 para `/api/*` de bajas en correos ya enviados); crear `PUBLICAR_SITIO=si`; verificar; Search Console.
2. ~~**Merge de `web-staging` a `main`**~~ (hecho) (incluye `/bienvenida` y las cookies compartidas, inactivas sin variable).
3. ~~**Páginas por diseñar:** `/glosario`~~ — publicado el 26-oct-2026 como una sola página con 5 términos (ARL, FSP, IBC, PILA, SLN) definidos en `apps/web/src/lib/glosario.ts` (única fuente de la página y del JSON-LD). Para agregar términos: sumar una entrada ahí.
4. **Actualización anual:** P01, P02, P03 y P05 en la primera quincena de diciembre; confirmar los festivos del año siguiente contra el calendario oficial (`ULTIMO_ANIO_FESTIVOS_VALIDADO` en `lib/app/planilla.ts`).
5. **Seguridad:** 2 avisos de PostCSS dentro de Next 15 (se corrigen con Next 16; afectan la compilación, no a los visitantes).
6. **Medición:** elegir herramienta de analítica para los eventos `signup_start`, `signup_complete`, `calc_result` y `bank_click` (hoy solo se empujan a `dataLayer` en producción).
7. **Imagen `og`:** hoy usa la fuente por defecto, no Clarity City.
