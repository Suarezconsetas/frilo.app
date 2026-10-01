/** Lógica pura de la tarea diaria: qué alertas se disparan y cómo se ve el correo. Sin red ni base de datos. */
import { evaluarAlerta, type Alerta } from '@/lib/calculos';
import { pesos, pesosConDecimales } from '@/lib/formato';

/** Fila de `alertas` tal como la devuelve Supabase (los numeric pueden llegar como texto). */
export interface AlertaFila {
  id: string;
  usuario_id: string;
  umbral: number | string;
  direccion: string;
  estado: string;
  trm_referencia: number | string;
}

export type Accion =
  | { tipo: 'notificar'; id: string; usuarioId: string; direccion: Alerta['direccion']; umbral: number; trmAnterior: number; trmNueva: number }
  | { tipo: 'actualizar_referencia'; id: string; trmNueva: number };

/**
 * Para cada alerta activa decide si dispara (la TRM CRUZÓ el umbral desde la última vez) o si solo
 * hay que actualizar su referencia. Una TRM que sigue del otro lado del umbral no vuelve a avisar.
 */
export function planificarAlertas(filas: AlertaFila[], trmHoy: number): Accion[] {
  const acciones: Accion[] = [];
  for (const f of filas) {
    if (f.estado !== 'activa') continue;
    const alerta: Alerta = {
      umbral: Number(f.umbral),
      direccion: f.direccion as Alerta['direccion'],
      estado: 'activa',
      trmReferencia: Number(f.trm_referencia),
    };
    const { alerta: nueva, notificar } = evaluarAlerta(alerta, trmHoy);
    if (notificar) {
      acciones.push({ tipo: 'notificar', id: f.id, usuarioId: f.usuario_id, direccion: alerta.direccion, umbral: alerta.umbral, trmAnterior: alerta.trmReferencia, trmNueva: trmHoy });
    } else if (nueva.trmReferencia !== alerta.trmReferencia) {
      acciones.push({ tipo: 'actualizar_referencia', id: f.id, trmNueva: nueva.trmReferencia });
    }
  }
  return acciones;
}

export interface CorreoAlerta {
  asunto: string;
  html: string;
  texto: string;
}

const escapar = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Correo de una alerta cumplida. Es transaccional (el usuario la pidió), no lleva publicidad. */
export function construirCorreoAlerta(p: { direccion: Alerta['direccion']; umbral: number; trm: number; urlApp: string }): CorreoAlerta {
  const sube = p.direccion === 'sube';
  const verbo = sube ? 'subió' : 'bajó';
  const condicion = sube ? `suba de ${pesos(p.umbral)}` : `baje de ${pesos(p.umbral)}`;
  const asunto = `El dólar ${verbo} a ${pesosConDecimales(p.trm)}: se cumplió tu alerta`;
  const enlace = `${p.urlApp.replace(/\/$/, '')}/dolar`;

  const texto = [
    `Se cumplió tu alerta del dólar.`,
    ``,
    `Nos pediste que te avisáramos cuando el dólar ${condicion}. La TRM de hoy es ${pesosConDecimales(p.trm)}.`,
    ``,
    `Mira la tendencia en Frilo: ${enlace}`,
    ``,
    `Esta alerta ya se cumplió y quedó en pausa. Puedes reactivarla o crear otra desde la app.`,
    `TRM oficial de la Superintendencia Financiera (datos.gov.co).`,
    ``,
    `Más claridad, más libertad. Frilo`,
  ].join('\n');

  const html = `<!doctype html>
<html lang="es-CO"><body style="margin:0;background:#F3F6F4;font-family:Helvetica,Arial,sans-serif;color:#0F372D;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F6F4;padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border:1px solid #D6E0DA;border-radius:16px;">
<tr><td style="background:#0F372D;border-radius:16px 16px 0 0;padding:24px;">
<p style="margin:0;font-size:14px;color:#B5CCC1;">Alerta del dólar</p>
<p style="margin:8px 0 0 0;font-size:34px;line-height:40px;font-weight:700;color:#6FFF8F;">${escapar(pesosConDecimales(p.trm))}</p>
<p style="margin:4px 0 0 0;font-size:15px;color:#FFFFFF;">El dólar ${verbo} hoy</p>
</td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 16px 0;font-size:16px;line-height:24px;">Nos pediste que te avisáramos cuando el dólar <strong>${escapar(condicion)}</strong>. La TRM de hoy es <strong>${escapar(pesosConDecimales(p.trm))}</strong>.</p>
<p style="margin:0 0 24px 0;"><a href="${escapar(enlace)}" style="display:inline-block;background:#0F372D;color:#6FFF8F;text-decoration:none;font-weight:600;font-size:16px;padding:14px 24px;border-radius:12px;">Ver el dólar en Frilo</a></p>
<p style="margin:0;font-size:13px;line-height:19px;color:#4A6158;">Esta alerta ya se cumplió y quedó en pausa. Puedes reactivarla o crear otra desde la app.</p>
<p style="margin:12px 0 0 0;font-size:12px;line-height:18px;color:#4A6158;">TRM oficial de la Superintendencia Financiera (datos.gov.co).</p>
</td></tr></table>
<p style="margin:16px 0 0 0;font-size:12px;color:#4A6158;">Más claridad, más libertad. Frilo</p>
</td></tr></table></body></html>`;

  return { asunto, html, texto };
}
