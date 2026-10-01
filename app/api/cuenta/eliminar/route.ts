import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { VERSION_POLITICA } from '@/lib/app/mapeo';

export const dynamic = 'force-dynamic';

const error = (status: number, codigo: string, mensaje: string) => Response.json({ ok: false, codigo, error: mensaje }, { status });

/**
 * Elimina la cuenta de quien la pide: borra su perfil, ingresos, cobros y alertas (en cascada) y su usuario.
 * Se conserva solo la prueba de sus autorizaciones, más una fila que deja constancia de que las retiró.
 * Exige la sesión de la persona (token) y que escriba su correo para confirmar.
 */
export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !clave) return error(500, 'configuracion', 'Configuración incompleta.');
  const admin = createClient(url, clave, { auth: { persistSession: false } });

  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return error(401, 'sin_sesion', 'Inicia sesión para eliminar tu cuenta.');
  const { data, error: eSesion } = await admin.auth.getUser(token);
  const user = data?.user;
  if (eSesion || !user) return error(401, 'sesion_invalida', 'Tu sesión venció. Entra de nuevo e inténtalo otra vez.');

  const cuerpo = (await req.json().catch(() => ({}))) as { confirmacion?: unknown };
  const confirmacion = typeof cuerpo.confirmacion === 'string' ? cuerpo.confirmacion.trim().toLowerCase() : '';
  if (!user.email || confirmacion !== user.email.toLowerCase()) return error(400, 'confirmacion', 'Escribe tu correo tal cual para confirmar.');

  // 1) Constancia: se agregan filas (no se editan las anteriores). El correo se guarda como hash.
  const userAgent = (req.headers.get('user-agent') ?? '').slice(0, 400);
  const retiro = (tipo: 'tratamiento_datos' | 'marketing_frilo', otorgada: boolean) => ({
    usuario_id: user.id,
    tipo,
    otorgada,
    version_politica: VERSION_POLITICA,
    user_agent: userAgent,
  });
  const { error: eConstancia } = await admin.from('autorizaciones').insert([retiro('tratamiento_datos', false), retiro('marketing_frilo', false)]);
  if (eConstancia) {
    console.error('Frilo: no se pudo registrar el retiro de autorizaciones', eConstancia.message);
    return error(500, 'constancia', 'No pudimos eliminar tu cuenta. Inténtalo de nuevo.');
  }

  // 2) Borrar el usuario: la base borra en cascada su perfil, fuentes, pagos, cobros y alertas.
  //    Se reintenta ante cortes de red; si el usuario ya no existe (un intento anterior sí borró), es éxito.
  let eBorrado: { message: string; status?: number; code?: string } | null = null;
  for (let intento = 0; intento < 3; intento++) {
    const { error: e } = await admin.auth.admin.deleteUser(user.id);
    if (!e || e.status === 404 || e.code === 'user_not_found') {
      eBorrado = null;
      break;
    }
    eBorrado = e;
    await new Promise((r) => setTimeout(r, 400 * (intento + 1)));
  }
  if (eBorrado) {
    console.error('Frilo: no se pudo eliminar el usuario', eBorrado.message);
    // La cuenta sigue existiendo: se deja constancia de que la autorización de tratamiento sigue vigente.
    await admin.from('autorizaciones').insert(retiro('tratamiento_datos', true));
    return error(500, 'borrado', 'No pudimos eliminar tu cuenta. Inténtalo de nuevo o escríbenos.');
  }
  return Response.json({ ok: true });
}
