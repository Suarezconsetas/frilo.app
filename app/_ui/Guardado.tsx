'use client';

import { useState, type FormEvent } from 'react';
import type { ResumenAhorro } from '@/lib/app/derivados';
import { capitalizar, leerNumero, nombreMes, pesos } from '@/lib/formato';
import { Campo } from './controles';
import { Icono } from './Icono';

const etiquetaMes = (mes: string) => `${capitalizar(nombreMes(Number(mes.slice(5, 7))))} ${mes.slice(0, 4)}`;

/**
 * "Lo que llevas guardado": lo que Frilo calcula que deberías llevar apartado frente a lo que la persona
 * confirma que apartó. Frilo no ve sus cuentas: lo confirmado es una declaración suya.
 */
export function Guardado({
  resumen,
  mesHoy,
  onConfirmar,
  onQuitar,
  error,
}: {
  resumen: ResumenAhorro;
  mesHoy: string;
  onConfirmar: (mes: string, monto: number) => Promise<void>;
  onQuitar: (mes: string) => Promise<void>;
  error?: string;
}) {
  const [editando, setEditando] = useState<string | null>(null);
  const [texto, setTexto] = useState('');
  const [errorCampo, setErrorCampo] = useState<string>();
  const [guardando, setGuardando] = useState(false);

  const mesActual = resumen.meses.find((m) => m.mes === mesHoy);
  const sugerido = mesActual?.sugerido ?? 0;
  const avance = resumen.totalCalculado > 0 ? Math.min(1, resumen.totalConfirmado / resumen.totalCalculado) : 0;
  const filaEditada = resumen.meses.find((m) => m.mes === editando);

  function abrir(mes: string) {
    const fila = resumen.meses.find((m) => m.mes === mes);
    setEditando(mes);
    setTexto(String(Math.round(fila?.confirmado ?? fila?.sugerido ?? 0)));
    setErrorCampo(undefined);
  }

  async function confirmar(e: FormEvent) {
    e.preventDefault();
    const monto = leerNumero(texto);
    if (monto === null || monto < 0) {
      setErrorCampo('Escribe cuánto apartaste, por ejemplo 1.656.420. Si no apartaste nada, escribe 0.');
      return;
    }
    setGuardando(true);
    try {
      await onConfirmar(editando!, monto);
      setEditando(null);
    } finally {
      setGuardando(false);
    }
  }

  async function quitar() {
    setGuardando(true);
    try {
      await onQuitar(editando!);
      setEditando(null);
    } finally {
      setGuardando(false);
    }
  }

  const mensaje =
    resumen.diferencia > 0.5
      ? `Te faltan ${pesos(resumen.diferencia)} para ir al día con tu cálculo.`
      : resumen.diferencia < -0.5
        ? `Vas ${pesos(-resumen.diferencia)} por encima de tu cálculo. ¡Bien hecho!`
        : 'Vas al día con tu cálculo. ¡Bien hecho!';

  return (
    <section id="guardado" className="tarjeta" aria-labelledby="guardado-titulo" style={{ scrollMarginTop: 16 }}>
      <h2 id="guardado-titulo" className="titulo-tarjeta">
        Lo que llevas guardado
      </h2>

      <div className="guardado-cifras">
        <div>
          <p className="ayuda">Confirmado por ti</p>
          <p className="cifra-l">{pesos(resumen.totalConfirmado)}</p>
        </div>
        <div>
          <p className="ayuda">Según tus cálculos</p>
          <p className="cifra-l" style={{ color: 'var(--tinta-suave)' }}>
            {pesos(resumen.totalCalculado)}
          </p>
        </div>
      </div>

      <div role="img" aria-label={`Has confirmado el ${Math.round(avance * 100)}% de lo calculado`} className="carril">
        <div style={{ width: `${avance * 100}%` }} />
      </div>
      <p style={{ marginTop: 8, fontSize: 14, lineHeight: '21px' }}>{mensaje}</p>
      {resumen.retiros.length > 0 && (
        <p className="ayuda" style={{ marginTop: 6 }}>
          Ya descontamos lo que cobraste:{' '}
          {resumen.retiros
            .map((r) => `${r.bolsillo === 'prima' ? 'la prima' : 'las cesantías'} de ${nombreMes(Number(r.mes.slice(5, 7)))} (${pesos(r.confirmado)} de lo que confirmaste)`)
            .join(' y ')}
          .
        </p>
      )}

      {mesActual && (
        <div style={{ marginTop: 14 }}>
          {mesActual.confirmado === null ? (
            <button type="button" className="btn btn-primario" onClick={() => abrir(mesHoy)}>
              Ya aparté mi prima y mis cesantías de {nombreMes(Number(mesHoy.slice(5, 7)))}
            </button>
          ) : (
            <div className="guardado-ok">
              <span className="icono-check" aria-hidden="true">
                <Icono nombre="check" tamano={16} activo />
              </span>
              <span>
                Confirmaste {nombreMes(Number(mesHoy.slice(5, 7)))}: <strong>{pesos(mesActual.confirmado)}</strong>
              </span>
              <button type="button" className="enlace" style={{ marginLeft: 'auto', background: 'none', border: 0, cursor: 'pointer' }} onClick={() => abrir(mesHoy)}>
                Cambiar
              </button>
            </div>
          )}
        </div>
      )}

      {editando && (
        <form onSubmit={confirmar} noValidate style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Campo
            id="monto-ahorro"
            etiqueta={`¿Cuánto apartaste en ${etiquetaMes(editando)}?`}
            ayuda={`Frilo calculó ${pesos(filaEditada?.sugerido ?? sugerido)}. Escribe lo que realmente apartaste.`}
            error={errorCampo}
          >
            {(p) => <input {...p} inputMode="decimal" value={texto} onChange={(e) => setTexto(e.target.value)} autoFocus />}
          </Campo>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primario" style={{ minHeight: 48, borderRadius: 'var(--radius-m)', fontSize: 15 }} disabled={guardando}>
              {guardando ? 'Guardando…' : 'Confirmar'}
            </button>
            <button type="button" className="btn btn-secundario" style={{ width: 'auto' }} onClick={() => setEditando(null)} disabled={guardando}>
              Cancelar
            </button>
          </div>
          {filaEditada?.confirmado !== null && filaEditada?.confirmado !== undefined && (
            <button type="button" className="enlace" style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0 }} onClick={quitar} disabled={guardando}>
              Quitar esta confirmación
            </button>
          )}
        </form>
      )}

      {error && (
        <p className="aviso-error" role="alert" style={{ marginTop: 12 }}>
          {error}
        </p>
      )}

      <details className="guardado-detalle">
        <summary>Ver mes a mes</summary>
        <ul>
          {[...resumen.meses].reverse().map((m) => (
            <li key={m.mes}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600 }}>{etiquetaMes(m.mes)}</p>
                <p className="ayuda">
                  Calculado {pesos(m.sugerido)} · {m.confirmado === null ? 'sin confirmar' : `confirmaste ${pesos(m.confirmado)}`}
                </p>
              </div>
              <button type="button" className="enlace" style={{ background: 'none', border: 0, cursor: 'pointer' }} onClick={() => abrir(m.mes)}>
                {m.confirmado === null ? 'Confirmar' : 'Cambiar'}
              </button>
            </li>
          ))}
        </ul>
      </details>

      <p className="legal" style={{ marginTop: 12 }}>
        Frilo no ve tus cuentas ni mueve tu dinero: lo confirmado es lo que tú nos dices. Cuando marcas &ldquo;Ya cobré mi prima&rdquo; descontamos la mitad de
        lo que apartaste en ese semestre (la otra mitad son tus cesantías).
      </p>
    </section>
  );
}
