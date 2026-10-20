/** Lógica pura de la tarea diaria: qué alertas se disparan y cómo se ve el correo. Sin red ni base de datos. */
import type { Alerta } from '@/lib/calculos';
import { pesos, pesosConDecimales } from '@/lib/formato';
import { mensajeDeAlerta, motivadorHtml, promocionHtml, promocionTexto, type Promocion } from './mensajes';
import { boton, envolverCorreo, escapar, parrafo, sinBarraFinal } from './plantilla';

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
  | { tipo: 'actualizar_referencia'; id: string; trmNueva: number }
  | { tipo: 'rearmar'; id: string; trmNueva: number };

/**
 * Después de avisar, la alerta se reactiva sola cuando el dólar se aleja del umbral más de este margen.
 * Así avisa cada vez que vuelve a cruzarlo, pero no todos los días si oscila justo en el valor.
 */
export const MARGEN_REARME = 0.01;

/** 'sube': la TRM llegó o pasó del valor; 'baja': llegó o bajó de él. */
export const cumpleUmbral = (direccion: Alerta['direccion'], umbral: number, trm: number): boolean => (direccion === 'sube' ? trm >= umbral : trm <= umbral);

export function debeRearmarse(direccion: Alerta['direccion'], umbral: number, trm: number): boolean {
  return direccion === 'sube' ? trm <= umbral * (1 - MARGEN_REARME) : trm >= umbral * (1 + MARGEN_REARME);
}

/**
 * - Alerta activa: dispara apenas la TRM llega al valor elegido; si no, solo actualiza su referencia.
 *   Después de avisar queda 'disparada' y no vuelve a avisar hasta reactivarse.
 * - Alerta disparada: se reactiva sola cuando el dólar se aleja del umbral más del margen.
 */
export function planificarAlertas(filas: AlertaFila[], trmHoy: number): Accion[] {
  const acciones: Accion[] = [];
  for (const f of filas) {
    const umbral = Number(f.umbral);
    const direccion = f.direccion as Alerta['direccion'];
    if (f.estado === 'disparada') {
      if (debeRearmarse(direccion, umbral, trmHoy)) acciones.push({ tipo: 'rearmar', id: f.id, trmNueva: trmHoy });
      continue;
    }
    if (f.estado !== 'activa') continue;
    const trmAnterior = Number(f.trm_referencia);
    // Una alerta activa está "armada": se creó con el dólar del otro lado del valor elegido (la pantalla no deja
    // crearla si ya se cumple). Por eso avisa apenas la TRM llega al valor, sin depender de la referencia guardada,
    // que puede quedar desactualizada si la alerta se guardó desde un dispositivo con datos viejos.
    if (cumpleUmbral(direccion, umbral, trmHoy)) {
      acciones.push({ tipo: 'notificar', id: f.id, usuarioId: f.usuario_id, direccion, umbral, trmAnterior, trmNueva: trmHoy });
    } else if (trmAnterior !== trmHoy) {
      acciones.push({ tipo: 'actualizar_referencia', id: f.id, trmNueva: trmHoy });
    }
  }
  return acciones;
}

export interface CorreoAlerta {
  asunto: string;
  html: string;
  texto: string;
}

/**
 * Correo de una alerta cumplida. El aviso y el mensaje motivador van siempre (la persona pidió la alerta).
 * La invitación a ahorrar es promocional: solo se incluye si `promocion` viene (quien autorizó novedades).
 */
export function construirCorreoAlerta(p: {
  direccion: Alerta['direccion'];
  umbral: number;
  trm: number;
  urlApp: string;
  promocion?: Promocion | null;
}): CorreoAlerta {
  const sube = p.direccion === 'sube';
  const verbo = sube ? 'subió' : 'bajó';
  const condicion = sube ? `suba de ${pesos(p.umbral)}` : `baje de ${pesos(p.umbral)}`;
  const asunto = `El dólar ${verbo} a ${pesosConDecimales(p.trm)}: se cumplió tu alerta`;
  const enlace = `${sinBarraFinal(p.urlApp)}/dolar`;
  const motivador = mensajeDeAlerta(p.direccion);
  const margen = `${Math.round(MARGEN_REARME * 100)}%`;
  const pieAlerta = `Esta alerta se vuelve a activar sola cuando el dólar se aleje más de ${margen} de ese valor. Puedes ajustarla o quitarla desde la app.`;

  const texto = [
    `Se cumplió tu alerta del dólar.`,
    ``,
    `Nos pediste que te avisáramos cuando el dólar ${condicion}. La TRM de hoy es ${pesosConDecimales(p.trm)}.`,
    ``,
    motivador.titulo,
    motivador.texto,
    ...(p.promocion ? [``, promocionTexto(p.promocion, p.urlApp)] : []),
    ``,
    `Mira la tendencia en Frilo: ${enlace}`,
    ``,
    pieAlerta,
    `TRM oficial de la Superintendencia Financiera (datos.gov.co).`,
    ``,
    `Más claridad, más libertad. Frilo`,
  ].join('\n');

  const cuerpo = [
    parrafo(`Nos pediste que te avisáramos cuando el dólar <strong>${escapar(condicion)}</strong>. La TRM de hoy es <strong>${escapar(pesosConDecimales(p.trm))}</strong>.`),
    motivadorHtml(motivador),
    p.promocion ? promocionHtml(p.promocion, p.urlApp) : '',
    boton(enlace, 'Ver el dólar en Frilo'),
    parrafo(escapar(pieAlerta), { chico: true, margen: 0 }),
    `<p style="margin:12px 0 0 0;font-size:12px;line-height:18px;color:#4A6158;">TRM oficial de la Superintendencia Financiera (datos.gov.co).</p>`,
  ].join('\n');

  const html = envolverCorreo({
    urlApp: p.urlApp,
    kicker: 'Alerta del dólar',
    cifra: pesosConDecimales(p.trm),
    subtitulo: `El dólar ${verbo} hoy`,
    cuerpo,
    pie: `<p style="margin:16px 0 0 0;font-size:12px;color:#4A6158;">Más claridad, más libertad. Frilo</p>`,
  });

  return { asunto, html, texto };
}
