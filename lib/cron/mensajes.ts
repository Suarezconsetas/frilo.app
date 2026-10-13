/** Textos de los correos del dólar: mensajes motivadores según suba o baje, y la invitación a ahorrar. */
import { AVISOS, CUENTAS_MVP, rendimiento, type CuentaAhorro } from '@/lib/calculos';
import { fechaCorta, pct, pesos } from '@/lib/formato';
import { boton, escapar, parrafo, sinBarraFinal } from './plantilla';

export type Movimiento = 'sube' | 'baja' | 'igual';

export interface MensajeMotivador {
  titulo: string;
  texto: string;
}

/** Mensaje para una alerta cumplida: aprovecha cada caso sin prometer nada. */
export function mensajeDeAlerta(m: 'sube' | 'baja'): MensajeMotivador {
  return m === 'sube'
    ? {
        titulo: 'Tu esfuerzo de cada día puede rendir más',
        texto:
          'Cuando el dólar sube, cada dólar que recibes vale más pesos. El esfuerzo que haces día a día puede verse mejor recompensado a fin de mes.',
      }
    : {
        titulo: 'Planear con calma te da tranquilidad',
        texto:
          'Cuando el dólar baja, tu trabajo vale lo mismo: lo que cambia es la tasa del día. Es un buen momento para planear con calma y apartar una parte de lo que ganas; el ahorro constante te protege en los meses en que el dólar está más bajo.',
      };
}

/** Mensaje para el resumen de la semana. `igual` cuando casi no se movió. */
export function mensajeDeSemana(m: Movimiento): MensajeMotivador {
  if (m === 'sube') {
    return {
      titulo: 'Esta semana el dólar subió',
      texto: 'Tu trabajo de la semana vale más pesos. Es una buena razón para seguir con constancia: el esfuerzo de cada día se ve reflejado a fin de mes.',
    };
  }
  if (m === 'baja') {
    return {
      titulo: 'Esta semana el dólar bajó',
      texto:
        'Tu trabajo sigue valiendo lo mismo, y lo que suma es la constancia. Una semana así es un buen momento para revisar tus metas y apartar algo para los meses en que el dólar esté más bajo.',
    };
  }
  return {
    titulo: 'Esta semana el dólar se mantuvo',
    texto: 'Con un dólar estable es más fácil planear. Aprovecha para definir cuánto vas a apartar este mes.',
  };
}

export interface Promocion {
  entidad: string;
  producto: string;
  tasaEA: number;
  monto: number;
  rendimientoMensual: number;
  patrocinada: boolean;
  fechaConsulta: string;
}

/** Cuenta de mayor tasa sin condiciones y cuánto rendiría un monto de ejemplo en 30 días (antes de impuestos). */
export function promocionDeEjemplo(cuentas: CuentaAhorro[] = CUENTAS_MVP, monto = 1_000_000): Promocion | null {
  const cuenta = [...cuentas].sort((a, b) => b.tasaBaseEA - a.tasaBaseEA)[0];
  if (!cuenta) return null;
  return {
    entidad: cuenta.entidad,
    producto: cuenta.producto,
    tasaEA: cuenta.tasaBaseEA,
    monto,
    rendimientoMensual: rendimiento(monto, 30, cuenta.tasaBaseEA),
    patrocinada: cuenta.patrocinado,
    fechaConsulta: cuenta.fechaConsulta,
  };
}

/** La invitación a ahorrar es promocional: solo va a quien autorizó recibir novedades y recomendaciones. */
export function promocionTexto(p: Promocion, urlApp: string): string {
  return [
    'Pon a trabajar una parte de lo que ganas:',
    `con ${pesos(p.monto)} en ${p.entidad} (${p.producto}, ${pct(p.tasaEA, 2)} E.A.) ganarías unos ${pesos(p.rendimientoMensual)} en un mes, antes de impuestos.${p.patrocinada ? ` (${AVISOS.patrocinado})` : ''}`,
    `Compara las cuentas: ${sinBarraFinal(urlApp)}/ahorro`,
    `Tasa según la información de la entidad del ${fechaCorta(p.fechaConsulta)}. Es información de referencia, no asesoría financiera.`,
  ].join('\n');
}

export function promocionHtml(p: Promocion, urlApp: string): string {
  const enlace = `${sinBarraFinal(urlApp)}/ahorro`;
  return `<div style="margin:0 0 20px 0;padding:16px;border-radius:12px;background:#0F372D;">
<p style="margin:0 0 6px 0;font-size:14px;line-height:20px;color:#B5CCC1;">Pon a trabajar una parte de lo que ganas</p>
<p style="margin:0 0 12px 0;font-size:16px;line-height:24px;color:#FFFFFF;">Con <strong>${escapar(pesos(p.monto))}</strong> en <strong>${escapar(p.entidad)}</strong> (${escapar(p.producto)}, ${escapar(pct(p.tasaEA, 2))} E.A.) ganarías unos <strong style="color:#6FFF8F;">${escapar(pesos(p.rendimientoMensual))}</strong> en un mes, antes de impuestos.${p.patrocinada ? ` <em>(${escapar(AVISOS.patrocinado)})</em>` : ''}</p>
<p style="margin:0 0 12px 0;"><a href="${escapar(enlace)}" style="display:inline-block;background:#6FFF8F;color:#0F372D;text-decoration:none;font-weight:600;font-size:15px;padding:12px 20px;border-radius:12px;">Ver cuentas con rentabilidad</a></p>
<p style="margin:0;font-size:12px;line-height:18px;color:#B5CCC1;">Tasa según la información de la entidad del ${escapar(fechaCorta(p.fechaConsulta))}. Información de referencia, no asesoría financiera.</p>
</div>`;
}

/** Bloque de mensaje motivador reutilizable. */
export function motivadorHtml(m: MensajeMotivador): string {
  return `<div style="margin:0 0 20px 0;padding:16px;border-radius:12px;background:#E6EEE9;">
<p style="margin:0 0 6px 0;font-size:16px;line-height:22px;font-weight:700;">${escapar(m.titulo)}</p>
<p style="margin:0;font-size:15px;line-height:22px;">${escapar(m.texto)}</p>
</div>`;
}

export { boton, parrafo };
