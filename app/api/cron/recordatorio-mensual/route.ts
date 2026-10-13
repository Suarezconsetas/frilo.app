import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { esUltimoDiaDelMes, hoyColombia } from '@/lib/app/fechas';
import { urlDeBaja } from '@/lib/cron/baja';
import { ejecutarRecordatorioMensual, enviarConResend, filaDeResumen, registrarEjecucion, trmDeHoy } from '@/lib/cron/tarea-diaria';
import { URL_SITIO } from '@/lib/sitio';

// Normalmente lo dispara la tarea diaria el último día del mes (/api/cron/trm). Esta ruta sirve para pruebas
// y para correrlo a mano: exige la clave del cron. Nunca se cachea.
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function autorizado(req: NextRequest): boolean {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) return false;
  const recibido = Buffer.from(req.headers.get('authorization') ?? '');
  const esperado = Buffer.from(`Bearer ${secreto}`);
  return recibido.length === esperado.length && timingSafeEqual(recibido, esperado);
}

export async function GET(req: NextRequest) {
  if (!autorizado(req)) return new Response('No autorizado', { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resend = process.env.RESEND_API_KEY;
  const remitente = process.env.RESEND_FROM;
  if (!url || !clave || !resend || !remitente) return Response.json({ ok: false, error: 'configuración incompleta' }, { status: 500 });

  const params = new URL(req.url).searchParams;
  const prueba = params.get('prueba') ?? undefined;
  const forzar = params.get('forzar') === '1';
  const hoy = hoyColombia();
  if (!esUltimoDiaDelMes(hoy) && !forzar && !prueba) return Response.json({ ok: true, omitido: 'hoy no es el último día del mes', fecha: hoy });

  const inicio = Date.now();
  const db = createClient(url, clave, { auth: { persistSession: false } });
  try {
    const resultado = await ejecutarRecordatorioMensual({
      db,
      enviarCorreo: enviarConResend(resend, remitente),
      hoy,
      urlApp: URL_SITIO,
      urlBaja: (id) => urlDeBaja(URL_SITIO, id, clave),
      trm: await trmDeHoy(db, hoy),
      prueba,
    });
    console.log('Frilo recordatorio:', JSON.stringify(resultado));
    if (!prueba) await registrarEjecucion(db, filaDeResumen(resultado, Date.now() - inicio, hoy, undefined, 'recordatorio'));
    return Response.json({ ok: resultado.fallidos === 0, ...resultado });
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : 'error desconocido';
    console.error('Frilo recordatorio: error', mensaje);
    if (!prueba) await registrarEjecucion(db, filaDeResumen(null, Date.now() - inicio, hoy, mensaje, 'recordatorio'));
    return Response.json({ ok: false, error: 'error en el recordatorio mensual' }, { status: 500 });
  }
}
