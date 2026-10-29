import { describe, expect, it } from 'vitest';
import { CUENTAS_MVP } from '@/lib/calculos';
import { jsonLdDe, marcadoresPendientes, metadataDe, PAGINAS, paginaPorId } from '../apps/web/src/lib/seo';
import { estadoDe } from '../apps/web/src/lib/paginas';
import { datosDePagina } from '../apps/web/src/lib/trm';

const serie = [
  { valor: 3200, vigenciadesde: '2026-10-08', vigenciahasta: '2026-10-08' },
  { valor: 3210, vigenciadesde: '2026-10-09', vigenciahasta: '2026-10-09' },
  { valor: 3180, vigenciadesde: '2026-10-10', vigenciahasta: '2026-10-13' },
  { valor: 3150.5, vigenciadesde: '2026-10-14', vigenciahasta: '2026-10-14' },
];

describe('TRM de la página Dólar hoy', () => {
  const d = datosDePagina(serie, new Date('2026-10-14T15:00:00-05:00'));
  it('muestra la TRM del día y su variación frente a la anterior', () => {
    expect(d.hoy).toBe(3150.5);
    expect(d.hoyTxt).toBe('$3.150,50');
    expect(d.verbo).toBe('bajó');
    expect(d.varAyerPct).toBe('0,93%');
    expect(d.fechaTitulo).toBe('miércoles 14 de octubre de 2026');
  });
  it('la tabla trae la serie más reciente primero, con variación diaria', () => {
    expect(d.filas[0]).toMatchObject({ trm: '$3.150,50' });
    expect(d.filas).toHaveLength(4);
  });
  it('sin datos no inventa cifras', () => {
    const v = datosDePagina([], new Date('2026-10-14T15:00:00-05:00'));
    expect(v.hayDatos).toBe(false);
    expect(v.hoyTxt).toBe('no disponible');
  });
});

describe('JSON-LD y metadatos desde el Excel', () => {
  it('el Excel trae las 22 páginas previstas', () => {
    expect(PAGINAS).toHaveLength(22);
  });
  it('sin sameAs (la marca aún no tiene redes)', () => {
    for (const p of PAGINAS) expect(JSON.stringify(p.jsonld ?? '')).not.toContain('sameAs');
  });
  it('las páginas estáticas no dejan marcadores sin resolver', () => {
    for (const id of ['Home', 'Hub-C', 'P01', 'P02', 'P03', 'P05', 'P06', 'P08', 'P09', 'P10', 'P11', 'P12', 'Hub-G', 'Legal-1', 'Legal-2']) {
      expect(marcadoresPendientes(id), id).toEqual([]);
    }
  });
  it('P07 se completa con los datos del día y repite lo que muestra la página', () => {
    const trm = { fechaTitulo: 'miércoles 14 de octubre de 2026', hoyTxt: '$3.150,50', desde: '14 oct 2026', fechaIso: '2026-10-14', desdeIso: '2026-09-15', hastaIso: '2026-10-14' };
    expect(marcadoresPendientes('P07', { trm })).toEqual([]);
    const texto = JSON.stringify(jsonLdDe('P07', { trm }));
    expect(texto).toContain('Hoy la TRM está en $3.150,50 pesos por dólar, vigente desde el 14 oct 2026.');
  });
  it('la lista de cuentas de P11 sale de cuentas.ts, ordenada por tasa', () => {
    const grafo = (jsonLdDe('P11') as { '@graph': { '@type': string; itemListElement?: { item: { provider: { name: string }; interestRate: { value: number } } }[] }[] })['@graph'];
    const lista = grafo.find((g) => g['@type'] === 'ItemList')!.itemListElement!;
    const esperadas = [...CUENTAS_MVP].filter((c) => c.verificada).sort((a, b) => b.tasaBaseEA - a.tasaBaseEA);
    expect(lista.map((x) => x.item.provider.name)).toEqual(esperadas.map((c) => c.entidad));
    expect(lista[0]!.item.interestRate.value).toBe(Math.round(esperadas[0]!.tasaBaseEA * 10000) / 100);
  });
  it('una página en borrador no se indexa aunque el Excel diga index', () => {
    const noConstruida = PAGINAS.find((p) => p.robots.startsWith('index') && estadoDe(p.id) !== 'construida');
    if (!noConstruida) return; // todas las páginas del Excel ya están construidas
    expect(metadataDe(noConstruida.id).robots).toMatchObject({ index: false });
  });
  it('la landing de pauta sale noindex, follow', () => {
    expect(metadataDe('SEM').robots).toMatchObject({ index: false, follow: true });
  });
});

