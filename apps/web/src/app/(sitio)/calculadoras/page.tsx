import { JsonLd } from '../../../components/JsonLd';
import { ContenidoHubCalculadoras } from '../../../paginas/Hub-C';
import { metadataDe } from '../../../lib/seo';

export const metadata = metadataDe('Hub-C');

export default function Pagina() {
  return (
    <>
      <ContenidoHubCalculadoras />
      <JsonLd id="Hub-C" />
    </>
  );
}
