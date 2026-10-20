'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/app/estado';
import { guardarRecordatorioPlanilla, leerRecordatorioPlanilla, type AjustesPlanilla } from '@/lib/app/nube';
import { hoyColombia } from '@/lib/app/fechas';
import { fechaConDia, mesAnterior, proximaFechaLimite } from '@/lib/app/planilla';
import { capitalizar, nombreMes } from '@/lib/formato';
import { Campo, Interruptor } from './controles';

/** Fecha límite de pago de la planilla según los dos últimos dígitos del documento, y el recordatorio por correo. */
export function RecordatorioPlanilla() {
  const { estado, actualizar, sesion, db } = useApp();
  const userId = sesion?.user.id ?? null;
  const guardados = estado.digitosDocumento ?? '';
  const [texto, setTexto] = useState(guardados);
  const [error, setError] = useState<string>();

  useEffect(() => setTexto(guardados), [guardados]);

  // Lo guardado en la cuenta manda (el recordatorio se puede apagar desde el correo sin abrir la app).
  useEffect(() => {
    if (!userId) return;
    leerRecordatorioPlanilla(db(), userId)
      .then((a) => actualizar({ digitosDocumento: a.digitos, recordatorioPlanilla: a.activo, diasAnticipacion: a.dias }))
      .catch(() => undefined);
    // solo al abrir la pantalla
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  /** Actualiza la pantalla y guarda en la cuenta. */
  async function aplicar(cambio: Partial<AjustesPlanilla>) {
    const nuevo: AjustesPlanilla = { digitos: guardados || undefined, activo: !!estado.recordatorioPlanilla, dias: estado.diasAnticipacion ?? 3, ...cambio };
    actualizar({ digitosDocumento: nuevo.digitos, recordatorioPlanilla: nuevo.activo && !!nuevo.digitos, diasAnticipacion: nuevo.dias });
    if (!userId) return;
    try {
      await guardarRecordatorioPlanilla(db(), userId, nuevo);
      setError(undefined);
    } catch {
      setError('No pudimos guardar el cambio. Inténtalo de nuevo.');
    }
  }

  const valido = /^\d{2}$/.test(guardados);
  const proxima = valido ? proximaFechaLimite(guardados, hoyColombia()) : null;
  const activo = !!estado.recordatorioPlanilla && valido;
  const dias = estado.diasAnticipacion ?? 3;

  function cambiarDigitos(valor: string) {
    const limpio = valor.replace(/\D/g, '').slice(0, 2);
    setTexto(limpio);
    setError(undefined);
    if (limpio.length === 2) void aplicar({ digitos: limpio });
    else if (limpio.length === 0) void aplicar({ digitos: undefined, activo: false });
  }

  function cambiarRecordatorio(v: boolean) {
    if (v && !valido) {
      setError('Escribe primero los dos últimos dígitos de tu documento.');
      return;
    }
    void aplicar({ activo: v });
  }

  return (
    <section className="tarjeta" aria-labelledby="fecha-planilla">
      <h2 id="fecha-planilla" className="titulo-tarjeta">
        ¿Cuándo vence tu planilla?
      </h2>
      <p className="texto-suave" style={{ margin: '6px 0 14px', fontSize: 14, lineHeight: '21px' }}>
        Los independientes pagan la planilla en un día hábil del mes que depende de los dos últimos dígitos de su documento.
      </p>
      <Campo
        id="digitos-documento"
        etiqueta="Dos últimos dígitos de tu cédula o NIT"
        ayuda="Solo guardamos esos dos dígitos, nunca el documento completo. Si usas NIT, los dos últimos antes del dígito de verificación."
        error={error}
      >
        {(p) => <input {...p} value={texto} onChange={(e) => cambiarDigitos(e.target.value)} inputMode="numeric" maxLength={2} placeholder="Por ejemplo 89" autoComplete="off" />}
      </Campo>

      {proxima && (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: 'var(--oliva)', color: '#fff' }} aria-live="polite">
          <p style={{ fontSize: 13, color: 'var(--oliva-suave)' }}>Tu fecha límite de {nombreMes(Number(proxima.mes.slice(5, 7)))}</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--manzana)', margin: '4px 0' }}>{capitalizar(fechaConDia(proxima.fecha))}</p>
          <p style={{ fontSize: 13 }}>
            Ese día pagas los aportes de {nombreMes(Number(mesAnterior(proxima.mes).slice(5, 7)))} (se paga mes vencido).
          </p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginTop: 16 }}>
        <div>
          <p id="recordatorio-etiqueta" style={{ fontSize: 16, fontWeight: 600 }}>
            Recordarme por correo
          </p>
          <p className="texto-suave" style={{ marginTop: 6, fontSize: 14, lineHeight: '21px' }}>
            Te escribimos {dias > 0 ? `${dias} ${dias === 1 ? 'día hábil' : 'días hábiles'} antes y ` : ''}el mismo día de tu fecha límite, cada mes.
          </p>
        </div>
        <Interruptor idEtiqueta="recordatorio-etiqueta" activo={activo} onCambio={cambiarRecordatorio} />
      </div>

      {activo && (
        <div className="campo" style={{ marginTop: 14 }}>
          <label htmlFor="dias-anticipacion" style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
            Primer aviso
          </label>
          <select id="dias-anticipacion" value={dias} onChange={(e) => void aplicar({ dias: Number(e.target.value) })}>
            <option value={0}>Solo el mismo día</option>
            <option value={1}>1 día hábil antes</option>
            <option value={2}>2 días hábiles antes</option>
            <option value={3}>3 días hábiles antes</option>
            <option value={5}>5 días hábiles antes</option>
          </select>
        </div>
      )}

      <p className="legal" style={{ marginTop: 14 }}>
        Fecha calculada con el Decreto 1990 de 2016 y el calendario de festivos de Colombia. Confírmala con tu operador de planilla: si hay un cambio de calendario o un festivo extraordinario, puede variar. Este recordatorio es un servicio de aviso, no reemplaza el pago.
      </p>
    </section>
  );
}