import { readFileSync } from 'node:fs';
import { CUENTAS_USD } from '@/lib/calculos';

describe('el texto de las guías coincide con las tasas de cuentas.ts', () => {
  const leer = (f: string) => readFileSync(new URL(`../apps/web/src/paginas/${f}.tsx`, import.meta.url), 'utf8');
  const verif = (cs: typeof CUENTAS_MVP) => cs.filter((c) => c.verificada);
  const pctEs = (x: number) => String(Number((x * 100).toFixed(2))).replace('.', ',');

  it('P11: el rango "entre X% y Y%" de la respuesta corta es el de las cuentas en pesos', () => {
    const m = leer('P11').match(/entre (\d+(?:,\d+)?)% y (\d+(?:,\d+)?)%/);
    expect(m, 'no se encontró la frase "entre X% y Y%"').not.toBeNull();
    const tasas = verif(CUENTAS_MVP).map((c) => c.tasaBaseEA);
    expect(m![1]).toBe(pctEs(Math.min(...tasas)));
    expect(m![2]).toBe(pctEs(Math.max(...tasas)));
  });
  it('P11: la tasa más alta de Ualá con condiciones es la de los datos', () => {
    const uala = CUENTAS_MVP.find((c) => c.id === 'uala-deposito')!;
    expect(leer('P11')).toContain(`${pctEs(0.105)}%`);
    expect(uala.tasaEAHasta).toBe(0.105);
  });
  it('P08: las tasas en dólares que cita son las de los datos (Global66 y Littio)', () => {
    const texto = leer('P08');
    const global66 = CUENTAS_USD.find((c) => c.id === 'global66-cuenta-usd')!;
    const littio = CUENTAS_USD.find((c) => c.id === 'littio-bolsillos-usd')!;
    expect(texto).toContain(`${pctEs(global66.tasaEAHasta!)}% E.A.`);
    expect(texto).toContain(`${pctEs(littio.tasaEAHasta!)}% E.A.`);
  });
});

import { TERMINOS } from '../apps/web/src/lib/glosario';

describe('glosario', () => {
  it('el hub solo se publica con al menos tres términos', () => {
    if (estadoDe('Hub-Glo') === 'construida') expect(TERMINOS.length).toBeGreaterThanOrEqual(3);
  });
  it('el JSON-LD del hub lista todos los términos y repite la definición visible', () => {
    const grafo = (jsonLdDe('Hub-Glo') as { '@graph': Record<string, unknown>[] })['@graph'];
    const set = grafo.find((g) => g['@type'] === 'CollectionPage') as { mainEntity: { hasDefinedTerm: { '@id': string }[] } };
    expect(set.mainEntity.hasDefinedTerm).toHaveLength(TERMINOS.length);
    for (const t of TERMINOS.filter((x) => !x.pagina)) {
      const nodo = grafo.find((g) => g['@type'] === 'DefinedTerm' && g.name === t.sigla) as { description: string };
      expect(nodo.description).toBe(t.definicion);
    }
  });
  it('las cifras del glosario salen de los parámetros del año', () => {
    const ibc = TERMINOS.find((t) => t.id === 'ibc')!.definicion;
    expect(ibc).toContain('$1.750.905');
    expect(ibc).toContain('$43.772.625');
  });
});

