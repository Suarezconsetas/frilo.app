import type { MetadataRoute } from 'next';

// La app (app.frilo.dev) no se indexa: el sitio de contenido (frilo.dev) es el que posiciona.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', disallow: '/' }] };
}
