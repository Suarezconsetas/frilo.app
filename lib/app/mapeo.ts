/** Traduce entre el estado de la app y las filas de Supabase (perfiles, fuentes_ingreso, pagos, cobros, alertas). Funciones puras. */
import { parametrosDe, type Alerta, type ClaseRiesgo, type Cobro, type Moneda } from '@/lib/calculos';
import { fuenteDe } from './derivados';
import type { EstadoApp, FormaDePago, IngresoInicial } from './tipos';

/** Versión del texto de autorización que firma el usuario. Se actualiza con la política real (fase 5). */
export const VERSION_POLITICA = '2026-10-borrador';

/** En el perfil se guarda un rango, nunca la cifra exacta (Ley 1581 de 2012: solo lo necesario). */
export function rangoIngreso(ingresoBrutoCop: number, anio = 2026): string {
  const sm = ingresoBrutoCop / parametrosDe(anio).smlmv;
  if (sm < 2) return 'menos de 2 salarios mínimos';
  if (sm < 4) return '2 a 4 salarios mínimos';
  if (sm < 8) return '4 a 8 salarios mínimos';
  if (sm < 16) return '8 a 16 salarios mínimos';
  return 'más de 16 salarios mínimos';
}

export interface FilasNube {
  perfil: { forma_de_pago: FormaDePago | null; rango_ingreso: string | null; clase_riesgo: number | null; arl_voluntaria: boolean };
  fuente: { nombre: string; moneda: Moneda; tipo_contrato: string; contratante: string } | null;
  pago: { mes: string; monto: number; tasa_recibida: number | null; retencion_practicada: number | null } | null;
  cobros: { mes: string; bolsillo: string }[];
  alertas: { umbral: number; direccion: string; estado: string; trm_referencia: number }[];
}

export function filasDesdeEstado(e: EstadoApp, ingresoBrutoCop: number | null): FilasNube {
  const ing = e.ingreso;
  const fuente = ing ? fuenteDe(ing) : null;
  return {
    perfil: {
      forma_de_pago: e.formaDePago ?? null,
      rango_ingreso: ingresoBrutoCop !== null ? rangoIngreso(ingresoBrutoCop) : null,
      clase_riesgo: ing?.clase ?? null,
      arl_voluntaria: e.arlVoluntaria,
    },
    fuente: fuente ? { nombre: fuente.nombre, moneda: fuente.moneda, tipo_contrato: fuente.tipoContrato, contratante: fuente.contratante } : null,
    pago:
      ing && e.mesInicio
        ? { mes: e.mesInicio, monto: ing.monto, tasa_recibida: ing.tasaRecibida ?? null, retencion_practicada: ing.retencion ?? null }
        : null,
    cobros: e.cobros.map((c) => ({ mes: c.mes, bolsillo: c.bolsillo })),
    alertas: e.alertas.map((a) => ({ umbral: a.umbral, direccion: a.direccion, estado: a.estado, trm_referencia: a.trmReferencia })),
  };
}

/** Filas tal como las devuelve PostgREST (los numeric pueden llegar como texto). */
export interface FilasLeidas {
  perfil: { forma_de_pago: string | null; clase_riesgo: number | null; arl_voluntaria: boolean } | null;
  fuente: { id: string; nombre: string; moneda: string; contratante: string } | null;
  pago: { mes: string; monto: number | string; tasa_recibida: number | string | null; retencion_practicada: number | string | null } | null;
  cobros: { mes: string; bolsillo: string }[];
  alertas: { umbral: number | string; direccion: string; estado: string; trm_referencia: number | string }[];
}

const num = (v: number | string | null | undefined) => (v === null || v === undefined ? undefined : Number(v));

export function estadoDesdeFilas(f: FilasLeidas): Partial<EstadoApp> {
  const cambios: Partial<EstadoApp> = {
    formaDePago: (f.perfil?.forma_de_pago as FormaDePago | null) ?? undefined,
    arlVoluntaria: f.perfil?.arl_voluntaria ?? false,
    fuenteId: f.fuente?.id,
    cobros: f.cobros.map((c): Cobro => ({ mes: c.mes, bolsillo: c.bolsillo as Cobro['bolsillo'] })),
    alertas: f.alertas.map(
      (a): Alerta => ({ umbral: Number(a.umbral), direccion: a.direccion as Alerta['direccion'], estado: a.estado as Alerta['estado'], trmReferencia: Number(a.trm_referencia) }),
    ),
  };
  if (f.fuente && f.pago) {
    const ingreso: IngresoInicial = {
      cliente: f.fuente.nombre,
      moneda: f.fuente.moneda as Moneda,
      monto: Number(f.pago.monto),
      tasaRecibida: num(f.pago.tasa_recibida),
      retencion: num(f.pago.retencion_practicada),
      clase: (f.perfil?.clase_riesgo ?? 1) as ClaseRiesgo,
      publico: f.fuente.contratante === 'publico',
    };
    cambios.ingreso = ingreso;
    cambios.mesInicio = f.pago.mes;
  }
  return cambios;
}

/** Texto de la autorización guardada: lo que hay que (re)registrar al iniciar sesión. */
export interface AutorizacionPrevia {
  tipo: string;
  otorgada: boolean;
  version_politica: string;
}

/**
 * Qué filas nuevas de `autorizaciones` hay que agregar. Solo se agregan (nunca se edita ni se borra):
 * - tratamiento_datos: si la última no es un "sí" de la versión vigente.
 * - marketing_frilo: si la marcó y no estaba otorgada, o si nunca se registró (queda un "no" como prueba).
 *   Quien ya la había otorgado y entra sin marcarla no la pierde: revocarla es una acción explícita.
 */
export function autorizacionesPorAgregar(previas: AutorizacionPrevia[], marketingMarcada: boolean, version = VERSION_POLITICA) {
  const ultima = (tipo: string) => previas.filter((p) => p.tipo === tipo).at(-1);
  const nuevas: { tipo: 'tratamiento_datos' | 'marketing_frilo'; otorgada: boolean; version_politica: string }[] = [];
  const dato = ultima('tratamiento_datos');
  if (!dato || !dato.otorgada || dato.version_politica !== version) nuevas.push({ tipo: 'tratamiento_datos', otorgada: true, version_politica: version });
  const mk = ultima('marketing_frilo');
  if ((marketingMarcada && !mk?.otorgada) || !mk) nuevas.push({ tipo: 'marketing_frilo', otorgada: marketingMarcada, version_politica: version });
  return nuevas;
}
