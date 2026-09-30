import { tasaMensual } from './rentabilidad';

// Simulador neutral: aportes al final de cada mes, capitalización mensual.

/** ¿Cuánto tengo que apartar al mes para llegar a la meta en n meses? */
export function aporteParaMeta(meta: number, meses: number, tasaEA: number): number {
  if (meses <= 0) throw new Error('El plazo debe ser de al menos 1 mes');
  const i = tasaMensual(tasaEA);
  return i === 0 ? meta / meses : (meta * i) / (Math.pow(1 + i, meses) - 1);
}

/** ¿En cuántos meses llego? Redondea hacia arriba (mes en que se alcanza o supera la meta). */
export function mesesParaMeta(meta: number, aporte: number, tasaEA: number): number {
  if (aporte <= 0) throw new Error('El aporte debe ser mayor a cero');
  const i = tasaMensual(tasaEA);
  const n = i === 0 ? meta / aporte : Math.log(1 + (meta * i) / aporte) / Math.log(1 + i);
  return Math.ceil(n - 1e-9);
}

/** ¿Cuánto tendré después de n meses? */
export function saldoFuturo(aporte: number, meses: number, tasaEA: number): number {
  const i = tasaMensual(tasaEA);
  return i === 0 ? aporte * meses : (aporte * (Math.pow(1 + i, meses) - 1)) / i;
}
