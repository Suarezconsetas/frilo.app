/**
 * Interés compuesto con aportes mensuales (calculadora P10 del sitio y atajo de prima y cesantías).
 * Funciones puras. Las tasas se ingresan como fracción (0,09 = 9%).
 */

/** Retención en la fuente sobre rendimientos financieros 2026 (7%, sin base mínima). Opcional en la calculadora. */
export const RETENCION_RENDIMIENTOS_SIMULADOR = 0.07;

/** Capitalizaciones por año de una tasa nominal. */
export type Capitalizacion = 365 | 12 | 4 | 2 | 1;

/** Tasa nominal anual → efectiva anual: E.A. = (1 + nominal/k)^k − 1. */
export const nominalAEfectiva = (nominal: number, k: Capitalizacion): number => Math.pow(1 + nominal / k, k) - 1;

/** Tasa mensual equivalente a una E.A.: i = (1 + E.A.)^(1/12) − 1. */
const tasaMensualEA = (ea: number): number => Math.pow(1 + ea, 1 / 12) - 1;

/** Saldo después de n meses: C·(1+i)^n + A·[(1+i)^n − 1]/i, con el aporte al final de cada mes. */
export function saldoFinal(capitalInicial: number, aporteMensual: number, ea: number, meses: number): number {
  const i = tasaMensualEA(ea);
  const f = Math.pow(1 + i, meses);
  return capitalInicial * f + (i === 0 ? aporteMensual * meses : (aporteMensual * (f - 1)) / i);
}

export interface ResultadoInteres {
  saldo: number;
  aportado: number; // capital inicial + todos los aportes
  intereses: number;
  /** Intereses después de la retención opcional (7%); igual a `intereses` si no se descuenta. */
  interesesNetos: number;
}

export function resultadoInteres(capitalInicial: number, aporteMensual: number, ea: number, meses: number, conRetencion = false): ResultadoInteres {
  const saldo = saldoFinal(capitalInicial, aporteMensual, ea, meses);
  const aportado = capitalInicial + aporteMensual * meses;
  const intereses = saldo - aportado;
  const interesesNetos = conRetencion ? intereses * (1 - RETENCION_RENDIMIENTOS_SIMULADOR) : intereses;
  return { saldo, aportado, intereses, interesesNetos };
}

/** ¿Cuánto debo ahorrar al mes para llegar a una meta? Redondeado hacia arriba a miles; mínimo 0. */
export function aporteMensualParaMeta(meta: number, capitalInicial: number, ea: number, meses: number): number {
  if (meses <= 0) return 0;
  const i = tasaMensualEA(ea);
  const f = Math.pow(1 + i, meses);
  const faltante = meta - capitalInicial * f;
  if (faltante <= 0) return 0;
  const bruto = i === 0 ? faltante / meses : (faltante * i) / (f - 1);
  return Math.ceil(bruto / 1000 - 1e-9) * 1000;
}

export const MAX_MESES_META = 600;

/** ¿Cuánto tiempo tardo? Itera mes a mes hasta alcanzar la meta (tope 600 meses). `null` si no llega. */
export function tiempoParaMeta(meta: number, capitalInicial: number, aporteMensual: number, ea: number): number | null {
  if (capitalInicial >= meta) return 0;
  const i = tasaMensualEA(ea);
  let saldo = capitalInicial;
  for (let n = 1; n <= MAX_MESES_META; n++) {
    saldo = saldo * (1 + i) + aporteMensual;
    if (saldo >= meta - 1e-6) return n;
  }
  return null;
}

/** Regla del 72: años aproximados para duplicar el dinero con una tasa E.A. */
export const reglaDel72 = (ea: number): number => 72 / (ea * 100);

export interface FilaProyeccionInteres {
  periodo: number; // mes o año, según `cadaMeses`
  aportado: number;
  intereses: number;
  saldo: number;
}

/** Tabla de proyección cada `cadaMeses` (1 = por mes, 12 = por año). */
export function tablaProyeccion(capitalInicial: number, aporteMensual: number, ea: number, meses: number, cadaMeses = 12): FilaProyeccionInteres[] {
  const filas: FilaProyeccionInteres[] = [];
  for (let m = cadaMeses; m <= meses + 0.0001; m += cadaMeses) {
    const r = resultadoInteres(capitalInicial, aporteMensual, ea, m);
    filas.push({ periodo: m / cadaMeses, aportado: r.aportado, intereses: r.intereses, saldo: r.saldo });
  }
  if (meses % cadaMeses !== 0) {
    const r = resultadoInteres(capitalInicial, aporteMensual, ea, meses);
    filas.push({ periodo: meses / cadaMeses, aportado: r.aportado, intereses: r.intereses, saldo: r.saldo });
  }
  return filas;
}

/** Atajo "mi prima y mis cesantías": el aporte mensual es el 16,67% (1/12 + 1/12) del ingreso bruto, como en la app. */
export const aportePrimaYCesantias = (ingresoBrutoMes: number): number => (ingresoBrutoMes * 2) / 12;
