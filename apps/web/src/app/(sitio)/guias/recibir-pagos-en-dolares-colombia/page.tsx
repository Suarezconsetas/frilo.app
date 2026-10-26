import { JsonLd } from '../../../../components/JsonLd';
import { ContenidoP09 } from '../../../../paginas/P09';
import { metadataDe } from '../../../../lib/seo';
import { SigueCon } from '../../../../components/SigueCon';

export const metadata = metadataDe('P09');

export default function Pagina() {
  return (
    <>
      <ContenidoP09 />
      <SigueCon id="P09" />
      <JsonLd id="P09" />
    </>
  );
}
