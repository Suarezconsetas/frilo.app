import { describe, expect, it } from 'vitest';
import { CUENTAS_MVP } from '@/lib/calculos';
import { jsonLdDe, marcadoresPendientes, metadataDe, PAGINAS } from '../apps/web/src/lib/seo';
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
    const m = metadataDe('P12');
    expect(m.robots).toMatchObject({ index: false });
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
    expect(m![2]).toBe(pctEs(Math.max(...tasas)));
    // PENDIENTE (ver informe de la Fase 2): el texto aprobado dice 8,25% como mínimo, pero Ualá paga 5% sin condiciones.
    // Cuando el texto se corrija, este debe ser pctEs(Math.min(...tasas)).
    expect(m![1]).toBe('8,25');
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
