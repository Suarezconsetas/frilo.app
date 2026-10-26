'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Enlace } from '../lib/enlaces';
import { NavLink } from './NavLink';

/**
 * Elemento del menú principal con panel de enlaces. El enlace principal sigue siendo navegable (va al hub) y un botón aparte abre
 * el panel (teclado, táctil o ratón). Los enlaces del panel están siempre en el HTML.
 */
export function MenuDesplegable({ titulo, href, coincide, enlaces }: { titulo: string; href: string; coincide?: 'exacta'; enlaces: Enlace[] }) {
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('mousedown', fuera);
      document.removeEventListener('keydown', tecla);
    };
  }, [abierto]);

  return (
    <div ref={raiz} className={`nav-menu${abierto ? ' abierto' : ''}`}>
      <NavLink href={href} coincide={coincide}>
        {titulo}
      </NavLink>
      <button type="button" className="nav-menu-boton" aria-expanded={abierto} aria-label={`${abierto ? 'Cerrar' : 'Abrir'} el menú de ${titulo.toLowerCase()}`} onClick={() => setAbierto((a) => !a)}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <ul className="nav-panel" aria-label={titulo}>
        {enlaces.map((e) => (
          <li key={e.href}>
            <Link href={e.href} onClick={() => setAbierto(false)}>
              {e.texto}
            </Link>
          </li>
        ))}
        <li className="nav-panel-todos">
          <Link href={href} onClick={() => setAbierto(false)}>
            Ver todas →
          </Link>
        </li>
      </ul>
    </div>
  );
}
