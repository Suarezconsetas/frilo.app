import { JsonLd } from '../../../../components/JsonLd';
import { ContenidoP08 } from '../../../../paginas/P08';
import { metadataDe } from '../../../../lib/seo';

export const metadata = metadataDe('P08');

export default function Pagina() {
  return (
    <>
      <ContenidoP08 />
      <JsonLd id="P08" />
    </>
  );
}
