/**
 * El ingreso tiene moneda, no el usuario: así caben quien gana en USD,
 * quien gana en COP por prestación de servicios y quien tiene ambos.
 */
export type Moneda = 'USD' | 'COP';
export type TipoContrato = 'ops_mas_de_un_mes' | 'ops_hasta_un_mes' | 'cuenta_propia' | 'exterior';
export type Contratante = 'privado' | 'publico' | 'exterior';

export interface FuenteIngreso {
  id: string;
  nombre: string;
  moneda: Moneda;
  tipoContrato: TipoContrato;
  contratante: Contratante;
}

export interface PagoMes {
  fuenteId: string;
  monto: number; // en la moneda de la fuente, bruto y sin IVA
  /** Solo USD, opcional: tasa que realmente pagó Payoneer, Wise o el banco. */
  tasaRecibida?: number;
  /** Solo COP, opcional: retención en la fuente que practicó el contratante. */
  retencionPracticada?: number;
}

export interface PagoConvertido {
  fuenteId: string;
  brutoCop: number; // base de aportes y de prima/cesantías
  recibidoCop: number; // lo que realmente llega a la cuenta
  costoConversion: number; // TRM vs tasa recibida
  retencion: number;
}

export function convertirPago(pago: PagoMes, fuente: FuenteIngreso, trm: number | null): PagoConvertido {
  if (pago.monto < 0) throw new Error('El monto no puede ser negativo');
  if (fuente.moneda === 'COP') {
    const retencion = pago.retencionPracticada ?? 0;
    return { fuenteId: fuente.id, brutoCop: pago.monto, recibidoCop: pago.monto - retencion, costoConversion: 0, retencion };
  }
  if (trm === null) throw new Error('Se necesita la TRM para convertir un pago en USD');
  const teorico = pago.monto * trm;
  const real = pago.tasaRecibida !== undefined ? pago.monto * pago.tasaRecibida : teorico;
  // Decisión: la base legal es el ingreso recibido en pesos (real si lo dio, si no, a TRM).
  return { fuenteId: fuente.id, brutoCop: real, recibidoCop: real, costoConversion: teorico - real, retencion: 0 };
}

export function costoConversionPct(tasaRecibida: number, trm: number): number {
  return 1 - tasaRecibida / trm;
}
