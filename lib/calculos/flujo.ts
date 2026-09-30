import { calcularAportes, reglaArlCombinada, type EstadoArl, type ResultadoAportes } from './aportes';
import { convertirPago, type FuenteIngreso, type PagoConvertido, type PagoMes } from './ingresos';
import { type ClaseRiesgo, type ParametrosAnio } from './parametros';
import { ahorroMensual } from './prestaciones';

export interface EntradaFlujo {
  fuentes: FuenteIngreso[];
  pagos: PagoMes[];
  trm: number | null; // TRM del mes; null si el usuario solo tiene ingresos en COP
  clase: ClaseRiesgo;
  arlVoluntariaActivada: boolean; // solo cuenta si la ARL no es obligatoria
}

export interface ResumenMes {
  pagos: PagoConvertido[];
  ingresoBrutoMes: number;
  recibidoMes: number;
  costoConversion: number;
  retencion: number;
  arl: EstadoArl;
  aportes: ResultadoAportes;
  ahorroPrima: number;
  ahorroCesantias: number;
  disponible: number;
  usaTrm: boolean;
}

/** La cadena completa del mes: fuentes → COP → aportes → prima/cesantías → disponible. */
export function resumenMes(e: EntradaFlujo, p: ParametrosAnio): ResumenMes {
  const porId = new Map(e.fuentes.map((f) => [f.id, f]));
  const pagos = e.pagos.map((pago) => {
    const fuente = porId.get(pago.fuenteId);
    if (!fuente) throw new Error(`Fuente desconocida: ${pago.fuenteId}`);
    return convertirPago(pago, fuente, e.trm);
  });
  const suma = (k: keyof Omit<PagoConvertido, 'fuenteId'>) => pagos.reduce((s, x) => s + x[k], 0);
  const ingresoBrutoMes = suma('brutoCop');
  const recibidoMes = suma('recibidoCop');

  const arl = reglaArlCombinada(e.fuentes, e.clase);
  const aportes = calcularAportes({
    ingresoBrutoMes, clase: e.clase,
    incluirArl: arl.obligatoria || e.arlVoluntariaActivada,
    arlLaPagaContratante: arl.pagador === 'contratante',
  }, p);
  const ahorro = ahorroMensual(ingresoBrutoMes);

  return {
    pagos, ingresoBrutoMes, recibidoMes,
    costoConversion: suma('costoConversion'), retencion: suma('retencion'),
    arl, aportes, ahorroPrima: ahorro.prima, ahorroCesantias: ahorro.cesantias,
    disponible: recibidoMes - aportes.totalUsuario - ahorro.total,
    usaTrm: e.fuentes.some((f) => f.moneda === 'USD'),
  };
}
