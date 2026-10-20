#!/usr/bin/env node
/**
 * Compara el sitio en ejecución con el Excel (content/seo.json) y revisa lo básico de cada página.
 * Uso: node scripts/verificar-seo.mjs [https://url-base] [--todas]
 *  - Páginas "construida": 200, title, meta description, canonical, meta robots, H1, JSON-LD válido y sin marcadores [VERIFICAR].
 *  - Páginas en borrador/pendiente: deben responder 200 (si existen) y NO indexarse.
 *  - Todas: enlaces internos sin 404.
 * Sale con código 1 si hay diferencias.
 */
import { readFileSync } from 'node:fs';

const base = (process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'http://localhost:3003').replace(/\/$/, '');
const paginas = JSON.parse(readFileSync(new URL('../content/seo.json', import.meta.url), 'utf8'));
const estados = (() => {
  const t = readFileSync(new URL('../src/lib/paginas.ts', import.meta.url), 'utf8');
  const m = {};
  for (const [, id, e] of t.matchAll(/['"]?([\w-]+)['"]?:\s*'(construida|borrador|pendiente)'/g)) m[id] = e;
  return m;
})();

const decod = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const quitaTags = (s) => decod(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const meta = (html, nombre) => decod(html.match(new RegExp(`<meta name="${nombre}" content="([^"]*)"`))?.[1] ?? '');
const canonico = (html) => decod(html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '');
const titulo = (html) => quitaTags(html.replace(/<svg[\s\S]*?<\/svg>/g, '').match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? '');
const h1s = (html) => [...html.matchAll(/<h1[\s\S]*?<\/h1>/g)].map((m) => quitaTags(m[0]));

const problemas = [];
const ok = [];
const enlaces = new Set();

for (const p of paginas) {
  const estado = estados[p.id] ?? 'pendiente';
  const r = await fetch(base + p.ruta, { redirect: 'manual' }).catch(() => null);
  if (!r || r.status !== 200) {
    if (estado === 'construida') problemas.push(`${p.ruta}: respondió ${r?.status ?? 'sin respuesta'} (debería ser 200)`);
    else ok.push(`${p.ruta}: ${r?.status ?? '—'} (${estado}, aún no construida)`);
    continue;
  }
  const html = await r.text();
  const robots = meta(html, 'robots');
  const falla = [];
  if (estado === 'construida') {
    if (titulo(html) !== p.title) falla.push(`title: "${titulo(html)}" ≠ "${p.title}"`);
    if (p.description && meta(html, 'description') !== p.description) falla.push(`meta description distinta`);
    const canon = canonico(html);
    const raiz = p.ruta === '/';
    if (raiz ? canon.replace(/\/$/, '') !== p.canonical.replace(/\/$/, '') : !canon.endsWith(p.ruta)) falla.push(`canonical: ${canon}`);
    const esperaIndex = p.robots.toLowerCase().startsWith('index');
    // En pruebas/local la cabecera X-Robots-Tag es noindex; aquí se mira la meta de la página.
    if (esperaIndex !== !robots.includes('noindex')) falla.push(`meta robots: "${robots}" (Excel: ${p.robots})`);
    if (p.id !== 'SEM') {
      const [h1] = h1s(html);
      // El H1 de P07 lleva la fecha del día: el Excel la deja como marcador [fecha dinámica].
      const esperado = p.h1.replace(/\[[^\]]+\]/, '');
      if (p.id !== 'Home' && !(p.h1.includes('[') ? (h1 ?? '').startsWith(esperado.trim()) : h1 === p.h1)) falla.push(`H1: "${h1}" ≠ "${p.h1}"`);
      if (p.id === 'Home' && !/Frilo/.test(h1 ?? '')) falla.push(`H1 de la Home: "${h1}"`);
    }
    if (h1s(html).length !== 1) falla.push(`hay ${h1s(html).length} H1`);
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (p.jsonld && ld.length !== 1) falla.push(`JSON-LD: ${ld.length} bloques (debe ser 1 con @graph)`);
    for (const [, j] of ld) {
      try {
        const o = JSON.parse(j);
        if (!Array.isArray(o['@graph'])) falla.push('JSON-LD sin @graph');
        const marcadores = new Set();
        const buscar = (v) => {
          if (typeof v === 'string') (v.match(/\[[^\]]{3,}\]/g) ?? []).forEach((m) => marcadores.add(m));
          else if (v && typeof v === 'object') Object.values(v).forEach(buscar);
        };
        buscar(o);
        if (marcadores.size) falla.push(`JSON-LD con marcadores sin resolver: ${[...marcadores].join(', ')}`);
      } catch {
        falla.push('JSON-LD no es JSON válido');
      }
    }
    if (/\[VERIFICAR\]/.test(html)) falla.push('la página muestra [VERIFICAR]');
  } else if (!robots.includes('noindex')) {
    falla.push(`en borrador pero sin noindex ("${robots}")`);
  }
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) enlaces.add(m[1]);
  (falla.length ? problemas : ok).push(falla.length ? `${p.ruta}: ${falla.join(' · ')}` : `${p.ruta}: bien (${estado})`);
}

// Enlaces internos sin 404
const vistos = [...enlaces].filter((h) => !/\.(png|jpg|svg|ico|css|js|webmanifest|txt|xml)$/.test(h) && !h.startsWith('/_next') && !h.startsWith('/og/'));
for (const h of vistos.sort()) {
  const r = await fetch(base + h, { redirect: 'manual' }).catch(() => null);
  if (!r || r.status >= 400) problemas.push(`enlace roto: ${h} → ${r?.status ?? 'sin respuesta'}`);
}

console.log(`Base: ${base}\n`);
for (const l of ok) console.log('✅', l);
for (const l of problemas) console.log('❌', l);
console.log(`\n${ok.length} bien · ${problemas.length} con problemas · ${vistos.length} enlaces internos revisados`);
process.exit(problemas.length ? 1 : 0);
