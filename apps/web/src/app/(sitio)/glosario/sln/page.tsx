import { JsonLd } from '../../../../components/JsonLd';
import { ContenidoP06 } from '../../../../paginas/P06';
import { metadataDe } from '../../../../lib/seo';
import { SigueCon } from '../../../../components/SigueCon';

export const metadata = metadataDe('P06');

export default function Pagina() {
  return (
    <>
      <ContenidoP06 />
      <SigueCon id="P06" />
      <JsonLd id="P06" />
    </>
  );
}
