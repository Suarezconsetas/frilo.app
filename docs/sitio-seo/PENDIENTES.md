# Pendientes del sitio de contenido

Actualizado el 22 de octubre de 2026. La publicación (Fase 4) solo ocurre con la instrucción explícita de Nicolás: "Publica el sitio en producción".

## De Nicolás

Hechos hasta el 22-oct-2026: claves de Supabase y alias de staging, URL en Supabase Auth y Google OAuth, pruebas de registro (código y Google), `/quienes-somos` (sin foto ni redes por ahora), línea "Escrito y revisado por Nicolás Suárez con fuentes oficiales", revisión de P12, revisión legal de la política de datos, versión de la política `2026-10-22` (cookies, recordatorio, casilla de novedades en el sitio), cron de Vercel verificados, plantilla de correo de Supabase, Home con las capturas actuales (decisión de Nicolás).

1. **Probar la casilla de novedades:** marcada y sin marcar, y revisar la fila `marketing_frilo` en `autorizaciones` (otorgada true/false).
2. **Tasas de Lulo:** revisar a mano cada semana (tarea programada, informe los lunes).
3. **Redes sociales y foto de `/quienes-somos`:** fuera de alcance por ahora.

## De Claude (cuando Nicolás lo indique)

1. **Fase 4, publicación:** `app.frilo.dev` en el proyecto de la app; Supabase Auth, Google OAuth, enlaces de Resend y `NEXT_PUBLIC_APP_URL` a `app.frilo.dev`; `noindex` en la app; mover `frilo.dev` al proyecto del sitio; redirecciones (308 para `/api/*` de bajas en correos ya enviados); crear `PUBLICAR_SITIO=si`; verificar; Search Console.
2. **Merge de `web-staging` a `main`** (incluye `/bienvenida` y las cookies compartidas, inactivas sin variable).
3. **Páginas por diseñar:** `/glosario` (se indexa con 3 entradas).
4. **Actualización anual:** P01, P02, P03 y P05 en la primera quincena de diciembre; confirmar los festivos del año siguiente contra el calendario oficial (`ULTIMO_ANIO_FESTIVOS_VALIDADO` en `lib/app/planilla.ts`).
5. **Seguridad:** 2 avisos de PostCSS dentro de Next 15 (se corrigen con Next 16; afectan la compilación, no a los visitantes).
6. **Medición:** elegir herramienta de analítica para los eventos `signup_start`, `signup_complete`, `calc_result` y `bank_click` (hoy solo se empujan a `dataLayer` en producción).
7. **Imagen `og`:** hoy usa la fuente por defecto, no Clarity City.
