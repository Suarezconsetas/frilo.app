/**
 * Tarea diaria: guarda la TRM de hoy en `trm_diaria`, evalúa las alertas activas y avisa por correo.
 * Corre en el servidor con la service role (ignora el RLS: lee las alertas de todos los usuarios).
 * Es segura de repetir: una alerta se "reclama" con un UPDATE condicional antes de enviar el correo.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { normalizarRegistro, restarDias, trmVigente, type RegistroTrm } from '@/lib/calculos';
import { construirCorreoAlerta, planificarAlertas, type AlertaFila } from './alertas';

export interface CorreoSaliente {
  para: string;
  asunto: string;
  html: string;
  texto: string;
  /** Misma clave = mismo correo: si se repite la tarea, el proveedor no lo duplica. */
  idempotencia: string;
}

export interface Dependencias {
  db: SupabaseClient;
  traer: typeof fetch;
  enviarCorreo: (c: CorreoSaliente) => Promise<void>;
  hoy: string; // YYYY-MM-DD, hora de Colombia
  urlApp: string;
}

export interface Resultado {
  fecha: string;
  trmHoy: number | null;
  trmSincronizada: boolean;
  errorTrm?: string;
  trmGuardadas: number;
  alertasActivas: number;
  referenciasActualizadas: number;
  disparadas: number;
  correosEnviados: number;
  correosFallidos: number;
}

const FUENTE_TRM = 'https://www.datos.gov.co/resource/32sa-8pi3.json';

async function sincronizarTrm({ db, traer, hoy }: Dependencias): Promise<{ guardadas: number; error?: string }> {
  try {
    const url = new URL(FUENTE_TRM);
    url.searchParams.set('$where', `vigenciadesde >= '${restarDias(hoy, 14)}T00:00:00.000'`);
    url.searchParams.set('$order', 'vigenciadesde');
    url.searchParams.set('$limit', '100');
    const r = await traer(url);
    if (!r.ok) return { guardadas: 0, error: `datos.gov.co respondió ${r.status}` };
    const filas = ((await r.json()) as { valor: string; vigenciadesde: string; vigenciahasta: string }[]).map(normalizarRegistro);
    if (!filas.length) return { guardadas: 0, error: 'datos.gov.co no devolvió filas' };
    const { error } = await db.from('trm_diaria').upsert(filas, { onConflict: 'vigenciadesde' });
    if (error) return { guardadas: 0, error: `no se pudo guardar la TRM: ${error.message}` };
    return { guardadas: filas.length };
  } catch (e) {
    return { guardadas: 0, error: e instanceof Error ? e.message : 'error desconocido al traer la TRM' };
  }
}

async function trmDeHoy(db: SupabaseClient, hoy: string): Promise<number | null> {
  const { data } = await db.from('trm_diaria').select('valor, vigenciadesde, vigenciahasta').order('vigenciadesde', { ascending: false }).limit(30);
  if (!data?.length) return null;
  const serie: RegistroTrm[] = data.map((f) => ({ valor: Number(f.valor), vigenciadesde: String(f.vigenciadesde), vigenciahasta: String(f.vigenciahasta) }));
  try {
    return trmVigente(serie, hoy);
  } catch {
    return null;
  }
}

