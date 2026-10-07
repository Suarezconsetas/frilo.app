import type { MetadataRoute } from 'next';
import { URL_SITIO } from '@/lib/sitio';

// Solo las páginas públicas: la bienvenida, el acceso y los textos legales.
export default function sitemap(): MetadataRoute.Sitemap {
  const paginas: { ruta: string; prioridad: number }[] = [
    { ruta: '/', prioridad: 1 },
    { ruta: '/entrar', prioridad: 0.5 },
    { ruta: '/politica-de-datos', prioridad: 0.3 },
    { ruta: '/terminos', prioridad: 0.3 },
  ];
  return paginas.map((p) => ({ url: `${URL_SITIO}${p.ruta}`, changeFrequency: 'monthly', priority: p.prioridad }));
}
