import { paginaPorId } from '../lib/seo';
import { Breadcrumb } from './Breadcrumb';

/** Página institucional que aún no tiene wireframe: borrador visible, noindex y fuera del sitemap. Se diseña después. */
export function PaginaBorrador({ id }: { id: string }) {
  const p = paginaPorId(id);
  return (
    <div className="contenido">
      <Breadcrumb niveles={[{ texto: 'Inicio', href: '/' }, { texto: p.nombre }]} />
      <p className="borrador" role="note">
        <strong>Borrador.</strong> Esta página aún no está diseñada: no se indexa ni entra al sitemap. <span className="verificar">[VERIFICAR] contenido pendiente</span>
      </p>
      <h1>{p.h1}</h1>
      <p>{p.description}</p>
    </div>
  );
}
