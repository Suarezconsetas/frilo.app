import Terminos from '@app/terminos/page';
import { JsonLd } from '../../../components/JsonLd';
import { metadataDe } from '../../../lib/seo';

export const metadata = metadataDe('Legal-1');

/** Los Términos de uso se sirven desde el sitio con el mismo componente que usaba la app: un solo texto. */
export default function Pagina() {
  return (
    <div className="app-legal">
      <Terminos />
      <JsonLd id="Legal-1" />
    </div>
  );
}
