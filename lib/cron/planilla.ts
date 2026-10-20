/** Correo del recordatorio de la fecha límite de la planilla PILA. Lógica pura. */
import { fechaConDia, mesAnterior, type TipoRecordatorio } from '@/lib/app/planilla';
import { capitalizar, nombreMes, pesos } from '@/lib/formato';
import { LEGAL } from '@/lib/legal';
import { boton, envolverCorreo, escapar, parrafo, sinBarraFinal } from './plantilla';

const MI_PLANILLA = 'https://independientes2.miplanilla.com/PublicoIndependientes/Publico/IndexIndependientes';

export interface EstimadoPlanilla {
  total: number;
  salud: number;
  pension: number;
  arl: number;
  fsp: number;
}

export interface CorreoPlanilla {
  asunto: string;
  html: string;
  texto: string;
}

/** Es un servicio que la persona activó (no publicidad): no pide autorización de novedades, pero trae baja con un clic. */
export function construirCorreoPlanilla(p: {
  tipo: TipoRecordatorio;
  fechaLimite: string; // YYYY-MM-DD
  periodo: string; // YYYY-MM del mes en que se paga
  diasAnticipacion: number;
  estimado: EstimadoPlanilla | null;
  urlApp: string;
  urlBaja: string;
}): CorreoPlanilla {
  const base = sinBarraFinal(p.urlApp);
  const fecha = fechaConDia(p.fechaLimite);
  const mesPago = nombreMes(Number(mesAnterior(p.periodo).slice(5, 7)));
  const esHoy = p.tipo === 'dia';
  const asunto = esHoy ? 'Hoy vence tu planilla de seguridad social' : `Tu planilla vence el ${fecha}`;
  const intro = esHoy
    ? `Hoy, ${fecha}, es tu fecha límite para pagar la planilla de seguridad social de ${mesPago}.`
    : `Tu fecha límite para pagar la planilla de seguridad social de ${mesPago} es el ${fecha}.`;
  const vencido = 'Los independientes pagan mes vencido: en este mes se pagan los aportes del mes anterior.';
  const e = p.estimado;
  const lineasEstimado = e
    ? [
        `Valor estimado con tu último ingreso guardado en Frilo: ${pesos(e.total)}`,
        `Salud ${pesos(e.salud)} · Pensión ${pesos(e.pension)} · ARL ${pesos(e.arl)} · Fondo de Solidaridad ${pesos(e.fsp)}`,
      ]
    : [];
  const aviso = 'Cálculo estimado. No incluye el 4x1000 ni las retenciones de Colombia o del país contratante. No es asesoría financiera, legal ni tributaria.';

  const texto = [
    intro,
    vencido,
    ...(lineasEstimado.length ? ['', ...lineasEstimado] : []),
    ``,
    `Pagar en MiPlanilla: ${MI_PLANILLA}`,
    `Ver el detalle en Frilo: ${base}/aportes`,
    ``,
    aviso,
    `Recibes este recordatorio porque lo activaste en Frilo. Apagarlo: ${p.urlBaja}`,
    `${LEGAL.razonSocial} · ${LEGAL.domicilio}`,
  ].join('\n');

  const cuerpo = [
    parrafo(escapar(intro)),
    parrafo(escapar(vencido), { chico: true }),
    e
      ? `<div style="margin:0 0 20px 0;padding:16px;border-radius:12px;background:#E6EEE9;">
<p style="margin:0 0 6px 0;font-size:14px;line-height:20px;color:#4A6158;">Valor estimado de tu planilla, con tu último ingreso guardado</p>
<p style="margin:0 0 8px 0;font-size:24px;line-height:30px;font-weight:700;">${escapar(pesos(e.total))}</p>
<p style="margin:0;font-size:14px;line-height:21px;">Salud ${escapar(pesos(e.salud))} · Pensión ${escapar(pesos(e.pension))} · ARL ${escapar(pesos(e.arl))} · Fondo de Solidaridad ${escapar(pesos(e.fsp))}</p>
</div>`
      : '',
    boton(MI_PLANILLA, 'Pagar en MiPlanilla'),
    parrafo(`<a href="${escapar(base)}/aportes" style="color:#0F372D;font-weight:600;">Ver el detalle en Frilo</a>`, { margen: 12 }),
    parrafo(escapar(aviso), { chico: true, margen: 0 }),
  ].join('\n');

  const html = envolverCorreo({
    urlApp: p.urlApp,
    kicker: esHoy ? 'Vence hoy' : 'Planilla de seguridad social',
    cifra: capitalizar(fecha),
    subtitulo: esHoy ? 'Es tu fecha límite de pago' : `Fecha límite de pago · ${p.diasAnticipacion} ${p.diasAnticipacion === 1 ? 'día hábil' : 'días hábiles'} antes`,
    cuerpo,
    pie: `<p style="margin:16px 0 0 0;font-size:12px;line-height:18px;color:#4A6158;">Recibes este recordatorio porque lo activaste en Frilo.<br><a href="${escapar(p.urlBaja)}" style="color:#4A6158;">Apagar el recordatorio</a> o cámbialo en <a href="${escapar(base)}/aportes" style="color:#4A6158;">Aportes</a>.<br>${escapar(LEGAL.razonSocial)} · ${escapar(LEGAL.domicilio)}</p>`,
  });

  return { asunto, html, texto };
}
