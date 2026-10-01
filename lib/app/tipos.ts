import type { Alerta, ClaseRiesgo, Cobro, Moneda } from '@/lib/calculos';

export type FormaDePago = 'usd' | 'cop' | 'mixto';

/** Lo que el usuario escribe en "Tu primer ingreso". */
export interface IngresoInicial {
  cliente: string;
  moneda: Moneda;
  monto: number; // en la moneda del ingreso, bruto y sin IVA
  tasaRecibida?: number; // solo USD, opcional
  retencion?: number; // solo COP, opcional
  clase: ClaseRiesgo;
  publico: boolean;
}

export interface EstadoApp {
  formaDePago?: FormaDePago;
  ingreso?: IngresoInicial;
  /** Mes (`YYYY-MM`) en que registró su primer ingreso: desde ahí se proyectan prima y cesantías. */
  mesInicio?: string;
  arlVoluntaria: boolean;
  cobros: Cobro[];
  alertas: Alerta[];
  /** Correo al que se pidió el código. */
  correoPendiente?: string;
  /** Casilla de novedades marcada en el registro, a la espera de guardar las autorizaciones al iniciar sesión. */
  autorizacionPendiente?: { marketing: boolean };
  /** Id de la fuente de ingreso en la nube (cuando hay sesión). */
  fuenteId?: string;
}

export const ESTADO_VACIO: EstadoApp = { arlVoluntaria: false, cobros: [], alertas: [] };

/** TRM que el servidor entrega a las pantallas (viene de la tabla `trm_diaria`). */
export interface DatosTrm {
  fecha: string; // día de la consulta, `YYYY-MM-DD` (hora de Colombia)
  hoy: number;
  variaciones: { referencia: 'semana' | 'mes' | 'anio'; fecha: string; trm: number; variacionAbs: number; variacionPct: number }[];
}