describe('datos estructurados de /dolar-hoy', () => {
  it('el Dataset de la TRM tiene creator válido (Organization) y licencia', () => {
    const grafo = (jsonLdDe('P07') as { '@graph': Record<string, unknown>[] })['@graph'];
    const d = grafo.find((g) => g['@type'] === 'Dataset') as { creator: { '@type': string; name: string }; license: string };
    expect(d.creator['@type']).toBe('Organization');
    expect(d.creator.name).toBe('Superintendencia Financiera de Colombia');
    expect(d.license).toMatch(/^https:\/\/creativecommons\.org\//);
  });
});

import sitemap from '../apps/web/src/app/sitemap';

describe('sitemap', () => {
  it('incluye el hub del glosario y su entrada SLN, y solo páginas construidas', () => {
    const urls = sitemap().map((u) => u.url);
    expect(urls).toContain('https://frilo.dev/glosario');
    expect(urls).toContain('https://frilo.dev/glosario/sln');
    expect(urls).toHaveLength(PAGINAS.filter((p) => p.enSitemap && estadoDe(p.id) === 'construida').length);
  });
});

import { existsSync } from 'node:fs';

describe('datos estructurados enriquecidos', () => {
  const grafoDe = (id: string) => ((jsonLdDe(id) as { '@graph': Record<string, unknown>[] } | null)?.['@graph'] ?? []) as Record<string, any>[];
  const conJsonLd = PAGINAS.filter((p) => jsonLdDe(p.id));

  it('el logo de Organization existe como archivo PNG cuadrado', () => {
    for (const p of conJsonLd) {
      const org = grafoDe(p.id).find((g) => g['@type'] === 'Organization')!;
      expect(org.logo.url).toMatch(/\.png$/);
      expect(existsSync(`apps/web/public${new URL(org.logo.url).pathname}`)).toBe(true);
      expect(org.founder['@id']).toContain('#nicolas');
    }
  });
  it('cada página enlaza su ruta de navegación por @id', () => {
    for (const p of conJsonLd) {
      const g = grafoDe(p.id);
      const ruta = g.find((x) => x['@type'] === 'BreadcrumbList');
      if (!ruta) continue;
      expect(ruta['@id']).toMatch(/#breadcrumb$/);
      const pagina = g.find((x) => ['WebPage', 'CollectionPage'].includes(x['@type']) || (Array.isArray(x['@type']) && x['@type'].includes('AboutPage')));
      expect(pagina?.breadcrumb?.['@id']).toBe(ruta['@id']);
    }
  });
  it('Nicolás tiene descripción y rol, y /quienes-somos es página de perfil', () => {
    const nicolas = grafoDe('Inst-1').find((g) => g['@type'] === 'Person')!;
    expect(nicolas.description).toContain('SEO');
    expect(nicolas.worksFor['@id']).toContain('#organization');
    const pagina = grafoDe('Inst-1').find((g) => Array.isArray(g['@type']) && g['@type'].includes('ProfilePage'))!;
    expect(pagina.mainEntity['@id']).toContain('#nicolas');
  });
  it('las guías enlazan los términos del glosario que tratan', () => {
    const pagina = grafoDe('P02').find((g) => g['@type'] === 'WebPage')!;
    expect(pagina.about[0].name).toBe('IBC');
    expect(pagina.about[0].url).toBe('https://frilo.dev/glosario#ibc');
  });
  it('no se publican calificaciones ni reseñas inventadas', () => {
    for (const p of conJsonLd) expect(JSON.stringify(jsonLdDe(p.id))).not.toMatch(/AggregateRating|"Review"|ratingValue/);
  });
});

import { MENU_CALCULADORAS, MENU_GUIAS, SIGUE_CON } from '../apps/web/src/lib/enlaces';

describe('enlazado interno', () => {
  const rutas = new Set(PAGINAS.map((p) => p.ruta));
  const destinos = [...MENU_CALCULADORAS.enlaces, ...MENU_GUIAS.enlaces, ...Object.values(SIGUE_CON).flat()].map((e) => e.href);

  it('el menú y los bloques «Sigue con» solo apuntan a páginas que existen', () => {
    for (const href of destinos) expect(rutas.has(href), href).toBe(true);
  });

  it('cada página de contenido tiene entre 2 y 5 enlaces «Sigue con» y ninguno a sí misma', () => {
    for (const [id, enlaces] of Object.entries(SIGUE_CON)) {
      expect(enlaces.length, id).toBeGreaterThanOrEqual(2);
      expect(enlaces.length, id).toBeLessThanOrEqual(5);
      const propia = PAGINAS.find((p) => p.id === id)?.ruta;
      expect(enlaces.map((e) => e.href), id).not.toContain(propia);
    }
  });

  it('la calculadora de cesantías y la cuenta en dólares tienen entradas desde varias páginas (E5)', () => {
    const entrantes = (href: string) => Object.entries(SIGUE_CON).filter(([, l]) => l.some((e) => e.href === href)).length;
    expect(entrantes('/calculadoras/cesantias')).toBeGreaterThanOrEqual(5);
    expect(entrantes('/guias/cuenta-en-dolares-colombia')).toBeGreaterThanOrEqual(5);
  });

  it('las páginas generadas enlazan siglas al glosario y la línea de confianza a quiénes somos', () => {
    const p01 = readFileSync('apps/web/src/paginas/P01.tsx', 'utf8');
    expect(p01).toContain('href="/glosario#');
    expect(p01).toContain('href="/quienes-somos"');
    expect(p01).toContain('href="/metodologia"');
    expect(readFileSync('apps/web/src/paginas/P02.tsx', 'utf8')).not.toContain('href="/glosario#ibc"');
  });
});

describe('fechas de los datos estructurados', () => {
  it('dateModified, lastReviewed y datePublished llevan fecha, hora y zona', () => {
    const fechas = [...JSON.stringify(jsonLdDe('P01')).matchAll(/"(?:dateModified|lastReviewed|datePublished|dateCreated)":"([^"]+)"/g)].map((m) => m[1]);
    expect(fechas.length).toBeGreaterThan(0);
    for (const f of fechas) expect(f).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[-+]\d{2}:\d{2}$/);
  });
});

describe('CSS de los campos (móvil)', () => {
  it('ninguna regla usa «font: … inherit» (inválida: deja los campos en 13 px y iOS hace zoom)', () => {
    const archivos = ['apps/web/src/app/globals.css', 'apps/web/src/paginas/wireframes.css', 'apps/web/src/components/HeroCalculo.tsx', 'apps/web/src/dinamicos/InteresCompuesto.tsx', 'apps/web/src/dinamicos/CalculadoraCesantias.tsx', 'apps/web/src/dinamicos/VistaP10b2.tsx'];
    for (const a of archivos) expect(readFileSync(a, 'utf8'), a).not.toMatch(/font:\s*['"]?\d{3} [\d.]+px\/[\d.]+ inherit/);
  });
});

describe('móvil', () => {
  it('las columnas de las páginas generadas no fijan un mínimo mayor que el ancho disponible', () => {
    for (const f of ['Home', 'P01', 'Hub-C']) expect(readFileSync(`apps/web/src/paginas/${f}.tsx`, 'utf8'), f).not.toMatch(/minmax\(\d+px, 1fr\)/);
  });
  it('el ajuste del ingreso está en las calculadoras principales', () => {
    expect(readFileSync('apps/web/src/dinamicos/VistaP01b1.tsx', 'utf8')).toContain('{ajuste}');
    expect(readFileSync('apps/web/src/components/HeroCalculo.tsx', 'utf8')).toContain('AjusteIngreso');
    expect(readFileSync('apps/web/src/dinamicos/VistaP03b1.tsx', 'utf8')).toContain('{ajusteSalario}');
  });
});

describe('H1 del Home', () => {
  it('lleva las palabras clave y «Frilo» es un H2', () => {
    expect(paginaPorId('Home').h1).toMatch(/^Calculadoras gratis para independientes/);
    const home = readFileSync('apps/web/src/paginas/Home.tsx', 'utf8');
    expect(home).toMatch(/<h1[^>]*>\s*Calculadoras gratis/);
    expect(home).toMatch(/<h2 className="home-marca"/);
  });
});

describe('banner de la app en el Home', () => {
  it('está en el Home, enlaza a la app y mide el clic', () => {
    expect(readFileSync('apps/web/src/paginas/Home.tsx', 'utf8')).toContain('{dinamicos.app}');
    const banner = readFileSync('apps/web/src/components/BannerApp.tsx', 'utf8');
    expect(banner).toContain('href={URL_APP}');
    expect(banner).toContain('data-evento="cta_click"');
    for (const img of ['aportes', 'ahorro', 'dolar']) expect(existsSync(`apps/web/public/capturas/${img}.jpg`)).toBe(true);
  });
});
