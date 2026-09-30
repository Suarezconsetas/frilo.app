/** Formato colombiano: punto de miles, coma decimal. `$5.035.333`, `9,50%`, TRM `$4.000,00`. */

function conMiles(entero: string): string {
  return entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function numero(valor: number, decimales: number): string {
  const [ent = '0', dec] = Math.abs(valor).toFixed(decimales).split('.');
  return conMiles(ent) + (dec ? `,${dec}` : '');
}

/** Pesos sin decimales: `$5.035.333`. Los negativos llevan el signo menos tipográfico. */
export function pesos(valor: number): string {
  const redondeado = Math.round(valor);
  return `${redondeado < 0 ? '−' : ''}$${numero(redondeado, 0)}`;
}

/** Pesos con dos decimales (TRM): `$4.000,00`. */
export function pesosConDecimales(valor: number): string {
  return `${valor < 0 ? '−' : ''}$${numero(valor, 2)}`;
}

/** Porcentaje desde una fracción: `pct(0.114, 1)` → `11,4%`. */
export function pct(fraccion: number, decimales = 1): string {
  return `${fraccion < 0 ? '−' : ''}${numero(fraccion * 100, decimales)}%`;
}

/** Variación con signo explícito: `+0,37%` / `−1,51%`. */
export function pctConSigno(fraccion: number, decimales = 2): string {
  const signo = fraccion > 0 ? '+' : fraccion < 0 ? '−' : '';
  return `${signo}${numero(fraccion * 100, decimales)}%`;
}

export function pesosConSigno(valor: number): string {
  const signo = valor > 0 ? '+' : valor < 0 ? '−' : '';
  return `${signo}$${numero(valor, 2)}`;
}

export function usd(valor: number): string {
  return `USD ${numero(valor, Number.isInteger(valor) ? 0 : 2)}`;
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export const nombreMes = (mm: number) => MESES[mm - 1] ?? '';
export const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** `2026-09-24` → `24 sep 2026`. */
export function fechaCorta(iso: string): string {
  const [a, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${d} ${nombreMes(m!).slice(0, 3)} ${a}`;
}

/** `2026-09-24` → `24 de septiembre`. */
export function fechaLarga(iso: string): string {
  const [, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${d} de ${nombreMes(m!)}`;
}

/**
 * Lee lo que el usuario escribe: `1750`, `1.750`, `USD 1.750,50`, `$7.000.000`.
 * Devuelve null si no hay un número válido.
 */
export function leerNumero(texto: string): number | null {
  const limpio = texto.replace(/[^\d.,]/g, '');
  if (!/\d/.test(limpio)) return null;
  let normal: string;
  if (limpio.includes(',')) {
    normal = limpio.replace(/\./g, '').replace(',', '.'); // 1.750,50
  } else if (/^\d{1,3}(\.\d{3})+$/.test(limpio)) {
    normal = limpio.replace(/\./g, ''); // 1.750 · 7.000.000
  } else {
    normal = limpio; // 1750 · 1750.5
  }
  const n = Number(normal);
  return Number.isFinite(n) ? n : null;
}
