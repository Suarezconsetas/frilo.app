/** Recordatorio de fin de mes: "¿ya apartaste tu prima y tus cesantías?". Lógica pura. */
import { ahorroMensual } from '@/lib/calculos';
import { capitalizar, nombreMes, pesos } from '@/lib/formato';
import { LEGAL } from '@/lib/legal';
import { promocionHtml, promocionTexto, type Promocion } from './mensajes';
import { boton, envolverCorreo, escapar, parrafo, sinBarraFinal } from './plantilla';

/** Lo que Frilo calcula que debía apartar este mes, a partir del último pago registrado. */
export function montoSugerido(p: { moneda: string; monto: number; tasaRecibida: number | null; trm: number | null }): number | null {
  const bruto = p.moneda === 'COP' ? p.monto : p.trm !== null || p.tasaRecibida !== null ? p.monto * (p.tasaRecibida ?? p.trm!) : null;
  return bruto === null ? null : ahorroMensual(bruto).total;
}

export interface CorreoRecordatorio {
  asunto: string;
  html: string;
  texto: string;
}

/** Es promocional (invita a ahorrar): va solo a quien autorizó novedades y trae baja con un clic. */
export function construirCorreoRecordatorio(p: {
  mes: string; // YYYY-MM
  monto: number;
  urlApp: string;
  urlBaja: string;
  promocion?: Promocion | null;
}): CorreoRecordatorio {
  const nombre = nombreMes(Number(p.mes.slice(5, 7)));
  const base = sinBarraFinal(p.urlApp);
  const enlace = `${base}/ahorro#guardado`;
  const asunto = `${capitalizar(nombre)} se acaba: ¿ya apartaste tu prima y tus cesantías?`;
  const frase = 'Si ya los apartaste, confírmalo en Frilo en 30 segundos y mira cuánto llevas guardado. Si todavía no, este es un buen momento: apartar un poco cada mes es lo que hace la diferencia.';

  const texto = [
    `Recordatorio de fin de mes`,
    ``,
    `Para tu prima y tus cesantías de ${nombre}, Frilo calculó ${pesos(p.monto)}.`,
    frase,
    ...(p.promocion ? [``, promocionTexto(p.promocion, p.urlApp)] : []),
    ``,
    `Confirmar lo que aparté: ${enlace}`,
    ``,
    `Frilo no ve tus cuentas ni mueve tu dinero: lo confirmas tú.`,
    `Recibes este recordatorio porque aceptaste recibir novedades de Frilo. Dejar de recibirlo: ${p.urlBaja}`,
    `${LEGAL.razonSocial} · ${LEGAL.domicilio}`,
  ].join('\n');

  const cuerpo = [
    parrafo(escapar(frase)),
    p.promocion ? promocionHtml(p.promocion, p.urlApp) : '',
    boton(enlace, 'Confirmar lo que aparté'),
    parrafo('Frilo no ve tus cuentas ni mueve tu dinero: lo confirmas tú.', { chico: true, margen: 0 }),
  ].join('\n');

  const html = envolverCorreo({
    urlApp: p.urlApp,
    kicker: 'Recordatorio de fin de mes',
    cifra: pesos(p.monto),
    subtitulo: `Lo que calculamos para tu prima y tus cesantías de ${nombre}`,
    cuerpo,
    pie: `<p style="margin:16px 0 0 0;font-size:12px;line-height:18px;color:#4A6158;">Recibes este recordatorio porque aceptaste recibir novedades de Frilo.<br><a href="${escapar(p.urlBaja)}" style="color:#4A6158;">Dejar de recibirlo</a> o gestiónalo en <a href="${escapar(base)}/cuenta" style="color:#4A6158;">Mi cuenta</a>.<br>${escapar(LEGAL.razonSocial)} · ${escapar(LEGAL.domicilio)}</p>`,
  });

  return { asunto, html, texto };
}
