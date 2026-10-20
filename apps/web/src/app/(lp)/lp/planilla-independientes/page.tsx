import { JsonLd } from '../../../../components/JsonLd';
import { ContenidoSEM } from '../../../../paginas/SEM';
import { metadataDe } from '../../../../lib/seo';

export const metadata = metadataDe('SEM');

// La landing de pauta no se indexa (noindex, follow) y no entra al sitemap.

export default function Pagina() {
  return (
    <>
      <ContenidoSEM />
      <JsonLd id="SEM" />
    </>
  );
}
