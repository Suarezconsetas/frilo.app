# Frilo · sitio de contenido (`apps/web`)

Sitio SEO de Frilo. La app sigue en la raíz del repositorio; este sitio importa su lógica compartida de `../../lib` (alias `@/lib/*`).

- Desarrollo: `npm run dev` (puerto 3003). Resuelve `next` y `react` desde `node_modules` de la raíz.
- Metadatos y JSON-LD: salen de `content/seo.json`, generado desde `docs/sitio-seo/URLs_SEO_sitio_Frilo.xlsx` con `npm run seo:json`.
- Estado y fecha de edición de cada página: `src/lib/paginas.ts` (solo las `construida` entran al sitemap y se indexan).
- Fuera de producción (`VERCEL_ENV !== 'production'`): `X-Robots-Tag: noindex, nofollow` y `robots.txt` con `Disallow: /`.
- Variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_COOKIE_DOMAIN`, `NEXT_PUBLIC_GOOGLE_ACTIVO`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Las tasas de las cuentas y los parámetros del año viven solo en `lib/calculos` (una sola fuente para la app y el sitio).
