# Frilo · sitio de contenido (`apps/web`)

Sitio SEO de Frilo. La app sigue en la raíz del repositorio; este sitio importa su lógica compartida de `../../lib` (alias `@/lib/*`).

- Desarrollo: `npm run dev` (puerto 3003). Resuelve `next` y `react` desde `node_modules` de la raíz.
- Metadatos y JSON-LD: salen de `content/seo.json`, generado desde `docs/sitio-seo/URLs_SEO_sitio_Frilo.xlsx` con `npm run seo:json`.
- Estado y fecha de edición de cada página: `src/lib/paginas.ts` (solo las `construida` entran al sitemap y se indexan).
- Doble candado de publicación: solo es "producción" si `VERCEL_ENV === 'production'` **y** existe `PUBLICAR_SITIO=si`. Esa variable solo se crea con la instrucción de publicar.
- Fuera de producción (por ese candado): `X-Robots-Tag: noindex, nofollow` y `robots.txt` con `Disallow: /`.
- Variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_COOKIE_DOMAIN`, `NEXT_PUBLIC_GOOGLE_ACTIVO`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Las tasas de las cuentas y los parámetros del año viven solo en `lib/calculos` (una sola fuente para la app y el sitio).

## Despliegue en Vercel (proyecto `frilo-web`)

- Directorio raíz: `apps/web`, con "incluir archivos fuera del directorio raíz". Comando de instalación: `cd ../.. && npm install --legacy-peer-deps`.
- Instala las dependencias **solo en la raíz del repositorio**, igual que en local: así `lib/` y `app/` (que el sitio importa) y el sitio usan una sola copia de React. Dos copias dan el error "Cannot read properties of null (reading 'useState')".
- La rama `main` no se construye en este proyecto (paso de compilación ignorado); la vista previa sale de `web-staging`.
