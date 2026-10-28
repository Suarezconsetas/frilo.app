'use client';

import { useEffect, useRef } from 'react';
import { pesos } from '@/lib/formato';


/**
 * Para probar montos sin teclear: barra deslizante  y dos botones de ±$100.000 que se pueden mantener
 * oprimidos. El campo de texto sigue siendo la fuente: si escribes un valor fuera de la barra, la barra queda en el extremo.
 */
export function AjusteIngreso({ valor, onCambio, min = 1_000_000, max = 30_000_000, paso = 100_000, formato = pesos, oscuro = false }: { oscuro?: boolean; valor: number; onCambio: (v: number) => void; min?: number; max?: number; paso?: number; formato?: (n: number) => string }) {
  const actual = useRef(valor);
  actual.current = valor;
  const retardo = useRef<ReturnType<typeof setTimeout>>(undefined);
  const repite = useRef<ReturnType<typeof setInterval>>(undefined);

  const mover = (delta: number) => {
    const siguiente = Math.max(0, Math.round((actual.current + delta) / paso) * paso);
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
    <div className={`ajuste-ingreso${oscuro ? ' oscuro' : ''}`} role="group" aria-label="Ajustar el ingreso con la barra o los botones">
      {boton(-paso, '−', `Bajar el ingreso ${formato(paso)}`)}
      <input
        type="range"
        min={min}
        max={max}
        step={paso}
        value={Math.min(Math.max(valor, min), max)}
        onChange={(e) => onCambio(parseInt(e.target.value, 10))}
        aria-label="Ingreso mensual bruto"
        aria-valuetext={formato(valor)}
      />
      {boton(paso, '+', `Subir el ingreso ${formato(paso)}`)}
    </div>
  );
}
