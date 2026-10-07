import type { MetadataRoute } from 'next';
import { URL_SITIO } from '@/lib/sitio';

// Las pantallas privadas se excluyen con X-Robots-Tag (next.config.ts); aquí solo se cierra lo que no es una página.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/auth/'] }],
    sitemap: `${URL_SITIO}/sitemap.xml`,
  };
}
