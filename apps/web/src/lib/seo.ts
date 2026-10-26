import type { Metadata } from 'next';
import { CUENTAS_MVP } from '@/lib/calculos';
import datos from '../../content/seo.json';
import { URL_SITIO } from './config';
import { NOMBRE_GLOSARIO, TERMINOS } from './glosario';
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

/** Primera oración visible del artículo de P06 (el JSON-LD DefinedTerm debe decir lo mismo que la página). */
export const PRIMERA_ORACION_P06 =
  'La PILA (Planilla Integrada de Liquidación de Aportes) es el formato único, electrónico o asistido, con el que trabajadores y empleadores liquidan y pagan en un solo trámite salud, pensión, riesgos laborales, caja de compensación y parafiscales.';

/** Datos que cambian cada día y que el JSON-LD de P07 debe repetir tal como los muestra la página. */
export interface DinamicosJsonLd {
  trm?: { fechaTitulo: string; hoyTxt: string; desde: string; fechaIso: string; desdeIso: string; hastaIso: string };
}

/** JSON-LD de la página con las fechas reales de edición (`dateModified`, `lastReviewed`, `datePublished`) y los datos del día. */
export function jsonLdDe(id: string, dinamicos: DinamicosJsonLd = {}): unknown {
  const p = paginaPorId(id);
  if (!p.jsonld) return null;
  const fecha = fechaDe(id);
  // La lista de cuentas de P11 sale de cuentas.ts (una sola fuente de tasas), no del Excel.
  const base = id === 'P11' ? conCuentasActuales(p.jsonld) : id === 'Hub-Glo' ? conTerminosActuales(p.jsonld) : p.jsonld;
  const t = dinamicos.trm;
  const texto = (s: string, clave: string): string => {
    if (!MARCADOR.test(s)) return s;
    if (['dateModified', 'lastReviewed', 'datePublished'].includes(clave)) return id === 'P07' && t ? t.fechaIso : fecha;
    let r = s;
    if (id === 'P06') r = r.replace('[Primera oración visible de la página]', PRIMERA_ORACION_P06);
    if (id === 'P07' && t) {
      r = r.replace('[fecha dinámica]', t.fechaTitulo).replace('[últimos 30 días, dinámico]', `${t.desdeIso}/${t.hastaIso}`).replace('[X.XXX,XX]', t.hoyTxt.replace('$', '')).replace('[fecha]', t.desde);
      r = r.replace('Hoy la TRM está en ' + t.hoyTxt.replace('$', ''), 'Hoy la TRM está en ' + t.hoyTxt);
    }
    // En el hub de calculadoras el nombre no lleva fecha: "Dólar hoy en Colombia (TRM)".
    if (id === 'Hub-C') r = r.replace(': TRM del [fecha dinámica]', ' (TRM)');
    return r;
  };
  const recorrer = (o: unknown, clave = ''): unknown => {
    if (Array.isArray(o)) return o.map((x) => recorrer(x, clave));
    if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, recorrer(v, k)]));
    return typeof o === 'string' ? texto(o, clave) : o;
  };
  return arreglarDatasets(recorrer(base));
}

/**
 * Google exige en un Dataset `creator` de tipo Organization o Person (no GovernmentOrganization) y recomienda `license`.
 * La TRM se publica en datos.gov.co bajo Creative Commons Atribución-CompartirIgual 4.0 (campo de licencia del conjunto 32sa-8pi3).
 */
const LICENCIA_TRM = 'https://creativecommons.org/licenses/by-sa/4.0/';
function arreglarDatasets(o: unknown): unknown {
  if (Array.isArray(o)) return o.map(arreglarDatasets);
  if (o && typeof o === 'object') {
    const r = Object.fromEntries(Object.entries(o).map(([k, v]) => [k, arreglarDatasets(v)])) as Record<string, unknown>;
    if (r['@type'] === 'Dataset') {
      const creador = r.creator as Record<string, unknown> | undefined;
      return {
        ...r,
        creator: creador ? { ...creador, '@type': 'Organization', url: creador.url ?? 'https://www.superfinanciera.gov.co/' } : creador,
        license: r.license ?? LICENCIA_TRM,
        isAccessibleForFree: true,
      };
    }
    return r;
  }
  return o;
}

/** Marcadores `[...]` que siguen sin resolver en el JSON-LD de una página (para el checklist y los avisos `[VERIFICAR]`). */
export function marcadoresPendientes(id: string, dinamicos: DinamicosJsonLd = {}): string[] {
  const encontrados = new Set<string>();
  const recorrer = (v: unknown) => {
    if (typeof v === 'string') (v.match(/\[[^\]]{3,}\]/g) ?? []).forEach((m) => encontrados.add(m));
    else if (Array.isArray(v)) v.forEach(recorrer);
    else if (v && typeof v === 'object') Object.values(v).forEach(recorrer);
  };
  recorrer(jsonLdDe(id, dinamicos));
  return [...encontrados];
}

/** El DefinedTermSet del glosario sale de `glosario.ts`: los mismos términos y definiciones que muestra la página. */
function conTerminosActuales(jsonld: unknown): unknown {
  const grafo = (jsonld as { '@graph'?: Record<string, unknown>[] })['@graph'];
  if (!grafo) return jsonld;
  const idDe = (t: (typeof TERMINOS)[number]) => (t.pagina ? `${URL_SITIO}${t.pagina}#term` : `${URL_SITIO}/glosario#${t.id}`);
  const nodos = TERMINOS.filter((t) => !t.pagina).map((t) => ({
    '@type': 'DefinedTerm',
    '@id': idDe(t),
    name: t.sigla,
    alternateName: t.nombre,
    description: t.definicion,
    inDefinedTermSet: { '@type': 'DefinedTermSet', '@id': `${URL_SITIO}/glosario`, name: NOMBRE_GLOSARIO },
  }));
  return {
    ...(jsonld as object),
    '@graph': [
      ...grafo.map((g) =>
        g['@type'] === 'CollectionPage'
          ? { ...g, mainEntity: { '@type': 'DefinedTermSet', '@id': `${URL_SITIO}/glosario`, name: NOMBRE_GLOSARIO, hasDefinedTerm: TERMINOS.map((t) => ({ '@id': idDe(t) })) } }
          : g,
      ),
      ...nodos,
    ],
  };
}

function conCuentasActuales(jsonld: unknown): unknown {
  const grafo = (jsonld as { '@graph'?: Record<string, unknown>[] })['@graph'];
  if (!grafo) return jsonld;
  const cuentas = [...CUENTAS_MVP].filter((c) => c.verificada).sort((a, b) => b.tasaBaseEA - a.tasaBaseEA);
  return {
    ...(jsonld as object),
    '@graph': grafo.map((g) =>
      g['@type'] === 'ItemList'
        ? {
            ...g,
            itemListElement: cuentas.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'DepositAccount',
                name: c.producto,
                provider: { '@type': 'BankOrCreditUnion', name: c.entidad },
                interestRate: { '@type': 'QuantitativeValue', value: Math.round(c.tasaBaseEA * 10000) / 100, unitText: '% E.A.' },
              },
            })),
          }
        : g,
    ),
  };
}
