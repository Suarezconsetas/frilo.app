'use client';

import { useEffect, useRef } from 'react';
import { pesos } from '@/lib/formato';

const MIN = 1_000_000;
const MAX = 30_000_000;
const PASO = 100_000;

/**
 * Para probar montos sin teclear: barra deslizante (de $1.000.000 a $30.000.000) y dos botones de ±$100.000 que se pueden mantener
 * oprimidos. El campo de texto sigue siendo la fuente: si escribes un valor fuera de la barra, la barra queda en el extremo.
 */
export function AjusteIngreso({ valor, onCambio }: { valor: number; onCambio: (v: number) => void }) {
  const actual = useRef(valor);
  actual.current = valor;
  const retardo = useRef<ReturnType<typeof setTimeout>>(undefined);
  const repite = useRef<ReturnType<typeof setInterval>>(undefined);

  const mover = (delta: number) => {
    const siguiente = Math.max(0, Math.round((actual.current + delta) / PASO) * PASO);
    actual.current = siguiente;
    onCambio(siguiente);
  };
  const parar = () => {
    clearTimeout(retardo.current);
    clearInterval(repite.current);
  };
  const empezar = (delta: number) => {
    mover(delta);
    parar();
    retardo.current = setTimeout(() => {
      repite.current = setInterval(() => mover(delta), 90);
    }, 450);
  };
  useEffect(() => parar, []);

  const boton = (delta: number, texto: string, etiqueta: string) => (
    <button
      type="button"
      className="ajuste-boton"
      aria-label={etiqueta}
      onPointerDown={(e) => {
        e.preventDefault();
        empezar(delta);
      }}
      onPointerUp={parar}
      onPointerLeave={parar}
      onPointerCancel={parar}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          mover(delta);
        }
      }}
      disabled={delta < 0 && valor <= 0}
    >
      {texto}
    </button>
  );

  return (
    <div className="ajuste-ingreso" role="group" aria-label="Ajustar el ingreso con la barra o los botones">
      {boton(-PASO, '−', `Bajar el ingreso ${pesos(PASO)}`)}
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={PASO}
        value={Math.min(Math.max(valor, MIN), MAX)}
        onChange={(e) => onCambio(parseInt(e.target.value, 10))}
        aria-label="Ingreso mensual bruto"
        aria-valuetext={pesos(valor)}
      />
      {boton(PASO, '+', `Subir el ingreso ${pesos(PASO)}`)}
    </div>
  );
}
