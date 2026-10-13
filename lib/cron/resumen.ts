/** Resumen semanal del dólar: cómo cerró la semana y cómo estaba hace una semana, un mes y un año. Lógica pura. */
import { panelTrm, restarDias, type RegistroTrm } from '@/lib/calculos';
import { fechaLarga, pctConSigno, pesosConDecimales, pesosConSigno } from '@/lib/formato';
import { LEGAL } from '@/lib/legal';
import { mensajeDeSemana, motivadorHtml, promocionHtml, promocionTexto, type Movimiento, type Promocion } from './mensajes';
import { boton, envolverCorreo, escapar, parrafo, sinBarraFinal } from './plantilla';

/** Variación semanal menor a este umbral se considera "se mantuvo". */
const UMBRAL_IGUAL = 0.0025;

export interface DatosSemana {
  fecha: string;
  cierre: number;
  referencias: { clave: 'semana' | 'mes' | 'anio'; etiqueta: string; trm: number; variacionPct: number; variacionAbs: number }[];
  minima: number;
  maxima: number;
  movimiento: Movimiento;
}

const ETIQUETA = { semana: 'Hace una semana', mes: 'Hace un mes', anio: 'Hace un año' } as const;

/** Arma los datos del resumen con la serie guardada. Lanza si no hay TRM para hoy. */
export function datosDeSemana(serie: RegistroTrm[], hoy: string): DatosSemana {
  const panel = panelTrm(serie, hoy);
  const desde = restarDias(hoy, 7);
  const semana = serie.filter((r) => r.vigenciadesde > desde && r.vigenciadesde <= hoy).map((r) => r.valor);
  const valores = semana.length ? semana : [panel.hoy.trm];
  const sem = panel.variaciones.find((v) => v.referencia === 'semana');
  const pctSemana = sem?.variacionPct ?? 0;
  return {
    fecha: hoy,
    cierre: panel.hoy.trm,
    referencias: panel.variaciones.map((v) => ({
      clave: v.referencia as 'semana' | 'mes' | 'anio',
      etiqueta: ETIQUETA[v.referencia as keyof typeof ETIQUETA],
      trm: v.trm,
      variacionPct: v.variacionPct,
      variacionAbs: v.variacionAbs,
    })),
    minima: Math.min(...valores),
    maxima: Math.max(...valores),
    movimiento: pctSemana > UMBRAL_IGUAL ? 'sube' : pctSemana < -UMBRAL_IGUAL ? 'baja' : 'igual',
  };
}

export interface CorreoResumen {
  asunto: string;
  html: string;
  texto: string;
}

const flecha = (pct: number) => (pct > 0 ? '↑' : pct < 0 ? '↓' : '→');

/** Resumen de los viernes. Es promocional (invita a ahorrar): va solo a quien autorizó novedades y trae baja con un clic. */
export function construirCorreoResumen(p: { datos: DatosSemana; urlApp: string; urlBaja: string; promocion?: Promocion | null }): CorreoResumen {
  const { datos: d } = p;
  const base = sinBarraFinal(p.urlApp);
  const enlace = `${base}/dolar`;
  const mensaje = mensajeDeSemana(d.movimiento);
  const asunto = `Así cerró el dólar esta semana: ${pesosConDecimales(d.cierre)}`;
  const linea = (r: DatosSemana['referencias'][number]) =>
    `${r.etiqueta}: ${pesosConDecimales(r.trm)} (${pctConSigno(r.variacionPct)}, ${pesosConSigno(r.variacionAbs)} frente a hoy)`;

  const texto = [
    `Resumen semanal del dólar`,
    ``,
    `El dólar cerró la semana en ${pesosConDecimales(d.cierre)} (TRM vigente al ${fechaLarga(d.fecha)}).`,
    `En la semana estuvo entre ${pesosConDecimales(d.minima)} y ${pesosConDecimales(d.maxima)}.`,
    ``,
    `Cómo estaba antes:`,
    ...d.referencias.map((r) => `- ${linea(r)}`),
    ``,
    mensaje.titulo,
    mensaje.texto,
    ...(p.promocion ? [``, promocionTexto(p.promocion, p.urlApp)] : []),
    ``,
    `Ver el dólar en Frilo: ${enlace}`,
    ``,
    `TRM oficial de la Superintendencia Financiera (datos.gov.co). Información de referencia, no asesoría financiera.`,
    `Recibes este resumen porque aceptaste recibir novedades de Frilo. Dejar de recibirlo: ${p.urlBaja}`,
    `${LEGAL.razonSocial} · ${LEGAL.domicilio}`,
  ].join('\n');

  const filas = d.referencias
    .map(
      (r) => `<tr>
<td style="padding:10px 0;border-top:1px solid #D6E0DA;font-size:15px;">${escapar(r.etiqueta)}<br><span style="font-size:13px;color:#4A6158;">${escapar(pesosConDecimales(r.trm))}</span></td>
<td style="padding:10px 0;border-top:1px solid #D6E0DA;font-size:15px;font-weight:700;text-align:right;white-space:nowrap;">${escapar(flecha(r.variacionPct))} ${escapar(pctConSigno(r.variacionPct))}<br><span style="font-size:13px;font-weight:400;color:#4A6158;">${escapar(pesosConSigno(r.variacionAbs))}</span></td>
</tr>`,
    )
    .join('\n');

  const cuerpo = [
    parrafo(
      `En la semana el dólar estuvo entre <strong>${escapar(pesosConDecimales(d.minima))}</strong> y <strong>${escapar(pesosConDecimales(d.maxima))}</strong>. Así está hoy frente a:`,
    ),
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">${filas}</table>`,
    motivadorHtml(mensaje),
    p.promocion ? promocionHtml(p.promocion, p.urlApp) : '',
    boton(enlace, 'Ver el dólar en Frilo'),
    `<p style="margin:0;font-size:12px;line-height:18px;color:#4A6158;">TRM oficial de la Superintendencia Financiera (datos.gov.co). Información de referencia, no asesoría financiera.</p>`,
  ].join('\n');

  const html = envolverCorreo({
    urlApp: p.urlApp,
    kicker: 'Resumen semanal del dólar',
    cifra: pesosConDecimales(d.cierre),
    subtitulo: `Así cerró la semana · ${fechaLarga(d.fecha)}`,
    cuerpo,
    pie: `<p style="margin:16px 0 0 0;font-size:12px;line-height:18px;color:#4A6158;">Recibes este resumen porque aceptaste recibir novedades de Frilo.<br><a href="${escapar(p.urlBaja)}" style="color:#4A6158;">Dejar de recibirlo</a> o gestiónalo en <a href="${escapar(base)}/cuenta" style="color:#4A6158;">Mi cuenta</a>.<br>${escapar(LEGAL.razonSocial)} · ${escapar(LEGAL.domicilio)}</p>`,
  });

  return { asunto, html, texto };
}
