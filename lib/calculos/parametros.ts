/**
 * Parámetros legales y de mercado. Nada de esto va "quemado" en las funciones:
 * cada valor tiene vigencia, para que un cálculo de 2026 siga dando lo mismo en 2027.
 */

export type ClaseRiesgo = 1 | 2 | 3 | 4 | 5;

export interface ParametrosAnio {
  anio: number;
  smlmv: number;
  porcentajeIbc: number; // prestación de servicios: 40% del ingreso bruto sin IVA
  topeMinIbcSmlmv: number;
  topeMaxIbcSmlmv: number;
  tarifaSalud: number;
  tarifaPension: number;
  tarifasArl: Record<ClaseRiesgo, number>;
  /** Tramos del FSP: desde N SMLMV de IBC (inclusive) aplica la tarifa. Ordenados de menor a mayor. */
  tramosFsp: { desdeSmlmv: number; tarifa: number }[];
  redondeoPila: number;
  fuentes: string[];
}

export const PARAMETROS: Record<number, ParametrosAnio> = {
  2026: {
    anio: 2026,
    smlmv: 1_750_905, // Decreto 0159 de 2026
    porcentajeIbc: 0.4, // Ley 2277/2022 art. 89 · Decreto 1273/2018
    topeMinIbcSmlmv: 1,
    topeMaxIbcSmlmv: 25,
    tarifaSalud: 0.125, // Ley 100/1993
    tarifaPension: 0.16,
    tarifasArl: { 1: 0.00522, 2: 0.01044, 3: 0.02436, 4: 0.0435, 5: 0.0696 },
    tramosFsp: [ // Ley 797/2003
      { desdeSmlmv: 0, tarifa: 0 },
      { desdeSmlmv: 4, tarifa: 0.01 },
      { desdeSmlmv: 16, tarifa: 0.012 },
      { desdeSmlmv: 17, tarifa: 0.014 },
      { desdeSmlmv: 18, tarifa: 0.016 },
      { desdeSmlmv: 19, tarifa: 0.018 },
      { desdeSmlmv: 20, tarifa: 0.02 },
    ],
    redondeoPila: 100,
    fuentes: ['Ley 100/1993', 'Ley 2277/2022 art. 89', 'Decreto 1273/2018', 'Ley 797/2003', 'Decreto 0159/2026'],
  },
};

export function parametrosDe(anio: number): ParametrosAnio {
  const p = PARAMETROS[anio];
  if (!p) throw new Error(`No hay parámetros cargados para ${anio}`);
  return p;
}

/** Referencia legal para comparar: intereses a las cesantías de un empleado (Ley 52/1975). */
export const TASA_INTERESES_CESANTIAS = 0.12;

/**
 * Retención en la fuente sobre rendimientos financieros.
 * null = aún no validada con un contador → la app muestra rendimiento bruto, no neto.
 */
export const RETENCION_RENDIMIENTOS: number | null = null;
