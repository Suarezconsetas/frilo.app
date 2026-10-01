import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { hoyColombia } from '@/lib/app/fechas';
import { ejecutarTareaDiaria, enviarConResend } from '@/lib/cron/tarea-diaria';

// La corre Vercel Cron cada día (vercel.json). Nunca se cachea.
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function autorizado(req: NextRequest): boolean {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) return false; // sin secreto configurado la ruta queda cerrada
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
  if (!url || !clave || !resend || !remitente) {
    console.error('Frilo cron: faltan variables de entorno');
    return Response.json({ ok: false, error: 'configuración incompleta' }, { status: 500 });
  }

  try {
    const resultado = await ejecutarTareaDiaria({
      db: createClient(url, clave, { auth: { persistSession: false } }),
      traer: fetch,
      enviarCorreo: enviarConResend(resend, remitente),
      hoy: hoyColombia(),
      urlApp: process.env.NEXT_PUBLIC_APP_URL ?? 'https://frilo-app.vercel.app',
    });
    console.log('Frilo cron:', JSON.stringify(resultado));
    // Si la fuente de la TRM falló, el cron se marca como fallido para que se note en Vercel.
    return Response.json({ ok: resultado.trmSincronizada, ...resultado }, { status: resultado.trmSincronizada ? 200 : 502 });
  } catch (e) {
    console.error('Frilo cron: error', e instanceof Error ? e.message : e);
    return Response.json({ ok: false, error: 'error en la tarea diaria' }, { status: 500 });
  }
}
