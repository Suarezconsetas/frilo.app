/** Lectura y escritura en Supabase del usuario con sesión. El RLS garantiza que solo toca lo suyo. */
import type { SupabaseClient } from '@supabase/supabase-js';
import { autorizacionesPorAgregar, estadoDesdeFilas, filasDesdeEstado, type FilasLeidas } from './mapeo';
import type { Alerta } from '@/lib/calculos';
import type { EstadoApp } from './tipos';

function ok<T>(r: { data: T; error: { message: string } | null }, donde: string): T {
  if (r.error) throw new Error(`${donde}: ${r.error.message}`);
  return r.data;
}

/** Agrega las autorizaciones que falten (prueba ante la SIC: solo inserciones). */
export async function registrarAutorizaciones(db: SupabaseClient, userId: string, marketing: boolean, userAgent: string) {
  const previas = ok(
    await db.from('autorizaciones').select('tipo, otorgada, version_politica').eq('usuario_id', userId).order('fecha', { ascending: true }).order('id', { ascending: true }),
    'leer autorizaciones',
  ) as { tipo: string; otorgada: boolean; version_politica: string }[];

  const nuevas = autorizacionesPorAgregar(previas, marketing);
  if (!nuevas.length) return;
  ok(await db.from('autorizaciones').insert(nuevas.map((n) => ({ ...n, usuario_id: userId, user_agent: userAgent.slice(0, 400) }))), 'guardar autorizaciones');
}

export async function cargarDeNube(db: SupabaseClient, userId: string): Promise<Partial<EstadoApp>> {
  const [perfil, fuente, cobros, alertas] = await Promise.all([
    db.from('perfiles').select('forma_de_pago, clase_riesgo, arl_voluntaria').eq('id', userId).maybeSingle().then((r) => ok(r, 'leer perfil')),
    db
      .from('fuentes_ingreso')
      .select('id, nombre, moneda, contratante')
      .eq('usuario_id', userId)
      .order('creado_en', { ascending: true })
      .limit(1)
      .maybeSingle()
      .then((r) => ok(r, 'leer fuente')),
    db.from('cobros').select('mes, bolsillo').eq('usuario_id', userId).order('creado_en').then((r) => ok(r, 'leer cobros')),
    db.from('alertas').select('umbral, direccion, estado, trm_referencia').eq('usuario_id', userId).order('creado_en').then((r) => ok(r, 'leer alertas')),
  ]);
  const pago = fuente
    ? ok(
        await db.from('pagos').select('mes, monto, tasa_recibida, retencion_practicada').eq('fuente_id', fuente.id).order('mes', { ascending: true }).limit(1).maybeSingle(),
        'leer pago',
      )
    : null;

  const filas: FilasLeidas = { perfil, fuente, pago, cobros: cobros ?? [], alertas: alertas ?? [] };
  return estadoDesdeFilas(filas);
}

/**
 * Guarda el estado completo del usuario. Devuelve el id de la fuente para no duplicarla.
 * `ingresoBrutoCop` solo sirve para calcular el rango del perfil; la cifra exacta no se guarda ahí.
 */
/** Las alertas las puede cambiar la tarea diaria (al cumplirse): se leen aparte para mostrar su estado real. */
export async function cargarAlertas(db: SupabaseClient, userId: string): Promise<Alerta[]> {
  const filas = ok(await db.from('alertas').select('umbral, direccion, estado, trm_referencia').eq('usuario_id', userId).order('creado_en'), 'leer alertas');
  return (filas ?? []).map((a) => ({
    umbral: Number(a.umbral),
    direccion: a.direccion as Alerta['direccion'],
    estado: a.estado as Alerta['estado'],
    trmReferencia: Number(a.trm_referencia),
  }));
}

/** `partes` indica qué tablas pequeñas se reemplazan: así un cambio de otra cosa no pisa lo que la tarea diaria haya marcado. */
export async function guardarEnNube(
  db: SupabaseClient,
  userId: string,
  estado: EstadoApp,
  ingresoBrutoCop: number | null,
  partes: { cobros: boolean; alertas: boolean } = { cobros: true, alertas: true },
): Promise<string | undefined> {
  const f = filasDesdeEstado(estado, ingresoBrutoCop);

  const guardarFuente = async (): Promise<string | undefined> => {
    if (!f.fuente) return estado.fuenteId;
    let fuenteId = estado.fuenteId;
    if (fuenteId) {
      ok(await db.from('fuentes_ingreso').update(f.fuente).eq('id', fuenteId), 'actualizar fuente');
    } else {
      const nueva = ok(await db.from('fuentes_ingreso').insert(f.fuente).select('id').single(), 'crear fuente');
      fuenteId = (nueva as { id: string }).id;
    }
    if (f.pago) {
      const existente = ok(await db.from('pagos').select('id').eq('fuente_id', fuenteId).eq('mes', f.pago.mes).maybeSingle(), 'buscar pago');
      if (existente) ok(await db.from('pagos').update(f.pago).eq('id', existente.id), 'actualizar pago');
      else ok(await db.from('pagos').insert({ ...f.pago, fuente_id: fuenteId }), 'crear pago');
    }
    return fuenteId;
  };

  // Tablas pequeñas: se reemplazan completas con lo que muestra la pantalla.
  const reemplazar = async (tabla: 'cobros' | 'alertas', filas: object[]) => {
    ok(await db.from(tabla).delete().eq('usuario_id', userId), `limpiar ${tabla}`);
    if (filas.length) ok(await db.from(tabla).insert(filas), `guardar ${tabla}`);
  };

  const [fuenteId] = await Promise.all([
    guardarFuente(),
    db.from('perfiles').update(f.perfil).eq('id', userId).then((r) => ok(r, 'guardar perfil')),
    partes.cobros ? reemplazar('cobros', f.cobros) : Promise.resolve(),
    partes.alertas ? reemplazar('alertas', f.alertas) : Promise.resolve(),
  ]);
  return fuenteId;
}
