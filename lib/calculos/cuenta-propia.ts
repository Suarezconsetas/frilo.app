/**
 * Independientes por CUENTA PROPIA (Decreto 379 de 2026, que modifica el art. 3.2.7.5 del Decreto 780 de 2016):
 * el 40% para el IBC se aplica sobre el ingreso NETO (ingreso bruto menos costos de la actividad).
 *
 * No aplica a contratistas de prestación de servicios personales (OPS): ellos siguen con el 40% del valor bruto
 * mensualizado del contrato, sin descontar costos (Ley 2277 de 2022, art. 89).
 *
 * [VERIFICAR] Pendiente confirmar con el texto oficial del decreto (el enlace de la UGPP dio 404 el 21-oct-2026):
 *  - fecha exacta de vigencia (las fuentes secundarias dicen 7 de abril de 2026);
 *  - tabla de presunción de costos de la UGPP por código CIIU (Resolución 532 de 2024): esta función solo recibe
 *    los costos que la persona declara; no aplica porcentajes de presunción.
 */
import { calcularAportes, type EntradaAportes, type ResultadoAportes } from './aportes';
import type { ParametrosAnio } from './parametros';

export interface EntradaCuentaPropia extends Omit<EntradaAportes, 'ingresoBrutoMes'> {
  ingresoBrutoMes: number;
  /** Costos de la actividad del mes, reales y soportados. */
  costosMes: number;
}

export interface ResultadoCuentaPropia extends ResultadoAportes {
  ingresoBruto: number;
  costos: number;
  ingresoNeto: number;
}

export function calcularAportesCuentaPropia(e: EntradaCuentaPropia, p: ParametrosAnio): ResultadoCuentaPropia {
  if (e.costosMes < 0) throw new Error('Los costos no pueden ser negativos');
  const ingresoNeto = Math.max(0, e.ingresoBrutoMes - e.costosMes);
  const r = calcularAportes({ ...e, ingresoBrutoMes: ingresoNeto }, p);
  return {
    ...r,
    ingresoBruto: e.ingresoBrutoMes,
    costos: Math.min(e.costosMes, e.ingresoBrutoMes),
    ingresoNeto,
    // el porcentaje se muestra sobre lo que realmente factura la persona
    porcentajeDelIngreso: e.ingresoBrutoMes > 0 ? r.totalUsuario / e.ingresoBrutoMes : 0,
  };
}
