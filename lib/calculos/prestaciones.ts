import { tasaMensual } from './rentabilidad';

/** 1/12 exacto (8,333…%). No usar 0,0833: con $7.000.000 daría $6.997.200 al año. */
export const FRACCION_PRESTACION = 1 / 12;

export function ahorroMensual(ingresoBrutoMes: number) {
  const prima = ingresoBrutoMes * FRACCION_PRESTACION;
  const cesantias = ingresoBrutoMes * FRACCION_PRESTACION;
  return { prima, cesantias, total: prima + cesantias, porcentaje: 2 * FRACCION_PRESTACION };
}

export type Bolsillo = 'prima' | 'cesantias';

export interface MesIngreso { mes: string; ingresoBrutoMes: number } // mes = 'YYYY-MM'
/** El usuario marca que retiró (cobró) el saldo de un bolsillo al cierre de ese mes. */
export interface Cobro { mes: string; bolsillo: Bolsillo }

export interface FilaProyeccion {
  mes: string;
  aportePrima: number;
  rendimientoPrima: number;
  saldoPrima: number; // al cierre, antes de un posible cobro
  aporteCesantias: number;
  rendimientoCesantias: number;
  saldoCesantias: number;
  esCortePrima: boolean; // junio o diciembre
  cesantiasDisponibles: boolean; // febrero: mes en que un empleado recibe la consignación
  cobros: Bolsillo[];
}

/**
 * Proyección mes a mes. Supuestos:
 * - el aporte se deposita al final de cada mes (el primer mes no genera rendimiento);
 * - los rendimientos se capitalizan mensualmente con la tasa mensual equivalente a la E.A.;
 * - cada mes aparta 1/12 de SU ingreso, así que con ingreso variable la prima equivale al promedio.
 */
export function proyectarPrestaciones(meses: MesIngreso[], tasaEA: number, cobros: Cobro[] = []): FilaProyeccion[] {
  const i = tasaMensual(tasaEA);
  let saldoPrima = 0;
  let saldoCes = 0;
  return meses.map(({ mes, ingresoBrutoMes }) => {
    const ahorro = ahorroMensual(ingresoBrutoMes);
    const rendimientoPrima = saldoPrima * i;
    const rendimientoCesantias = saldoCes * i;
    saldoPrima += rendimientoPrima + ahorro.prima;
    saldoCes += rendimientoCesantias + ahorro.cesantias;
    const mm = mes.slice(5, 7);
    const cobrosMes = cobros.filter((c) => c.mes === mes).map((c) => c.bolsillo);
    const fila: FilaProyeccion = {
      mes, aportePrima: ahorro.prima, rendimientoPrima, saldoPrima,
      aporteCesantias: ahorro.cesantias, rendimientoCesantias, saldoCesantias: saldoCes,
      esCortePrima: mm === '06' || mm === '12', cesantiasDisponibles: mm === '02', cobros: cobrosMes,
    };
    if (cobrosMes.includes('prima')) saldoPrima = 0;
    if (cobrosMes.includes('cesantias')) saldoCes = 0;
    return fila;
  });
}

/** Lo que recibiría un empleado con el mismo ingreso, para comparar (no se usa para calcular el ahorro). */
export function referenciaEmpleado(ingresoMensual: number, tasaIntereses = 0.12) {
  const prima = ingresoMensual;
  const cesantias = ingresoMensual;
  return { prima, cesantias, interesesCesantias: cesantias * tasaIntereses };
}
