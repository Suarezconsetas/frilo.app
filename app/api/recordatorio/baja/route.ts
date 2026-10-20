import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { verificarBaja } from '@/lib/cron/baja';

export const dynamic = 'force-dynamic';

/**
 * Apaga el recordatorio de la planilla con un solo clic (enlace del correo y List-Unsubscribe-Post), sin iniciar sesión.
 * El token es un HMAC propio de este recordatorio. Es idempotente.
 */
async function apagar(req: NextRequest): Promise<{ ok: true } | { ok: false; estado: number; mensaje: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !clave) return { ok: false, estado: 500, mensaje: 'Configuración incompleta.' };

  const params = new URL(req.url).searchParams;
  const usuarioId = params.get('u') ?? '';
  const token = params.get('t') ?? '';
  if (!verificarBaja(usuarioId, token, clave, 'planilla')) return { ok: false, estado: 400, mensaje: 'Este enlace no es válido.' };

  const db = createClient(url, clave, { auth: { persistSession: false } });
  const { error } = await db.from('perfiles').update({ recordatorio_planilla: false }).eq('id', usuarioId);
  if (error) {
    console.error('Frilo: no se pudo apagar el recordatorio de planilla', error.message);
    return { ok: false, estado: 500, mensaje: 'No pudimos apagar el recordatorio. Inténtalo de nuevo.' };
  }
  return { ok: true };
}

export async function GET(req: NextRequest) {
  const r = await apagar(req);
  if (!r.ok) return new Response(r.mensaje, { status: r.estado, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  return Response.redirect(new URL('/recordatorio-apagado', req.url), 303);
}

export async function POST(req: NextRequest) {
  const r = await apagar(req);
  return r.ok ? Response.json({ ok: true }) : Response.json({ ok: false, error: r.mensaje }, { status: r.estado });
}
