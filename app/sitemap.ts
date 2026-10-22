import type { MetadataRoute } from 'next';

// La app no se indexa (ver robots.ts), así que no publica sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
