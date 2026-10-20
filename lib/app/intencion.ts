/**
 * Acción pendiente que la persona dejó en el sitio de contenido antes de registrarse (cookie `frilo_intencion`).
 * La app la retoma en /bienvenida. Funciones puras: leen el texto de la cookie y calculan qué cambia.
 */
import { crearAlerta, type ClaseRiesgo } from '@/lib/calculos';
import { mesDe } from './fechas';
import type { EstadoApp } from './tipos';

export type Intencion =
  | { tipo: 'recordatorio'; digitos: string }
  | { tipo: 'alerta_dolar'; valor: number }
  | { tipo: 'guardar_calculo'; ingreso: number; riesgo: string };

export const NOMBRE_COOKIE_INTENCION = 'frilo_intencion';

const RIESGOS: Record<string, ClaseRiesgo> = { I: 1, II: 2, III: 3, IV: 4, V: 5 };

/** Valida lo que dice la cookie: nada que no se pueda reconocer pasa. */
export function leerIntencion(texto: string | null | undefined): Intencion | null {
  if (!texto) return null;
  let o: unknown;
  try {
    o = JSON.parse(texto);
  } catch {
    return null;
  }
  if (!o || typeof o !== 'object') return null;
  const x = o as Record<string, unknown>;
  if (x.tipo === 'recordatorio' && typeof x.digitos === 'string' && /^\d{2}$/.test(x.digitos)) return { tipo: 'recordatorio', digitos: x.digitos };
  if (x.tipo === 'alerta_dolar' && typeof x.valor === 'number' && x.valor > 0 && x.valor < 100_000) return { tipo: 'alerta_dolar', valor: x.valor };
  if (x.tipo === 'guardar_calculo' && typeof x.ingreso === 'number' && x.ingreso > 0 && x.ingreso < 1_000_000_000_000 && typeof x.riesgo === 'string' && x.riesgo in RIESGOS)
    return { tipo: 'guardar_calculo', ingreso: Math.round(x.ingreso), riesgo: x.riesgo };
  return null;
}

export interface Resultado {
  /** Cambios al estado de la app (alertas, ingreso…). */
  cambios: Partial<EstadoApp>;
  /** Dos últimos dígitos para activar el recordatorio de planilla (se guarda aparte del estado). */
  recordatorio?: { digitos: string };
  /** Pantalla a la que se lleva a la persona. */
  destino: '/inicio' | '/aportes' | '/dolar';
}

/**
 * Qué hacer con la intención. Nunca pisa lo que la persona ya tiene: si la cuenta ya existe con un ingreso, no se sobrescribe.
 */
export function aplicarIntencion(i: Intencion, estado: EstadoApp, trmHoy: number | null, hoy: string): Resultado {
  if (i.tipo === 'recordatorio') return { cambios: {}, recordatorio: { digitos: i.digitos }, destino: '/aportes' };

  if (i.tipo === 'alerta_dolar') {
    // Sin TRM no se sabe en qué dirección armarla; se lleva a la pantalla para que la cree.
    if (trmHoy === null) return { cambios: {}, destino: '/dolar' };
    const yaExiste = estado.alertas.some((a) => a.umbral === i.valor);
    const alertas = yaExiste ? estado.alertas : [...estado.alertas, crearAlerta(i.valor, i.valor > trmHoy ? 'sube' : 'baja', trmHoy)];
    return { cambios: { alertas, formaDePago: estado.formaDePago ?? 'usd' }, destino: '/dolar' };
  }

  // guardar_calculo: crea el primer ingreso solo si aún no hay uno.
  if (estado.ingreso) return { cambios: {}, destino: '/inicio' };
  return {
    cambios: {
      ingreso: { cliente: 'Mi ingreso', moneda: 'COP', monto: i.ingreso, clase: RIESGOS[i.riesgo] ?? 1, publico: false },
      mesInicio: mesDe(hoy),
      mesIngreso: mesDe(hoy),
      formaDePago: estado.formaDePago ?? 'cop',
    },
    destino: '/inicio',
  };
}
