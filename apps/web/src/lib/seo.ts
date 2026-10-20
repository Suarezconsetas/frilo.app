import type { Metadata } from 'next';
import datos from '../../content/seo.json';
import { URL_SITIO } from './config';
import { estadoDe, fechaDe } from './paginas';

export interface PaginaSeo {
  id: string;
  nombre: string;
  ruta: string;
  tipo: string;
  wireframe: string;
  estado: string;
  robots: string;
  enSitemap: boolean;
  canonical: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  ogType: string;
  tiposSchema: string;
  breadcrumb: string;
  frecuencia: string;
  notas: string;
  jsonld: unknown;
}

export const PAGINAS = datos as PaginaSeo[];

export function paginaPorId(id: string): PaginaSeo {
  const p = PAGINAS.find((x) => x.id === id);
  if (!p) throw new Error(`No hay una página "${id}" en content/seo.json`);
  return p;
}
export const paginaPorRuta = (ruta: string): PaginaSeo | undefined => PAGINAS.find((p) => p.ruta === ruta);

/** Imagen para compartir (1200×630) de cada página: `/og/<ruta>.png` (`/og/home.png` para la raíz). */
export const rutaOg = (ruta: string): string => `/og/${ruta === '/' ? 'home' : ruta.replace(/^\//, '')}.png`;

/** Metadatos de una página tomados del Excel: title, description, canonical, robots, Open Graph y Twitter. */
export function metadataDe(id: string): Metadata {
  const p = paginaPorId(id);
  // Solo se indexa lo que el Excel marca como index Y está construido con su contenido final.
  const indexar = p.robots.trim().toLowerCase().startsWith('index') && estadoDe(id) === 'construida';
  const seguir = !p.robots.toLowerCase().includes('nofollow');
  const canonical = `${URL_SITIO}${p.ruta === '/' ? '/' : p.ruta}`;
  return {
    title: { absolute: p.title },
    description: p.description || undefined,
    alternates: { canonical },
    robots: indexar
      ? { index: true, follow: seguir, 'max-image-preview': 'large', 'max-snippet': -1 }
      : { index: false, follow: p.robots.toLowerCase().includes('follow') && seguir },
    openGraph: {
      type: p.ogType === 'article' ? 'article' : 'website',
      locale: 'es_CO',
      siteName: 'Frilo',
      title: p.title,
      description: p.description || undefined,
      url: canonical,
      images: [{ url: `${URL_SITIO}${rutaOg(p.ruta)}`, width: 1200, height: 630, alt: p.h1 }],
    },
    twitter: { card: 'summary_large_image', title: p.title, description: p.description || undefined, images: [`${URL_SITIO}${rutaOg(p.ruta)}`] },
  };
}

const MARCADOR = /\[[^\]]{3,}\]/;

/** JSON-LD de la página con las fechas reales de edición (`dateModified`, `lastReviewed`, `datePublished`). */
export function jsonLdDe(id: string): unknown {
  const p = paginaPorId(id);
  if (!p.jsonld) return null;
  const fecha = fechaDe(id);
  const recorrer = (o: unknown, clave = ''): unknown => {
    if (Array.isArray(o)) return o.map((x) => recorrer(x, clave));
    if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, recorrer(v, k)]));
    if (typeof o === 'string' && MARCADOR.test(o) && ['dateModified', 'lastReviewed', 'datePublished'].includes(clave)) return fecha;
    return o;
  };
  return recorrer(p.jsonld);
}

/** Marcadores `[...]` que siguen sin resolver en el JSON-LD de una página (para el checklist y los avisos `[VERIFICAR]`). */
export function marcadoresPendientes(id: string): string[] {
  const texto = JSON.stringify(jsonLdDe(id) ?? '');
  return [...new Set(texto.match(/\[[^\]]{3,}\]/g) ?? [])];
}
