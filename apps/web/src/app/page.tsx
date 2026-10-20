import type { Metadata } from 'next';
import Link from 'next/link';
import { PAGINAS, metadataDe } from '../lib/seo';

export const metadata: Metadata = {
  ...metadataDe('Home'),
  robots: { index: false, follow: false }, // la Home real se construye en la Fase 2
};

/** Marcador de la Fase 1: la Home real (Fase 2) reemplaza esta página. */
export default function Inicio() {
  return (
    <div className="contenido">
      <p className="borrador">
        <strong>Sitio en construcción (Fase 1).</strong> Esta página es provisional y no se indexa. Mira los componentes en <Link href="/componentes">/componentes</Link>.
      </p>
      <h1>Frilo</h1>
      <p>Páginas previstas ({PAGINAS.length}), según el inventario de URLs:</p>
      <ul>
        {PAGINAS.map((p) => (
          <li key={p.id}>
            {p.ruta} · {p.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
