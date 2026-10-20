import type { MetadataRoute } from 'next';
import { ES_PRODUCCION, URL_SITIO } from '../lib/config';

// Producción: se permite todo menos /api/ y /app/ (la app vive en app.frilo.dev). La landing de pauta (/lp/) NO se bloquea
// aquí: lleva noindex, y un buscador solo puede leer ese noindex si puede entrar a la página.
// Cualquier otro ambiente (vistas previas, local): Disallow total. No se bloquean GPTBot, ClaudeBot ni PerplexityBot.
export default function robots(): MetadataRoute.Robots {
  if (!ES_PRODUCCION) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/app/'] }], sitemap: `${URL_SITIO}/sitemap.xml` };
}
