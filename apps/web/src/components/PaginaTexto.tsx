import type { ReactNode } from 'react';
import { Breadcrumb } from './Breadcrumb';
import { LineaConfianza } from './LineaConfianza';
import { paginaPorId } from '../lib/seo';

/** Marco de las páginas de texto del sitio (metodología, transparencia…): migas, H1, línea de confianza y contenido. */
export function PaginaTexto({ id, children, borrador = false }: { id: string; children: ReactNode; borrador?: boolean }) {
  const p = paginaPorId(id);
  return (
    <article className="contenido">
      <Breadcrumb niveles={[{ texto: 'Inicio', href: '/' }, { texto: p.nombre }]} />
      {borrador && (
        <p className="borrador" role="note">
          <strong>Borrador.</strong> Esta página aún no está completa: no se indexa ni entra al sitemap.
        </p>
      )}
      <h1>{p.h1}</h1>
      <LineaConfianza id={id} tipo="guia" />
      {children}
    </article>
  );
}
