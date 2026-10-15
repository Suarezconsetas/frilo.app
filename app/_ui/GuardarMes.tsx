'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { mesEstaGuardado, ultimoMesGuardado } from '@/lib/app/derivados';
import { useApp } from '@/lib/app/estado';
import type { IngresoInicial } from '@/lib/app/tipos';
import { capitalizar, nombreMes, pesos, usd } from '@/lib/formato';
import { Campo } from './controles';
import { Icono } from './Icono';

const etiquetaMes = (mes: string) => capitalizar(nombreMes(Number(mes.slice(5, 7))));

/**
 * Inicio: cada mes la persona confirma su ingreso para dejarlo guardado.
 * - Mes ya guardado: lo confirma y deja cambiar el valor.
 * - Mes sin guardar: ofrece guardarlo con el mismo ingreso del último mes o cambiar el valor.
 * Los meses anteriores no se tocan: cada mes guardado es un registro propio.
 */
export function GuardarMes({ ingreso, mesHoy, montoPesos }: { ingreso: IngresoInicial; mesHoy: string; montoPesos: number }) {
  const { estado, actualizar } = useApp();
  const guardado = mesEstaGuardado(estado.mesIngreso, estado.mesInicio, mesHoy);
  const ultimo = ultimoMesGuardado(estado.mesIngreso, estado.mesInicio);
  const [dia, setDia] = useState('');
  const [errorDia, setErrorDia] = useState<string>();
  const mes = etiquetaMes(mesHoy);
  const monto = ingreso.moneda === 'USD' ? usd(ingreso.monto) : pesos(ingreso.monto);

  function guardarMes() {
    actualizar({ mesIngreso: mesHoy });
  }

  function guardarDia(e: FormEvent) {
    e.preventDefault();
    const d = Number(dia.trim());
    if (!Number.isInteger(d) || d < 1 || d > 31) {
      setErrorDia('Escribe un día del mes entre 1 y 31.');
      return;
    }
    setErrorDia(undefined);
    actualizar({ diaDePago: d });
  }

  return (
    <>
      {guardado ? (
        <section className="tarjeta" aria-live="polite">
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span className="icono-check" aria-hidden="true">
              <Icono nombre="check" tamano={16} activo />
            </span>
            <div>
              <h2 className="titulo-tarjeta">{mes} guardado</h2>
              <p className="texto-suave" style={{ margin: '6px 0 0', fontSize: 14, lineHeight: '21px' }}>
                Quedó registrado tu ingreso de {monto} ({pesos(montoPesos)}). Si este mes te pagaron otro valor,{' '}
                <Link href="/ingreso" className="enlace">
                  cámbialo aquí
                </Link>
                : tus meses anteriores no se modifican.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="tarjeta" aria-live="polite">
          <h2 className="titulo-tarjeta">Guarda tu {mes.toLowerCase()}</h2>
          <p className="texto-suave" style={{ margin: '6px 0 14px', fontSize: 14, lineHeight: '21px' }}>
            {ultimo ? `Tu último mes guardado fue ${etiquetaMes(ultimo).toLowerCase()}, con ${monto}.` : ''} ¿Te pagaron lo mismo este mes? Guárdalo con un toque, o cambia el valor y recalculamos.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button type="button" className="btn btn-primario" onClick={guardarMes}>
              Guardar {mes.toLowerCase()} con {monto}
            </button>
            <Link href="/ingreso" className="btn btn-secundario">
              Calcular {mes.toLowerCase()} con otro valor
            </Link>
          </div>
        </section>
      )}

      {!estado.diaDePago && (
        <section className="tarjeta">
          <h2 className="titulo-tarjeta">¿Qué día del mes te pagan?</h2>
          <p className="texto-suave" style={{ margin: '6px 0 14px', fontSize: 14, lineHeight: '21px' }}>
            Ese día te recordamos guardar tu mes en Frilo (por correo, si aceptaste novedades).
          </p>
          <form onSubmit={guardarDia} noValidate style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <Campo id="dia-pago-inicio" etiqueta="Día del mes" error={errorDia}>
                {(p) => <input {...p} value={dia} onChange={(e) => setDia(e.target.value)} inputMode="numeric" placeholder="Por ejemplo 15" />}
              </Campo>
            </div>
            <button type="submit" className="btn btn-secundario" style={{ width: 'auto' }}>
              Guardar
            </button>
          </form>
        </section>
      )}
    </>
  );
}
