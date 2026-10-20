'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** Enlace de navegación con `aria-current="page"` cuando estás en esa sección. */
export function NavLink({ href, children, coincide }: { href: string; children: ReactNode; coincide?: 'exacta' | 'seccion' }) {
  const ruta = usePathname();
  const activo = coincide === 'exacta' ? ruta === href : ruta === href || ruta.startsWith(`${href}/`);
  return (
    <Link href={href} aria-current={activo ? 'page' : undefined} className="nav-enlace">
      {children}
    </Link>
  );
}
