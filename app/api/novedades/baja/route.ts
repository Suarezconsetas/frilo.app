import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { marketingOtorgado, VERSION_POLITICA } from '@/lib/app/mapeo';
import { verificarBaja } from '@/lib/cron/baja';

export const dynamic = 'force-dynamic';

/**
 * Baja de novedades con un solo clic (enlace del correo y List-Unsubscribe-Post).
 * Agrega una fila de autorización con "no" (nunca se edita la anterior). Es idempotente.
 */
async function darDeBaja(req: NextRequest): Promise<{ ok: true } | { ok: false; estado: number; mensaje: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !clave) return { ok: false, estado: 500, mensaje: 'Configuración incompleta.' };

  const params = new URL(req.url).searchParams;
  const usuarioId = params.get('u') ?? '';
  const token = params.get('t') ?? '';
  if (!verificarBaja(usuarioId, token, clave)) return { ok: false, estado: 400, mensaje: 'Este enlace no es válido.' };

  const db = createClient(url, clave, { auth: { persistSession: false } });
  const { data: previas } = await db
    .from('autorizaciones')
    .select('tipo, otorgada, version_politica')
    .eq('usuario_id', usuarioId)
    .eq('tipo', 'marketing_frilo')
    .order('fecha', { ascending: true })
    .order('id', { ascending: true });
  if (marketingOtorgado(previas ?? [])) {
    const { error } = await db.from('autorizaciones').insert({
      usuario_id: usuarioId,
      tipo: 'marketing_frilo',
      otorgada: false,
      version_politica: VERSION_POLITICA,
      user_agent: (req.headers.get('user-agent') ?? 'enlace de baja').slice(0, 400),
    });
    if (error) {
      console.error('Frilo: no se pudo registrar la baja de novedades', error.message);
      return { ok: false, estado: 500, mensaje: 'No pudimos procesar tu baja. Inténtalo de nuevo.' };
    }
  }
  return { ok: true };
}

export async function GET(req: NextRequest) {
  const r = await darDeBaja(req);
  if (!r.ok) return new Response(r.mensaje, { status: r.estado, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  return Response.redirect(new URL('/novedades-canceladas', req.url), 303);
}

// Gmail y otros clientes usan POST para la baja de un clic (List-Unsubscribe-Post).
export async function POST(req: NextRequest) {
  const r = await darDeBaja(req);
  return r.ok ? Response.json({ ok: true }) : Response.json({ ok: false, error: r.mensaje }, { status: r.estado });
}
