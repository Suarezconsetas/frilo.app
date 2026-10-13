import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { hoyColombia } from '@/lib/app/fechas';
import { urlDeBaja } from '@/lib/cron/baja';
import { ejecutarResumenSemanal, enviarConResend, filaDeResumen, registrarEjecucion } from '@/lib/cron/tarea-diaria';
import { URL_SITIO } from '@/lib/sitio';

// La corre Vercel Cron los viernes en la tarde (vercel.json). Nunca se cachea.
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function autorizado(req: NextRequest): boolean {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) return false;
  const recibido = Buffer.from(req.headers.get('authorization') ?? '');
  const esperado = Buffer.from(`Bearer ${secreto}`);
  return recibido.length === esperado.length && timingSafeEqual(recibido, esperado);
}

const esViernes = (fecha: string) => new Date(`${fecha}T12:00:00Z`).getUTCDay() === 5;

export async function GET(req: NextRequest) {
  if (!autorizado(req)) return new Response('No autorizado', { status: 401 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resend = process.env.RESEND_API_KEY;
  const remitente = process.env.RESEND_FROM;
  if (!url || !clave || !resend || !remitente) {
    console.error('Frilo resumen: faltan variables de entorno');
    return Response.json({ ok: false, error: 'configuración incompleta' }, { status: 500 });
  }

  const params = new URL(req.url).searchParams;
  const prueba = params.get('prueba') ?? undefined; // envía solo un correo de muestra a esa dirección
  const forzar = params.get('forzar') === '1';
  const hoy = hoyColombia();

  // Aunque alguien llame la ruta otro día, el resumen solo sale los viernes (salvo prueba o forzado a mano).
  if (!esViernes(hoy) && !forzar && !prueba) {
    return Response.json({ ok: true, omitido: 'hoy no es viernes', fecha: hoy });
  }

  const inicio = Date.now();
  const db = createClient(url, clave, { auth: { persistSession: false } });
  try {
    const resultado = await ejecutarResumenSemanal({
      db,
      enviarCorreo: enviarConResend(resend, remitente),
      hoy,
      urlApp: URL_SITIO,
      urlBaja: (id) => urlDeBaja(URL_SITIO, id, clave),
      prueba,
    });
    console.log('Frilo resumen:', JSON.stringify(resultado));
    if (!prueba) await registrarEjecucion(db, filaDeResumen(resultado, Date.now() - inicio, hoy));
    return Response.json({ ok: resultado.fallidos === 0 && !resultado.omitido, ...resultado });
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : 'error desconocido';
    console.error('Frilo resumen: error', mensaje);
    if (!prueba) await registrarEjecucion(db, filaDeResumen(null, Date.now() - inicio, hoy, mensaje));
    return Response.json({ ok: false, error: 'error en el resumen semanal' }, { status: 500 });
  }
}
