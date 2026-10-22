import Link from 'next/link';
import { fechaDe, fechaLarga } from '../lib/paginas';

/** Línea de confianza (E-E-A-T): autor, revisor, fecha de actualización y enlace a cómo se hace. */
export function LineaConfianza({ id, tipo = 'calculadora' }: { id: string; tipo?: 'calculadora' | 'guia' }) {
  return (
    <p className="linea-confianza">
      Escrito y revisado por <Link href="/quienes-somos">Nicolás Suárez</Link> con fuentes oficiales · Actualizado el {fechaLarga(fechaDe(id))} ·{' '}
      <Link href="/metodologia">{tipo === 'guia' ? 'Cómo hacemos nuestras guías' : 'Cómo calculamos'}</Link>
    </p>
  );
}