export async function ejecutarTareaDiaria(deps: Dependencias): Promise<Resultado> {
  const { db, hoy } = deps;
  const resultado: Resultado = {
    fecha: hoy,
    trmHoy: null,
    trmSincronizada: false,
    trmGuardadas: 0,
    alertasActivas: 0,
    referenciasActualizadas: 0,
    disparadas: 0,
    correosEnviados: 0,
    correosFallidos: 0,
  };

  const sync = await sincronizarTrm(deps);
  resultado.trmSincronizada = !sync.error;
  resultado.trmGuardadas = sync.guardadas;
  if (sync.error) resultado.errorTrm = sync.error;

  // Aunque la fuente falle, las alertas se evalúan con la última TRM guardada.
  resultado.trmHoy = await trmDeHoy(db, hoy);
  if (resultado.trmHoy === null) return resultado;

  const { data: activas, error } = await db.from('alertas').select('id, usuario_id, umbral, direccion, estado, trm_referencia').eq('estado', 'activa');
  if (error) throw new Error(`no se pudieron leer las alertas: ${error.message}`);
  const filas = (activas ?? []) as AlertaFila[];
  resultado.alertasActivas = filas.length;

  const acciones = planificarAlertas(filas, resultado.trmHoy);

  for (const a of acciones) {
    if (a.tipo === 'actualizar_referencia') {
      const { error: e } = await db.from('alertas').update({ trm_referencia: a.trmNueva }).eq('id', a.id).eq('estado', 'activa');
      if (!e) resultado.referenciasActualizadas++;
    }
  }

  const aNotificar = acciones.filter((a) => a.tipo === 'notificar');
  if (!aNotificar.length) return resultado;

  const ids = [...new Set(aNotificar.map((a) => a.usuarioId))];
  const { data: perfiles } = await db.from('perfiles').select('id, correo').in('id', ids);
  const correoDe = new Map((perfiles ?? []).map((p) => [String(p.id), String(p.correo)]));

  for (const a of aNotificar) {
    // 1) Reclamar: solo quien logra pasar la alerta de 'activa' a 'disparada' envía el correo.
    const { data: reclamada } = await db
      .from('alertas')
      .update({ estado: 'disparada', trm_referencia: a.trmNueva })
      .eq('id', a.id)
      .eq('estado', 'activa')
      .select('id');
    if (!reclamada?.length) continue;
    resultado.disparadas++;

    const para = correoDe.get(a.usuarioId);
    try {
      if (!para) throw new Error('la persona no tiene correo');
      const c = construirCorreoAlerta({ direccion: a.direccion, umbral: a.umbral, trm: a.trmNueva, urlApp: deps.urlApp });
      await deps.enviarCorreo({ para, asunto: c.asunto, html: c.html, texto: c.texto, idempotencia: `alerta-${a.id}-${hoy}` });
      resultado.correosEnviados++;
    } catch (e) {
      // 2) Si el correo falla, la alerta vuelve a quedar activa con su referencia anterior para reintentar mañana.
      resultado.correosFallidos++;
      console.error(`Frilo: no se pudo enviar la alerta ${a.id}:`, e instanceof Error ? e.message : e);
      await db.from('alertas').update({ estado: 'activa', trm_referencia: a.trmAnterior }).eq('id', a.id).eq('estado', 'disparada');
    }
  }
  return resultado;
}

/** Envío con Resend (API REST). La clave nunca se imprime. */
export function enviarConResend(apiKey: string, from: string, traer: typeof fetch = fetch) {
  return async (c: CorreoSaliente): Promise<void> => {
    const r = await traer('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': c.idempotencia },
      body: JSON.stringify({ from, to: [c.para], subject: c.asunto, html: c.html, text: c.texto }),
    });
    if (!r.ok) {
      const detalle = await r.json().catch(() => ({}) as { message?: string });
      throw new Error(`Resend respondió ${r.status}: ${(detalle as { message?: string }).message ?? 'sin detalle'}`);
    }
  };
}

// ── Registro de cada ejecución ────────────────────────────────────────────

/** Fila de `cron_ejecuciones`: qué pasó en esta corrida. No lleva datos personales. */
export interface FilaEjecucion {
  fecha: string;
  ok: boolean;
  trm_hoy: number | null;
  trm_sincronizada: boolean;
  trm_guardadas: number;
  error_trm: string | null;
  alertas_activas: number;
  referencias_actualizadas: number;
  disparadas: number;
  correos_enviados: number;
  correos_fallidos: number;
  duracion_ms: number;
  error: string | null;
}

/** La corrida es "ok" si la TRM se sincronizó y no hubo un error que la cortara. */
export function filaDeEjecucion(r: Resultado | null, duracionMs: number, hoy: string, error?: string): FilaEjecucion {
  return {
    fecha: r?.fecha ?? hoy,
    ok: !error && !!r?.trmSincronizada,
    trm_hoy: r?.trmHoy ?? null,
    trm_sincronizada: r?.trmSincronizada ?? false,
    trm_guardadas: r?.trmGuardadas ?? 0,
    error_trm: r?.errorTrm ? r.errorTrm.slice(0, 500) : null,
    alertas_activas: r?.alertasActivas ?? 0,
    referencias_actualizadas: r?.referenciasActualizadas ?? 0,
    disparadas: r?.disparadas ?? 0,
    correos_enviados: r?.correosEnviados ?? 0,
    correos_fallidos: r?.correosFallidos ?? 0,
    duracion_ms: Math.max(0, Math.round(duracionMs)),
    error: error ? error.slice(0, 500) : null,
  };
}

/** Guarda la fila. Si esto falla no debe tumbar la tarea: solo se avisa en el log. */
export async function registrarEjecucion(db: SupabaseClient, fila: FilaEjecucion): Promise<void> {
  try {
    const { error } = await db.from('cron_ejecuciones').insert(fila);
    if (error) console.error('Frilo cron: no se pudo registrar la ejecución:', error.message);
  } catch (e) {
    console.error('Frilo cron: no se pudo registrar la ejecución:', e instanceof Error ? e.message : e);
  }
}
