import { pesos } from '@/lib/formato';

/** Un campo numérico: solo dígitos; vacío = 0. (Igual que los wireframes.) */
export function soloEnteros(e: { target: { value: unknown } }): number {
  const v = parseInt(String(e.target.value).replace(/\D/g, ''), 10);
  return Number.isNaN(v) ? 0 : v;
}

/** Número con punto de miles, sin signo de pesos: `8.000.000`. */
export const miles = (n: number): string => pesos(n).replace('$', '');

/** Decimal en formato colombiano sin ceros de más: 1,2 · 0,522 · 9. */
export const decimalEs = (x: number, max = 3): string => String(Number(x.toFixed(max))).replace('.', ',');

/** "9,5" o "9.5" → 0,095 (la persona escribe el porcentaje). */
export const porcentajeAFraccion = (texto: string): number => (parseFloat(String(texto).replace(',', '.')) || 0) / 100;
