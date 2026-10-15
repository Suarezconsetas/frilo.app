import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { esUltimoDiaDelMes, hoyColombia } from '@/lib/app/fechas';
import { URL_SITIO } from '@/lib/sitio';
import { urlDeBaja } from '@/lib/cron/baja';
import {
  ejecutarGuardarMes,
  ejecutarRecordatorioMensual,
  ejecutarTareaDiaria,
  enviarConResend,
  filaDeEjecucion,
  filaDeResumen,
  registrarEjecucion,
} from '@/lib/cron/tarea-diaria';

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

  const inicio = Date.now();
  const hoy = hoyColombia();
  const db = createClient(url, clave, { auth: { persistSession: false } });

  try {
    const resultado = await ejecutarTareaDiaria({
      db,
      traer: fetch,
      enviarCorreo: enviarConResend(resend, remitente),
      hoy,
      urlApp: URL_SITIO,
    });
    console.log('Frilo cron:', JSON.stringify(resultado));
    // Queda una fila por corrida en `cron_ejecuciones` (los logs de Vercel Hobby solo duran 1 hora).
    await registrarEjecucion(db, filaDeEjecucion(resultado, Date.now() - inicio, hoy));

    // El último día del mes la misma tarea envía el recordatorio de "¿ya apartaste?" (el plan solo permite dos cron).
    // Si falla, no afecta a las alertas: queda registrado aparte.
    // `?recordatorio=1` (con la clave del cron) lo corre a mano fuera de fin de mes, para pruebas.
    const forzarRecordatorio = new URL(req.url).searchParams.get('recordatorio') === '1';
    if (esUltimoDiaDelMes(hoy) || forzarRecordatorio) {
      const inicioRecordatorio = Date.now();
      try {
        const r = await ejecutarRecordatorioMensual({
          db,
          enviarCorreo: enviarConResend(resend, remitente),
          hoy,
          urlApp: URL_SITIO,
          urlBaja: (id) => urlDeBaja(URL_SITIO, id, clave),
          trm: resultado.trmHoy,
        });
        console.log('Frilo recordatorio:', JSON.stringify(r));
        await registrarEjecucion(db, filaDeResumen(r, Date.now() - inicioRecordatorio, hoy, undefined, 'recordatorio'));
      } catch (e) {
        const mensaje = e instanceof Error ? e.message : 'error desconocido';
        console.error('Frilo recordatorio: error', mensaje);
        await registrarEjecucion(db, filaDeResumen(null, Date.now() - inicioRecordatorio, hoy, mensaje, 'recordatorio'));
      }
    }
    // Cada día: aviso de "guarda tu mes" a quien hoy cumple su día de pago (el 1 si no lo indicó).
    // `?guardarmes_prueba=correo` envía solo un correo de muestra a esa dirección.
    const inicioGuardar = Date.now();
    try {
      const r = await ejecutarGuardarMes({
        db,
        enviarCorreo: enviarConResend(resend, remitente),
        hoy,
        urlApp: URL_SITIO,
        urlBaja: (id) => urlDeBaja(URL_SITIO, id, clave),
        prueba: new URL(req.url).searchParams.get('guardarmes_prueba') ?? undefined,
      });
      if (r.destinatarios > 0) {
        console.log('Frilo guardar-mes:', JSON.stringify(r));
        await registrarEjecucion(db, filaDeResumen(r, Date.now() - inicioGuardar, hoy, undefined, 'guardarmes'));
      }
    } catch (e) {
      const mensaje = e instanceof Error ? e.message : 'error desconocido';
      console.error('Frilo guardar-mes: error', mensaje);
      await registrarEjecucion(db, filaDeResumen(null, Date.now() - inicioGuardar, hoy, mensaje, 'guardarmes'));
    }
    // Si la fuente de la TRM falló, el cron se marca como fallido para que se note en Vercel.
    return Response.json({ ok: resultado.trmSincronizada, ...resultado }, { status: resultado.trmSincronizada ? 200 : 502 });
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : 'error desconocido';
    console.error('Frilo cron: error', mensaje);
    await registrarEjecucion(db, filaDeEjecucion(null, Date.now() - inicio, hoy, mensaje));
    return Response.json({ ok: false, error: 'error en la tarea diaria' }, { status: 500 });
  }
}
