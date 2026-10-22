# Pendientes del sitio de contenido

Actualizado el 22 de octubre de 2026. La publicación (Fase 4) solo ocurre con la instrucción explícita de Nicolás: "Publica el sitio en producción".

## De Nicolás

Hechos el 22-oct-2026: claves públicas de Supabase en `frilo-web` (las puso Claude), alias `staging.frilo.dev` y `app-staging.frilo.dev`, URL en Supabase Auth y Google OAuth, prueba de registro con código y con Google, `/quienes-somos` con su texto y la línea "Escrito y revisado por Nicolás Suárez con fuentes oficiales".

1. **Probar la casilla de novedades:** marcada y sin marcar, y revisar la fila `marketing_frilo` en `autorizaciones` (otorgada true/false).
2. **Revisión del texto de P12** (cesantías para independientes): lo redactó Claude; Nicolás lo revisa contra fuentes oficiales (o lo valida un contador).
3. **Política de datos** (para el abogado): cookies `frilo_marketing`, `frilo_ft` y `frilo_intencion`; recordatorio de planilla; cambios acumulados; subir `VERSION_POLITICA` si él lo indica.
4. **Capturas del Home:** muestran datos reales de la cuenta de Nicolás; cambiarlas por una cuenta de prueba antes de publicar.
5. **Vercel Cron:** confirmar que aparecen los dos cron (`/api/cron/trm` diario y `/api/cron/resumen-semanal` los viernes).
6. **Plantilla de correo de Supabase:** revisar el texto del código de verificación.
7. **Tasas de Lulo:** no se verifican automáticamente; revisar a mano cada semana (tarea programada, informe los lunes).
8. **URL de redes** (cuando existan): agregar `sameAs` al JSON-LD de la Organización y de la Persona.
9. **Foto para `/quienes-somos`** (opcional).

## De Claude (cuando Nicolás lo indique)

1. **Fase 4, publicación:** `app.frilo.dev` en el proyecto de la app; Supabase Auth, Google OAuth, enlaces de Resend y `NEXT_PUBLIC_APP_URL` a `app.frilo.dev`; `noindex` en la app; mover `frilo.dev` al proyecto del sitio; redirecciones (308 para `/api/*` de bajas en correos ya enviados); crear `PUBLICAR_SITIO=si`; verificar; Search Console.
2. **Merge de `web-staging` a `main`** (incluye `/bienvenida` y las cookies compartidas, inactivas sin variable).
3. **Páginas por diseñar:** `/glosario` (se indexa con 3 entradas).
4. **Actualización anual:** P01, P02, P03 y P05 en la primera quincena de diciembre; confirmar los festivos del año siguiente contra el calendario oficial (`ULTIMO_ANIO_FESTIVOS_VALIDADO` en `lib/app/planilla.ts`).
5. **Seguridad:** 2 avisos de PostCSS dentro de Next 15 (se corrigen con Next 16; afectan la compilación, no a los visitantes).
6. **Medición:** elegir herramienta de analítica para los eventos `signup_start`, `signup_complete`, `calc_result` y `bank_click` (hoy solo se empujan a `dataLayer` en producción).
7. **Imagen `og`:** hoy usa la fuente por defecto, no Clarity City.
