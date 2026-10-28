'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

/** Marco del encabezado: en móvil el menú se pliega detrás de un botón (el encabezado ocupaba 250 px de pantalla). */
export function EncabezadoMovil({ logo, acciones, children }: { logo: ReactNode; acciones: ReactNode; children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();
  useEffect(() => setAbierto(false), [ruta]);
  return (
    <header className={`header${abierto ? ' header-abierto' : ''}`}>
      <div className="header-fila">
        {logo}
        <div className="header-movil-acciones">
          <button type="button" className="header-menu-boton" aria-expanded={abierto} aria-controls="menu-principal" onClick={() => setAbierto((a) => !a)}>
            <span className="sr-only">{abierto ? 'Cerrar el menú' : 'Abrir el menú'}</span>
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              {abierto ? <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
        <div id="menu-principal" className="header-colapsable">
          {children}
          {acciones}
        </div>
      </div>
    </header>
  );
}
