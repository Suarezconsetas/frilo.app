/** Aviso del día de pago: "guarda tu mes en Frilo". Lógica pura. */
import { capitalizar, nombreMes } from '@/lib/formato';
import { LEGAL } from '@/lib/legal';
import { boton, envolverCorreo, escapar, parrafo, sinBarraFinal } from './plantilla';

/** Último día del mes (`YYYY-MM-DD` → 28..31). */
export function diasDelMes(fecha: string): number {
  const a = Number(fecha.slice(0, 4));
  const m = Number(fecha.slice(5, 7));
  return new Date(Date.UTC(a, m, 0)).getUTCDate();
}

/** Día en que se avisa: el que la persona indicó (o el 1 si no dijo) y, en meses cortos, el último día del mes. */
export function diaDeAviso(diaDePago: number | null | undefined, fecha: string): number {
  const dia = diaDePago && diaDePago >= 1 && diaDePago <= 31 ? diaDePago : 1;
  return Math.min(dia, diasDelMes(fecha));
}

export function tocaAvisarHoy(diaDePago: number | null | undefined, hoy: string): boolean {
  return Number(hoy.slice(8, 10)) === diaDeAviso(diaDePago, hoy);
}

export interface CorreoGuardarMes {
  asunto: string;
  html: string;
  texto: string;
}

/** Es una invitación de Frilo: va solo a quien autorizó novedades y trae baja con un clic. */
export function construirCorreoGuardarMes(p: { mes: string; urlApp: string; urlBaja: string; diaDePago?: number | null }): CorreoGuardarMes {
  const nombre = nombreMes(Number(p.mes.slice(5, 7)));
  const base = sinBarraFinal(p.urlApp);
  const enlace = `${base}/inicio`;
  const asunto = `Guarda tu ${nombre} en Frilo`;
  const frase = p.diaDePago
    ? `Hoy es el día que nos dijiste que te pagan. Calcula tus aportes, lo que debes apartar de prima y cesantías y lo que te queda de ${nombre}, y deja el mes guardado.`
    : `Empieza ${nombre} con claridad: calcula tus aportes, lo que debes apartar de prima y cesantías y lo que te queda, y deja el mes guardado.`;
  const ayuda = 'Toma menos de un minuto: si te pagaron lo mismo que el mes pasado, guárdalo con un toque.';
  const cambio = p.diaDePago ? 'Puedes cambiar el día de pago desde “Editar mi ingreso”.' : 'Si quieres que te avisemos el día que te pagan, cuéntanos ese día en la app.';

  const texto = [
    `Guarda tu ${nombre}`,
    ``,
    frase,
    ayuda,
    ``,
    `Guardar mi ${nombre}: ${enlace}`,
    ``,
    cambio,
    `Recibes este aviso porque aceptaste recibir novedades de Frilo. Dejar de recibirlo: ${p.urlBaja}`,
    `${LEGAL.razonSocial} · ${LEGAL.domicilio}`,
  ].join('\n');

  const cuerpo = [
    parrafo(escapar(frase)),
    parrafo(escapar(ayuda)),
    boton(enlace, `Guardar mi ${nombre}`),
    parrafo(escapar(cambio), { chico: true, margen: 0 }),
  ].join('\n');

  const html = envolverCorreo({
    urlApp: p.urlApp,
    kicker: 'Tu mes en Frilo',
    cifra: capitalizar(nombre),
    subtitulo: 'Calcula y guarda tu mes',
    cuerpo,
    pie: `<p style="margin:16px 0 0 0;font-size:12px;line-height:18px;color:#4A6158;">Recibes este aviso porque aceptaste recibir novedades de Frilo.<br><a href="${escapar(p.urlBaja)}" style="color:#4A6158;">Dejar de recibirlo</a> o gestiónalo en <a href="${escapar(base)}/cuenta" style="color:#4A6158;">Mi cuenta</a>.<br>${escapar(LEGAL.razonSocial)} · ${escapar(LEGAL.domicilio)}</p>`,
  });

  return { asunto, html, texto };
}
