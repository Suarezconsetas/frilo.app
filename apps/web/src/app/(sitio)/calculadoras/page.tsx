import { JsonLd } from '../../../components/JsonLd';
import { ContenidoHubCalculadoras } from '../../../paginas/Hub-C';
import { metadataDe } from '../../../lib/seo';
import { TerminosClave } from '../../../components/TerminosClave';
import { SigueCon } from '../../../components/SigueCon';

export const metadata = metadataDe('Hub-C');

export default function Pagina() {
  return (
    <>
      <ContenidoHubCalculadoras />
      <TerminosClave />
      <SigueCon id="Hub-C" />
      <JsonLd id="Hub-C" />
    </>
  );
}
