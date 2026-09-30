'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icono, type NombreIcono } from './Icono';

const PESTANAS: { href: string; etiqueta: string; icono: NombreIcono }[] = [
  { href: '/inicio', etiqueta: 'Inicio', icono: 'inicio' },
  { href: '/aportes', etiqueta: 'Aportes', icono: 'aportes' },
  { href: '/ahorro', etiqueta: 'Ahorro', icono: 'ahorro' },
  { href: '/dolar', etiqueta: 'Dólar', icono: 'dolar' },
];

/** Quien gana solo en pesos no ve Dólar: quedan tres pestañas repartidas igual. */
export function Navegacion({ conDolar }: { conDolar: boolean }) {
  const ruta = usePathname();
  return (
    <nav className="navegacion" aria-label="Navegación principal">
      {PESTANAS.filter((p) => conDolar || p.href !== '/dolar').map((p) => {
        const activa = ruta === p.href;
        return (
          <Link key={p.href} href={p.href} aria-current={activa ? 'page' : undefined}>
            <span className="pildora">
              <Icono nombre={p.icono} activo={activa} />
            </span>
            <span>{p.etiqueta}</span>
          </Link>
        );
      })}
    </nav>
  );
}
