import Politica from '@app/politica-de-datos/page';
import { JsonLd } from '../../../components/JsonLd';
import { metadataDe } from '../../../lib/seo';

export const metadata = metadataDe('Legal-2');

/** La Política de datos se sirve desde el sitio con el mismo componente que usaba la app: un solo texto. */
export default function Pagina() {
  return (
    <div className="app-legal">
      <Politica />
      <JsonLd id="Legal-2" />
    </div>
  );
}
