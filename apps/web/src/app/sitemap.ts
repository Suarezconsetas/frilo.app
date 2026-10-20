import type { MetadataRoute } from 'next';
import { URL_SITIO } from '../lib/config';
import { estadoDe, fechaDe } from '../lib/paginas';
import { PAGINAS } from '../lib/seo';

// Solo las páginas que el Excel marca "En sitemap = Sí" y que ya están construidas. `lastmod` = fecha real de edición del contenido.
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGINAS.filter((p) => p.enSitemap && estadoDe(p.id) === 'construida').map((p) => ({
    url: `${URL_SITIO}${p.ruta === '/' ? '/' : p.ruta}`,
    lastModified: fechaDe(p.id),
    changeFrequency: p.frecuencia.startsWith('Anual') ? 'yearly' : p.frecuencia.startsWith('Diar') ? 'daily' : 'monthly',
    priority: p.id === 'Home' ? 1 : p.tipo === 'Herramienta' ? 0.9 : 0.6,
  }));
}
