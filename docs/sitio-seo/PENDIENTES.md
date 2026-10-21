# Pendientes del sitio de contenido

Actualizado el 21 de octubre de 2026 (después de la Fase 3). La publicación (Fase 4) solo ocurre con la instrucción explícita de Nicolás: "Publica el sitio en producción".

## De Nicolás

1. **Claves públicas de Supabase en `frilo-web`** (Vercel → frilo-web → Settings → Environment Variables, entorno Preview): `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Sin ellas, el registro del sitio no funciona en staging.
2. **Probar el registro de punta a punta** (cuando decida hacerlo). Las cookies compartidas no funcionan entre dos `*.vercel.app`, así que hacen falta dos alias:
   - `staging.frilo.dev` → proyecto `frilo-web` (el sitio).
   - `app-staging.frilo.dev` → proyecto `frilo-app` (la app, rama `web-staging`).
   - Variable `NEXT_PUBLIC_COOKIE_DOMAIN=.frilo.dev` en los dos proyectos, solo para vista previa.
   - **Supabase Auth → URL Configuration:** agregar `https://staging.frilo.dev/**` y `https://app-staging.frilo.dev/**` como *Redirect URLs* adicionales (sin quitar las de producción).
   - **Google Cloud → OAuth:** agregar `https://staging.frilo.dev` y `https://app-staging.frilo.dev` como orígenes de JavaScript autorizados (la URI de redirección de Supabase no cambia).
   - Claude agrega los alias en Vercel cuando Nicolás lo pida.
   - Ojo: con la cookie en `.frilo.dev`, esa sesión de prueba también la ve `frilo.dev` en ese navegador; conviene probar en una ventana privada.
3. **`/quienes-somos`:** Nicolás redacta la bio (trayectoria y experiencia) y el criterio de quien revisa el contenido ("equipo de finanzas Frilo"). Con eso se completa la página, se quita el borrador y entra al sitemap.
4. **Revisión del texto de P12** (cesantías para independientes): lo redactó Claude; que lo revise el equipo de finanzas.
5. **Política de datos** (para el abogado): cookies `frilo_ft` (primer contacto: UTM, gclid, referrer, página de entrada) y `frilo_intencion` (acción pendiente del registro); recordatorio de planilla; cambios acumulados.
6. **URL de redes** (cuando existan): agregar `sameAs` al JSON-LD de la Organización y de la Persona.

## De Claude (cuando Nicolás lo indique)

1. **Fase 4, publicación:** `app.frilo.dev` en el proyecto de la app; Supabase Auth, Google OAuth, enlaces de Resend y `NEXT_PUBLIC_APP_URL` a `app.frilo.dev`; `noindex` en la app; mover `frilo.dev` al proyecto del sitio; redirecciones (308 para `/api/*` de bajas en correos ya enviados); crear `PUBLICAR_SITIO=si`; verificar; Search Console.
2. **Merge de `web-staging` a `main`** (incluye `/bienvenida` y las cookies compartidas, inactivas sin variable).
3. **Páginas por diseñar:** `/glosario` (se indexa con 3 entradas), `/quienes-somos`.
4. **Actualización anual:** P01, P02, P03 y P05 en la primera quincena de diciembre; confirmar los festivos del año siguiente contra el calendario oficial (`ULTIMO_ANIO_FESTIVOS_VALIDADO` en `lib/app/planilla.ts`).
5. **Seguridad:** 2 avisos de PostCSS dentro de Next 15 (se corrigen con Next 16; afectan la compilación, no a los visitantes).
6. **Medición:** elegir herramienta de analítica para los eventos `signup_start`, `signup_complete`, `calc_result` y `bank_click` (hoy solo se empujan a `dataLayer` en producción).
7. **Imagen `og`:** hoy usa la fuente por defecto, no Clarity City.
