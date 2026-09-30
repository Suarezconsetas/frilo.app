import { type Fecha, restarAnios, restarDias, restarMeses } from './fechas';

/** Registro tal como lo entrega datos.gov.co (dataset 32sa-8pi3), ya normalizado. */
export interface RegistroTrm {
  valor: number;
  vigenciadesde: Fecha;
  vigenciahasta: Fecha;
}

/** Convierte una fila cruda de datos.gov.co (valores como texto, fechas ISO con hora). */
export function normalizarRegistro(crudo: { valor: string; vigenciadesde: string; vigenciahasta: string }): RegistroTrm {
  return {
    valor: Number(crudo.valor),
    vigenciadesde: crudo.vigenciadesde.slice(0, 10),
    vigenciahasta: crudo.vigenciahasta.slice(0, 10),
  };
}

/**
 * TRM vigente en una fecha. Cubre fines de semana y festivos porque una TRM
 * publicada el viernes tiene vigencia hasta el lunes o martes.
 */
export function trmVigente(serie: RegistroTrm[], fecha: Fecha): number {
  const exacta = serie.find((r) => r.vigenciadesde <= fecha && fecha <= r.vigenciahasta);
  if (exacta) return exacta.valor;
  // Respaldo: la última publicada antes de esa fecha (por si la serie tiene huecos).
  const anteriores = serie.filter((r) => r.vigenciadesde <= fecha).sort((a, b) => b.vigenciadesde.localeCompare(a.vigenciadesde));
  if (!anteriores[0]) throw new Error(`No hay TRM disponible para ${fecha}`);
  return anteriores[0].valor;
}

export interface Variacion { referencia: string; fecha: Fecha; trm: number; variacionAbs: number; variacionPct: number }

/** Panel de 4 referencias: hoy, hace 1 semana, hace 1 mes, mismo día del año pasado. */
export function panelTrm(serie: RegistroTrm[], hoy: Fecha) {
  const trmHoy = trmVigente(serie, hoy);
  const refs: [string, Fecha][] = [
    ['semana', restarDias(hoy, 7)],
    ['mes', restarMeses(hoy, 1)],
    ['anio', restarAnios(hoy, 1)],
  ];
  const variaciones: Variacion[] = refs.map(([referencia, fecha]) => {
    const trm = trmVigente(serie, fecha);
    return { referencia, fecha, trm, variacionAbs: trmHoy - trm, variacionPct: trmHoy / trm - 1 };
  });
  return { hoy: { fecha: hoy, trm: trmHoy }, variaciones };
}

// ── Alertas ──────────────────────────────────────────────────────────────
export interface Alerta {
  umbral: number;
  direccion: 'sube' | 'baja'; // 'sube' = avísame cuando llegue o pase del umbral
  estado: 'activa' | 'disparada';
  /** TRM al crear o reactivar la alerta: evita que dispare de inmediato si ya estaba del otro lado. */
  trmReferencia: number;
}

const cumple = (a: Alerta, trm: number) => (a.direccion === 'sube' ? trm >= a.umbral : trm <= a.umbral);

export function crearAlerta(umbral: number, direccion: Alerta['direccion'], trmActual: number): Alerta {
  return { umbral, direccion, estado: 'activa', trmReferencia: trmActual };
}

/**
 * Lo corre el job diario. Solo dispara cuando la TRM CRUZA el umbral
 * (antes no cumplía, ahora sí), no todos los días que siga del otro lado.
 */
export function evaluarAlerta(alerta: Alerta, trmNueva: number): { alerta: Alerta; notificar: boolean } {
  if (alerta.estado !== 'activa') return { alerta, notificar: false };
  const cruzo = cumple(alerta, trmNueva) && !cumple(alerta, alerta.trmReferencia);
  if (cruzo) return { alerta: { ...alerta, estado: 'disparada', trmReferencia: trmNueva }, notificar: true };
  return { alerta: { ...alerta, trmReferencia: trmNueva }, notificar: false };
}

export function reactivarAlerta(alerta: Alerta, trmActual: number): Alerta {
  return { ...alerta, estado: 'activa', trmReferencia: trmActual };
}
