import { JsonLd } from '../../../../components/JsonLd';
import { ContenidoP04 } from '../../../../paginas/P04';
import { metadataDe } from '../../../../lib/seo';

export const metadata = metadataDe('P04');

export default function Pagina() {
  return (
    <>
      <ContenidoP04 />
      <JsonLd id="P04" />
    </>
  );
}
