'use client';

import type { ReactNode } from 'react';

/** Selector segmentado de dos o tres opciones: cambia la vista de la misma información. */
export function Selector<T extends string>({
  nombre,
  opciones,
  valor,
  onCambio,
  sobreOliva = false,
}: {
  nombre: string;
  opciones: { valor: T; etiqueta: string }[];
  valor: T;
  onCambio: (v: T) => void;
  sobreOliva?: boolean;
}) {
  return (
    <div role="group" aria-label={nombre} className={`selector${sobreOliva ? ' sobre-oliva' : ''}`}>
      {opciones.map((o) => (
        <button key={o.valor} type="button" aria-pressed={valor === o.valor} onClick={() => onCambio(o.valor)}>
          {o.etiqueta}
        </button>
      ))}
    </div>
  );
}

/** Interruptor para opciones que se aplican al instante. Va siempre con su etiqueta (`idEtiqueta`). */
export function Interruptor({
  idEtiqueta,
  activo,
  onCambio,
  bloqueado = false,
}: {
  idEtiqueta: string;
  activo: boolean;
  onCambio: (v: boolean) => void;
  bloqueado?: boolean;
}) {
  return (
    <button
      type="button"
      className="interruptor"
      aria-labelledby={idEtiqueta}
      aria-pressed={activo}
      aria-disabled={bloqueado || undefined}
      onClick={() => !bloqueado && onCambio(!activo)}
    >
      <span />
    </button>
  );
}

/** Campo con etiqueta siempre visible, ayuda opcional y error enlazado con aria-describedby. */
export function Campo({
  id,
  etiqueta,
  ayuda,
  error,
  children,
}: {
  id: string;
  etiqueta: string;
  ayuda?: string;
  error?: string;
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode;
}) {
  const idAyuda = ayuda ? `${id}-ayuda` : undefined;
  const idError = error ? `${id}-error` : undefined;
  const describe = [idError, idAyuda].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`campo${error ? ' con-error' : ''}`}>
      <label htmlFor={id}>{etiqueta}</label>
      {children({ id, 'aria-describedby': describe, 'aria-invalid': error ? true : undefined })}
      {error && (
        <span id={idError} className="error" role="alert">
          {error}
        </span>
      )}
      {ayuda && (
        <span id={idAyuda} className="ayuda">
          {ayuda}
        </span>
      )}
    </div>
  );
}
